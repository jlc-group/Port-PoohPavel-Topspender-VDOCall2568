import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Import Google Sheets functionality
import {
  getSheetData,
  searchCustomerByPhone,
  getCustomerRights,
  getTopSpenderData,
  getVDOCallData,
  getRegisteredTopSpenderData,
  searchTopSpenderByPhone,
  searchVDOCallByPhone
} from './google-sheets-example.js';

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Lucky Draw API is running',
    timestamp: new Date().toISOString()
  });
});

// Search customer by phone
app.get('/api/customer/search/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const customers = await getSheetData();

    // Search by phone number
    const customer = customers.find(c =>
      c.telephone && c.telephone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, '')
    );

    if (!customer) {
      return res.status(404).json({
        error: 'ไม่พบข้อมูลลูกค้า',
        message: 'กรุณาตรวจสอบเบอร์โทรศัพท์อีกครั้ง'
      });
    }

    // Mask sensitive data
    const maskedCustomer = {
      user_id: customer.user_id,
      name: customer.name,
      surname: customer.surname ? customer.surname[0] + '...' : '',
      telephone: maskPhone(customer.telephone),
      email: customer.email ? customer.email.substring(0, 3) + '***@***.com' : '',
      tickets_top_spender: parseInt(customer.tickets_top_spender) || 0,
      tickets_vdocall: parseInt(customer.tickets_vdocall) || 0
    };

    res.json({
      success: true,
      customer: maskedCustomer
    });

  } catch (error) {
    console.error('Error searching customer:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในระบบ',
      message: 'กรุณาลองใหม่อีกครั้งในภายหลัง'
    });
  }
});

// Get customer rights details
app.get('/api/customer/:id/rights', async (req, res) => {
  try {
    const { id } = req.params;
    const customers = await getSheetData();

    const customer = customers.find(c => c.user_id == id);

    if (!customer) {
      return res.status(404).json({
        error: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    res.json({
      success: true,
      rights: {
        top_spender: {
          total: parseInt(customer.tickets_top_spender) || 0,
          available: parseInt(customer.tickets_top_spender) || 0, // สมมติว่ายังไม่มีการใช้
          type: 'ซอง',
          description: 'สิทธิ์ลุ้น Top Spender'
        },
        vdocall: {
          total: parseInt(customer.tickets_vdocall) || 0,
          available: parseInt(customer.tickets_vdocall) || 0, // สมมติว่ายังไม่มีการใช้
          type: 'หลอด',
          description: 'สิทธิ์ VDO Call'
        }
      }
    });

  } catch (error) {
    console.error('Error getting customer rights:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
});

// Get all customers with ranking data
app.get('/api/customers', async (req, res) => {
  try {
    const { sortBy = 'top_spender', order = 'desc' } = req.query;
    const customers = await getSheetData();

    // Sort customers based on requested criteria
    const sortedCustomers = [...customers].sort((a, b) => {
      const aValue = sortBy === 'top_spender' ? a.tickets_top_spender : a.tickets_vdocall;
      const bValue = sortBy === 'top_spender' ? b.tickets_top_spender : b.tickets_vdocall;

      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });

    // Add rankings
    const customersWithRank = sortedCustomers.map((customer, index) => ({
      ...customer,
      rank: index + 1,
      name: customer.name || '',
      surname: customer.surname || '',
      email: customer.email || '',
      telephone: customer.telephone || customer.phone || '',
      tickets_top_spender: parseInt(customer.tickets_top_spender) || 0,
      tickets_vdocall: parseInt(customer.tickets_vdocall) || 0
    }));

    res.json({
      success: true,
      customers: customersWithRank,
      total: customersWithRank.length
    });

  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
});

// Export customers data as CSV
app.get('/api/customers/export', async (req, res) => {
  try {
    const { type = 'top_spender', search = '', startDate = '', endDate = '' } = req.query;
    const customers = await getSheetData();

    // Filter and sort customers
    let filteredCustomers = customers.filter(customer => {
      const matchesSearch = !search ||
        `${customer.name} ${customer.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        (customer.telephone || '').includes(search);

      // TODO: Add date filtering if needed from Google Sheets

      return matchesSearch;
    });

    // Sort by the specified type
    filteredCustomers.sort((a, b) => {
      const aValue = type === 'top_spender' ? a.tickets_top_spender : a.tickets_vdocall;
      const bValue = type === 'top_spender' ? b.tickets_top_spender : b.tickets_vdocall;
      return bValue - aValue;
    });

    // Add rankings
    const customersWithRank = filteredCustomers.map((customer, index) => ({
      rank: index + 1,
      name: customer.name,
      surname: customer.surname,
      telephone: customer.telephone,
      email: customer.email,
      top_spender_tickets: customer.tickets_top_spender,
      vdocall_tickets: customer.tickets_vdocall
    }));

    // Generate CSV
    const csvHeaders = 'ลำดับ,ชื่อ,นามสกุล,เบอร์โทร,อีเมล,สิทธิ์ Top Spender,สิทธิ์ VDO Call\n';
    const csvRows = customersWithRank.map(customer =>
      `${customer.rank},${customer.name},${customer.surname},${customer.telephone},${customer.email},${customer.top_spender_tickets},${customer.vdocall_tickets}`
    ).join('\n');

    const csvContent = csvHeaders + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="lucky-draw-${type}-${new Date().toISOString().split('T')[0]}.csv"`);

    // Add BOM for proper Thai character display in Excel
    const BOM = '\uFEFF';
    res.send(BOM + csvContent);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล'
    });
  }
});

// NEW API Endpoints for Top Spender and VDO Call

// Get all Top Spender customers
app.get('/api/top-spender/customers', async (req, res) => {
  try {
    const customers = await getTopSpenderData();
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error getting Top Spender customers:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล Top Spender'
    });
  }
});

// Get all VDO Call customers
app.get('/api/vdo-call/customers', async (req, res) => {
  try {
    const customers = await getVDOCallData();
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error getting VDO Call customers:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล VDO Call'
    });
  }
});

// Search Top Spender by name, surname, or phone
app.get('/api/top-spender/search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const customer = await searchTopSpenderByPhone(searchTerm);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูล Top Spender',
        message: 'กรุณาตรวจสอบชื่อ นามสกุล หรือเบอร์โทรศัพท์อีกครั้ง'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error searching Top Spender:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการค้นหา Top Spender'
    });
  }
});

// Get registered Top Spender data
app.get('/api/registered-top-spender/customers', async (req, res) => {
  try {
    const registrations = await getRegisteredTopSpenderData();

    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('Error getting registered Top Spender data:', error);
    res.status(500).json({
      success: false,
      error: 'ไม่สามารถดึงข้อมูลผู้ลงทะเบียน Top Spender ได้',
      message: error.message
    });
  }
});

// Search VDO Call by name, surname, or phone
app.get('/api/vdo-call/search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const customer = await searchVDOCallByPhone(searchTerm);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูล VDO Call',
        message: 'กรุณาตรวจสอบชื่อ นามสกุล หรือเบอร์โทรศัพท์อีกครั้ง'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error searching VDO Call:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการค้นหา VDO Call'
    });
  }
});

// Combined search across both Top Spender and VDO Call datasets
app.get('/api/combined-search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params;

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
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูล',
        message: 'กรุณาตรวจสอบชื่อ นามสกุล หรือเบอร์โทรศัพท์อีกครั้ง'
      });
    }

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Error in combined search:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการค้นหา'
    });
  }
});

// Helper function to mask phone number
function maskPhone(phone) {
  if (!phone) return '-';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 4) return phone;
  const last2 = digits.slice(-2);
  return `xxx-xxxxx${last2}`;
}

// Serve main page for root route only
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve main page for other non-API routes (except admin)
app.get(/^\/(?!api|admin$).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
🎯 Lucky Draw Customer Portal พร้อมใช้งานแล้ว!
📍 URL: http://localhost:${PORT}
🔗 API: http://localhost:${PORT}/api
⏰ เวลา: ${new Date().toLocaleString('th-TH')}
  `);
});

export default app;