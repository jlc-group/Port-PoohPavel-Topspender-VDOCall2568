// Cloudflare Function for Combined Search API
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Environment variables for Cloudflare Pages
const SPREADSHEET_ID = '1PA4KRWqZFSeI8R88-8_S4ZhvayJBugHOZboevVo9cMg';
const SERVICE_ACCOUNT_EMAIL = 'google-sheets-api-poohpavel@port-poohpavel2568.iam.gserviceaccount.com';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDjStLOk4c346Tg\nW2WnQeOun0qhXqscY5KbTWwFehny/MOnNVJF1hJU+yaDIKEafX3KyJ0V+PVcdaMp\nSYDmXNZLL4pr0S6zFxW/4CjuOtrLP83VdvS4JTuDN5oq6kOmGjaEe+AxyeRT9v5M\n63rxNh4KKfatKeq0n8ppMXk5akLVjFvkdHetUk6K9dS2vXghZKShkGyFdYup+eiY\nBEfZcldLdZA7roZjtlrM5TaVdDdJsP317qc7n9zZ/pvMUgq0auRW6ar3psYt/7XL\ncXilvRcmAGBZcO7XTpq/NYRGtSybk6pFZkHD4g40g4pggXtNt7FN+UYGtTzAyadb\nKYVKusLfAgMBAAECggEAHdK+XghMg0BVl3IBS2ohV6h4sJDNOeXfduI4l3AMge4O\n4VyP5YWaaoJ5F1aLh6rJ+8welHinVSZDA5KsnPgMeYQM5msQShka1k4xgK9smvj4\nZ0HQXW3Wj7fsJ3pikvkN3eH/1PiX2Dk959Y0D6dZV128i2nHF+5+2Wuk64GDsHpB\ncjpCyGnjYkoqvhyNHjv8oh4XTtXXCYkBt33YPqIEcQEsiBcgkJNAk2+LaC0gqgRb\nX5XkSP4SYAP8KuX4RaVXZ2XGLVngDcKD4Y9kcJgPd1GhPoYv8saQ69rPrwUlOHAM\nI7ZA6n1lQhZHOSw45KvcUvmW4UZj5DrymFC6bfjSZQKBgQDya7KeF8RX2Qk1v+oc\nlaU7j95tECJ18azTAWB4wR9blzVkNrvHSy+H5H+wGflOmNGsbr4JHW3eu8XzEj0C\n4jDoYSqi+FfpxzuRC1aGxfP0cKxafWdoCoevenSnoFB6wYuFKkkrUacIpWGPN6sh\nc+a+kBvIhSBwNQVgKAAVZpIdpQKBgQDwBi9XBW+u7u1Zb+wsnAOZLMPF4npe3oy5\nzTZG4vK1b4Cpz5mcB78hQz366Zg1K+mXrbmD8DqstV/YpUxiJp32H3BwuHpZKjOM\nwr8l5KxICLJ46tC0rBBgW4zucBPXXqfV7IvMukaALwDWZQZMkQe1+virgBrCsYAb\n+bXcgyJ/MwKBgQCKKiebQyB8kQ5WvBLKR9/smorCzjdV0XAWsuow6KDeqsebXjaX\n15o3cVv1GlilGyQlith0iXldQNgJOZPcWN5XE0ohqDky3IJuoG+oUJpB7xXMXTza\nZ2X99WUXRJ+Z10WVmAwrzFXO77My1R+L6WrRoYC0QGvEh/OQYjvp9pPAoQKBgHG5\nvHxy6vPr6THTQgfw9BODjk8Ye/qvX+Y5QVpc9brZ1hCfeJzhXsIX5ioYvDGVWNyx\nR5EoJeTnGz6/M23d9kJDqzb9cZsFz98F9yOxMZ//3vBD8hdo32mId0ISgJQvGT7X\nEXYzXGwn2TG8NDvbC9hBzckUrZlKGPUoX+7Xg2TZAoGANEmbci3SzAegf32oJMUu\nh4dPSzSjh1xlqJIqOdSmn2cSWyBvxbAwLcNNt498sZItrL8N/rbsg/JHDbu8sJgD\nrTWvs1sgza+jrKUAVXRjQv8EPmURC8+nmbClNCrBZLCiEnk6WeLT93qm0uA+C4Bt\nH8duuZ9K6rLEOdCACoZtIjg=\n-----END PRIVATE KEY-----\n';

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

async function getVDOCallData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Create service account credentials object
    const serviceAccount = {
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY
    };

    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    // Look for sheet named "VDO Call"
    let sheet = doc.sheetsByTitle['VDO Call'];
    if (!sheet) {
      console.log('Sheet "VDO Call" not found, using second sheet');
      sheet = doc.sheetsByIndex[1] || doc.sheetsByIndex[0];
    }

    const rows = await sheet.getRows();

    const customers = rows.map((row, index) => ({
      ลำดับ: parseInt(row['ลำดับ']) || index + 1,
      ชื่อ: row['ชื่อ'] || row['name'] || '',
      นามสกุล: row['นามสกุล'] || row['surname'] || '',
      อีเมล์: row['อีเมล์'] || row['email'] || '',
      เบอรโทร: row['เบอรโทร'] || row['telephone'] || row['phone'] || '',
      สิทธิ_VDO_Call: parseInt(row['สิทธิ VDO Call']) || parseInt(row['สิทธิ์ VDO Call']) || parseInt(row['tickets_vdocall']) || 0
    }));

    return customers;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล VDO Call:', error);
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

async function searchVDOCallByPhone(searchTerm) {
  try {
    const customers = await getVDOCallData();
    if (!searchTerm || !searchTerm.trim()) return null;

    // Calculate match scores for all customers using the same scoring system
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
    console.error('เกิดข้อผิดพลาดในการค้นหา VDO Call:', error);
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
    // Route handling for combined search
    if (url.pathname.includes('/api/combined-search/') && request.method === 'GET') {
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

      // Search in both datasets simultaneously
      const [topSpenderResult, vdoCallResult] = await Promise.all([
        searchTopSpenderByPhone(searchTerm),
        searchVDOCallByPhone(searchTerm)
      ]);

      const results = {
        topSpender: topSpenderResult,
        vdoCall: vdoCallResult
      };

      // Check if we found any results
      const hasResults = topSpenderResult || vdoCallResult;

      if (!hasResults) {
        return new Response(JSON.stringify({
          success: false,
          error: 'ไม่พบข้อมูล',
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
        data: results
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
    console.error('Combined Search API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'เกิดข้อผิดพลาดในการค้นหา',
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