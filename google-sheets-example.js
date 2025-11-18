import { GoogleSpreadsheet } from 'google-spreadsheet';

// ตั้งค่า credentials จาก environment variables (ไม่เก็บ key จริงในโค้ด)
const serviceAccount = {
  client_email: process.env.SERVICE_ACCOUNT_EMAIL || 'your-service-account-email@project-id.iam.gserviceaccount.com',
  private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_FROM_ENV',
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

export {
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