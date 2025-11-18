// Cloudflare Function for Registered Users API
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Environment variables for Cloudflare Pages Functions
// These are read from Cloudflare Pages Settings > Environment Variables/Secrets
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1PA4KRWqZFSeI8R88-8_S4ZhvayJBugHOZboevVo9cMg';
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL || 'google-sheets-api-poohpavel@port-poohpavel2568.iam.gserviceaccount.com';
const PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.PRIVATE_KEY;

// Thai character normalization for better search
function normalizeThaiText(text) {
  if (!text) return '';
  return text.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[่้๊๋]/g, '') // Remove Thai tone marks for better matching
    .replace(/[ัิ]/g, '')   // Remove Thai vowels for better matching
    .trim();
}

// Calculate match score for search results
function calculateMatchScore(searchTerm, customer) {
  const normalizedSearch = normalizeThaiText(searchTerm);
  const cleanPhone = searchTerm.replace(/[^0-9]/g, '');
  let score = 0;

  // Phone number matching (highest priority for phone searches)
  if (cleanPhone && customer.เบอรโทร) {
    const customerPhone = customer.เบอรโทร.replace(/[^0-9]/g, '');
    if (customerPhone === cleanPhone) {
      score += 10; // Exact phone match
    } else if (customerPhone.includes(cleanPhone) && cleanPhone.length >= 4) {
      score += 5; // Partial phone match (only if meaningful length)
    }
  }

  // Email matching
  if (customer.อีเมล์) {
    const email = normalizeThaiText(customer.อีเมล์);
    if (email.includes(normalizedSearch) && normalizedSearch.length >= 2) {
      score += 8;
    }
  }

  // Name matching
  const firstName = normalizeThaiText(customer.ชื่อ);
  const lastName = normalizeThaiText(customer.นามสกุล);
  const fullName = normalizeThaiText(`${customer.ชื่อ} ${customer.นามสกุล}`);

  // Exact full name match (highest score)
  if (fullName === normalizedSearch) {
    score += 15;
  }
  // Exact first name match
  else if (firstName === normalizedSearch) {
    score += 12;
  }
  // Exact last name match
  else if (lastName === normalizedSearch) {
    score += 12;
  }
  // Partial name matches (lower scores)
  else if (firstName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
    score += 8;
  }
  else if (lastName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
    score += 8;
  }
  else if (fullName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
    score += 6;
  }

  return score;
}

async function getRegisteredUsersData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Create service account credentials object
    const serviceAccount = {
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY
    };

    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    // Get all sheets and combine data from all tabs
    const allCustomers = [];
    const processedEmails = new Set(); // To avoid duplicates

    // Process Top Spender sheet
    if (doc.sheetsByTitle['Top Spender']) {
      const topSpenderSheet = doc.sheetsByTitle['Top Spender'];
      const topSpenderRows = await topSpenderSheet.getRows();

      topSpenderRows.forEach((row) => {
        const email = row['อีเมล์'] || row['email'] || '';
        if (email && !processedEmails.has(email)) {
          processedEmails.add(email);
          allCustomers.push({
            ลำดับ: allCustomers.length + 1,
            ชื่อ: row['ชื่อ'] || row['name'] || '',
            นามสกุล: row['นามสกุล'] || row['surname'] || '',
            อีเมล์: email,
            เบอรโทร: row['เบอรโทร'] || row['telephone'] || row['phone'] || '',
            สิทธิ_TopSpender: parseInt(row['สิทธิ TopSpender']) || parseInt(row['สิทธิ์ TopSpender']) || parseInt(row['tickets_top_spender']) || 0,
            สิทธิ_VDO_Call: 0,
            ประเภท: 'Top Spender'
          });
        }
      });
    }

    // Process VDO Call sheet
    if (doc.sheetsByTitle['VDO Call']) {
      const vdoCallSheet = doc.sheetsByTitle['VDO Call'];
      const vdoCallRows = await vdoCallSheet.getRows();

      vdoCallRows.forEach((row) => {
        const email = row['อีเมล์'] || row['email'] || '';
        if (email && !processedEmails.has(email)) {
          processedEmails.add(email);
          allCustomers.push({
            ลำดับ: allCustomers.length + 1,
            ชื่อ: row['ชื่อ'] || row['name'] || '',
            นามสกุล: row['นามสกุล'] || row['surname'] || '',
            อีเมล์: email,
            เบอรโทร: row['เบอรโทร'] || row['telephone'] || row['phone'] || '',
            สิทธิ_TopSpender: 0,
            สิทธิ_VDO_Call: parseInt(row['สิทธิ VDO Call']) || parseInt(row['สิทธิ์ VDO Call']) || parseInt(row['tickets_vdocall']) || 0,
            ประเภท: 'VDO Call'
          });
        }
      });
    }

    // Sort by registration order (ลำดับ)
    allCustomers.sort((a, b) => a.ลำดับ - b.ลำดับ);

    return allCustomers;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Registered Users:', error);
    return [];
  }
}

async function searchRegisteredUsers(searchTerm) {
  try {
    const customers = await getRegisteredUsersData();
    if (!searchTerm || !searchTerm.trim()) return customers;

    // Calculate match scores for all customers
    const matches = customers
      .map(customer => ({
        customer,
        score: calculateMatchScore(searchTerm, customer)
      }))
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score); // Sort by highest score first

    // Return sorted customers by score
    return matches.map(match => match.customer);

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการค้นหา Registered Users:', error);
    return [];
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // Route handling
    if (url.pathname === '/api/registered-users/customers' && request.method === 'GET') {
      const customers = await getRegisteredUsersData();
      return new Response(JSON.stringify({
        success: true,
        data: customers,
        count: customers.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (url.pathname.includes('/api/registered-users/search/') && request.method === 'GET') {
      const pathParts = url.pathname.split('/');
      const searchTerm = pathParts[pathParts.length - 1];

      if (!searchTerm) {
        return new Response(JSON.stringify({
          success: false,
          error: 'ไม่พบคำค้นหา'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      const customers = await searchRegisteredUsers(searchTerm);

      if (customers.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'ไม่พบข้อมูลผู้ลงทะเบียน',
          message: 'กรุณาตรวจสอบชื่อ นามสกุล อีเมล หรือเบอร์โทรศัพท์อีกครั้ง'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: customers,
        count: customers.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({
      success: false,
      error: 'ไม่พบ API endpoint ที่ร้องขอ'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Registered Users API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'เกิดข้อผิดพลาดในระบบ',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}