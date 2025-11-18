// Cloudflare Function for Top Spender API
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

async function getTopSpenderData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Create service account credentials object
    const serviceAccount = {
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY
    };

    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    // Look for sheet named "Top Spender"
    let sheet = doc.sheetsByTitle['Top Spender'];
    if (!sheet) {
      console.log('Sheet "Top Spender" not found, using first sheet');
      sheet = doc.sheetsByIndex[0];
    }

    const rows = await sheet.getRows();

    const customers = rows.map((row, index) => ({
      ลำดับ: parseInt(row['ลำดับ']) || index + 1,
      ชื่อ: row['ชื่อ'] || row['name'] || '',
      นามสกุล: row['นามสกุล'] || row['surname'] || '',
      อีเมล์: row['อีเมล์'] || row['email'] || '',
      เบอรโทร: row['เบอรโทร'] || row['telephone'] || row['phone'] || '',
      สิทธิ_TopSpender: parseInt(row['สิทธิ TopSpender']) || parseInt(row['สิทธิ์ TopSpender']) || parseInt(row['tickets_top_spender']) || 0
    }));

    return customers;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Top Spender:', error);
    return [];
  }
}

async function searchTopSpenderByPhone(searchTerm) {
  try {
    const customers = await getTopSpenderData();
    if (!searchTerm || !searchTerm.trim()) return null;

    // Calculate match scores for all customers
    const matches = customers
      .map(customer => ({
        customer,
        score: calculateMatchScore(searchTerm, customer)
      }))
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score); // Sort by highest score first

    // Return the best match (highest score) or null if no matches
    return matches.length > 0 ? matches[0].customer : null;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการค้นหา Top Spender:', error);
    return null;
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
    if (url.pathname === '/api/top-spender/customers' && request.method === 'GET') {
      const customers = await getTopSpenderData();
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

    if (url.pathname.includes('/api/top-spender/search/') && request.method === 'GET') {
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

      const customer = await searchTopSpenderByPhone(searchTerm);

      if (!customer) {
        return new Response(JSON.stringify({
          success: false,
          error: 'ไม่พบข้อมูล Top Spender',
          message: 'กรุณาตรวจสอบชื่อ นามสกุล หรือเบอร์โทรศัพท์อีกครั้ง'
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
        data: customer
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
    console.error('Top Spender API Error:', error);
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