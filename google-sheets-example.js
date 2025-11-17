const { GoogleSpreadsheet } = require('google-spreadsheet');

// ตั้งค่า credentials จากไฟล์ JSON จริง
const serviceAccount = {
  client_email: 'google-sheets-api-poohpavel@port-poohpavel2568.iam.gserviceaccount.com',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDjStLOk4c346Tg\nW2WnQeOun0qhXqscY5KbTWwFehny/MOnNVJF1hJU+yaDIKEafX3KyJ0V+PVcdaMp\nSYDmXNZLL4pr0S6zFxW/4CjuOtrLP83VdvS4JTuDN5oq6kOmGjaEe+AxyeRT9v5M\n63rxNh4KKfatKeq0n8ppMXk5akLVjFvkdHetUk6K9dS2vXghZKShkGyFdYup+eiY\nBEfZcldLdZA7roZjtlrM5TaVdDdJsP317qc7n9zZ/pvMUgq0auRW6ar3psYt/7XL\ncXilvRcmAGBZcO7XTpq/NYRGtSybk6pFZkHD4g40g4pggXtNt7FN+UYGtTzAyadb\nKYVKusLfAgMBAAECggEAHdK+XghMg0BVl3IBS2ohV6h4sJDNOeXfduI4l3AMge4O\n4VyP5YWaaoJ5F1aLh6rJ+8welHinVSZDA5KsnPgMeYQM5msQShka1k4xgK9smvj4\nZ0HQXW3Wj7fsJ3pikvkN3eH/1PiX2Dk959Y0D6dZV128i2nHF+5+2Wuk64GDsHpB\ncjpCyGnjYkoqvhyNHjv8oh4XTtXXCYkBt33YPqIEcQEsiBcgkJNAk2+LaC0gqgRb\nX5XkSP4SYAP8KuX4RaVXZ2XGLVngDcKD4Y9kcJgPd1GhPoYv8saQ69rPrwUlOHAM\nI7ZA6n1lQhZHOSw45KvcUvmW4UZj5DrymFC6bfjSZQKBgQDya7KeF8RX2Qk1v+oc\nlaU7j95tECJ18azTAWB4wR9blzVkNrvHSy+H5H+wGflOmNGsbr4JHW3eu8XzEj0C\n4jDoYSqi+FfpxzuRC1aGxfP0cKxafWdoCoevenSnoFB6wYuFKkkrUacIpWGPN6sh\nc+a+kBvIhSBwNQVgKAAVZpIdpQKBgQDwBi9XBW+u7u1Zb+wsnAOZLMPF4npe3oy5\nzTZG4vK1b4Cpz5mcB78hQz366Zg1K+mXrbmD8DqstV/YpUxiJp32H3BwuHpZKjOM\nwr8l5KxICLJ46tC0rBBgW4zucBPXXqfV7IvMukaALwDWZQZMkQe1+virgBrCsYAb\n+bXcgyJ/MwKBgQCKKiebQyB8kQ5WvBLKR9/smorCzjdV0XAWsuow6KDeqsebXjaX\n15o3cVv1GlilGyQlith0iXldQNgJOZPcWN5XE0ohqDky3IJuoG+oUJpB7xXMXTza\nZ2X99WUXRJ+Z10WVmAwrzFXO77My1R+L6WrRoYC0QGvEh/OQYjvp9pPAoQKBgHG5\nvHxy6vPr6THTQgfw9BODjk8Ye/qvX+Y5QVpc9brZ1hCfeJzhXsIX5ioYvDGVWNyx\nR5EoJeTnGz6/M23d9kJDqzb9cZsFz98F9yOxMZ//3vBD8hdo32mId0ISgJQvGT7X\nEXYzXGwn2TG8NDvbC9hBzckUrZlKGPUoX+7Xg2TZAoGANEmbci3SzAegf32oJMUu\nh4dPSzSjh1xlqJIqOdSmn2cSWyBvxbAwLcNNt498sZItrL8N/rbsg/JHDbu8sJgD\nrTWvs1sgza+jrKUAVXRjQv8EPmURC8+nmbClNCrBZLCiEnk6WeLT93qm0uA+C4Bt\nH8duuZ9K6rLEOdCACoZtIjg=\n-----END PRIVATE KEY-----\n'
};

// Spreadsheet ID จาก URL ของ Google Sheets - ID: 1PA4KRWqZFSeI8R88-8_S4ZhvayJBugHOZboevVo9cMg
const SPREADSHEET_ID = '1PA4KRWqZFSeI8R88-8_S4ZhvayJBugHOZboevVo9cMg';

async function accessGoogleSheet() {
  try {
    // สร้าง instance ของ Google Spreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // ยืนยันตัวตนด้วย Service Account
    await doc.useServiceAccountAuth(serviceAccount);

    // โหลดข้อมูล Spreadsheet
    await doc.loadInfo();

    console.log('Spreadsheet Title:', doc.title);

    // เลือก worksheet แรก
    const sheet = doc.sheetsByIndex[0];
    console.log('Worksheet Title:', sheet.title);

    // ดึงข้อมูลทั้งหมดใน worksheet
    const rows = await sheet.getRows();
    console.log(`จำนวนข้อมูลทั้งหมด: ${rows.length} แถว`);

    // แสดงข้อมูล 5 แถวแรก
    rows.slice(0, 5).forEach((row, index) => {
      console.log(`\nแถวที่ ${index + 1}:`);
      Object.keys(row).forEach(key => {
        if (key !== 'rowNumber' && key !== '_rawData') {
          console.log(`  ${key}: ${row[key]}`);
        }
      });
    });

    return rows;

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    return null;
  }
}

async function getSpecificRange() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    // ดึงข้อมูลเฉพาะช่วง A1:C10
    await sheet.loadCells('A1:C10');

    const data = [];
    for (let row = 0; row < 10; row++) {
      const rowData = [];
      for (let col = 0; col < 3; col++) {
        const cell = sheet.getCell(row, col);
        rowData.push(cell.value);
      }
      data.push(rowData);
    }

    console.log('ข้อมูลในช่วง A1:C10:', data);
    return data;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลช่วงที่กำหนด:', error);
    return null;
  }
}

// Helper function to get all sheet data as customer objects
async function getSheetData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Convert rows to customer objects with consistent field names
    const customers = rows.map(row => ({
      user_id: parseInt(row['user_id']) || 0,
      name: row['name'] || '',
      surname: row['surname'] || '',
      email: row['email'] || '',
      telephone: row['telephone'] || row['phone'] || '',
      tickets_top_spender: parseInt(row['tickets_top_spender']) || parseInt(row['top_spender_tickets']) || 0,
      tickets_vdocall: parseInt(row['tickets_vdocall']) || parseInt(row['vdocall_tickets']) || 0
    }));

    return customers;

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า:', error);
    return [];
  }
}

// Get data from Top Spender sheet
async function getTopSpenderData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
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

// Get data from Top Spender Registration sheet
async function getRegisteredTopSpenderData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    // Debug: Print all available sheets
    console.log('Available sheets:', Object.values(doc.sheetsByTitle).map(sheet => sheet.title));

    // Look for sheet named "รายชื่อผู้ลงทะเบียนเข้าร่วม Top Spender"
    let sheet = doc.sheetsByTitle['รายชื่อผู้ลงทะเบียนเข้าร่วม Top Spender'];
    if (!sheet) {
      // Try to find sheet with similar name
      const possibleSheets = doc.sheetsByTitle;
      const sheetName = Object.keys(possibleSheets).find(name =>
        name.includes('รายชื่อ') && name.includes('ลงทะเบียน') && name.includes('Top Spender')
      );
      if (sheetName) {
        sheet = doc.sheetsByTitle[sheetName];
        console.log('Found registration sheet with similar name:', sheetName);
      } else {
        console.log('Registration sheet not found, using third sheet as fallback');
        sheet = doc.sheetsByIndex[2] || doc.sheetsByIndex[0];
      }
    }

    const rows = await sheet.getRows();

    const registrations = rows.map((row, index) => {
      // Try different possible column names
      const fullName = row['ชื่อ'] || row['ชื่อเต็ม'] || row['name'] || row['full_name'] || '';
      const telephone = row['เบอรโทร'] || row['telephone'] || row['phone'] || row['เบอร์โทรศัพท์'] || '';

      return {
        ลำดับ: parseInt(row['ลำดับ']) || index + 1,
        ชื่อเต็ม: fullName,
        เบอรโทร: telephone,
        อีเมล: row['อีเมล'] || row['email'] || ''
      };
    }).filter(reg => reg.ชื่อเต็ม || reg.เบอรโทร); // Filter out empty rows

    return registrations;
  } catch (error) {
    console.error('Error getting registered Top Spender data:', error);
    return [];
  }
}

// Get data from VDO Call sheet
async function getVDOCallData() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
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

// Search customer by name, surname, or phone number in Top Spender sheet
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

// Search customer by name, surname, or phone number in VDO Call sheet
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

// Search customer by phone number
async function searchCustomerByPhone(phone) {
  try {
    const customers = await getSheetData();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    return customers.find(customer => {
      const customerPhone = customer.telephone.replace(/[^0-9]/g, '');
      return customerPhone === cleanPhone;
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการค้นหาลูกค้า:', error);
    return null;
  }
}

// Get customer rights by ID
async function getCustomerRights(customerId) {
  try {
    const customers = await getSheetData();
    const customer = customers.find(c => c.user_id === customerId);

    if (!customer) {
      return null;
    }

    return {
      top_spender: {
        total: customer.tickets_top_spender,
        available: customer.tickets_top_spender, // สมมติว่ายังไม่มีการใช้
        used: 0,
        type: 'ซอง',
        description: 'สิทธิ์ลุ้น Top Spender'
      },
      vdocall: {
        total: customer.tickets_vdocall,
        available: customer.tickets_vdocall, // สมมติว่ายังไม่มีการใช้
        used: 0,
        type: 'หลอด',
        description: 'สิทธิ์ VDO Call'
      }
    };

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิ์:', error);
    return null;
  }
}

module.exports = {
  accessGoogleSheet,
  getSpecificRange,
  getSheetData,
  searchCustomerByPhone,
  getCustomerRights,
  getTopSpenderData,
  getVDOCallData,
  getRegisteredTopSpenderData,
  searchTopSpenderByPhone,
  searchVDOCallByPhone
};