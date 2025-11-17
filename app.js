const { accessGoogleSheet, getSpecificRange } = require('./google-sheets-example');

// ฟังก์ชันหลักสำหรับทดสอบ
async function main() {
  console.log('=== ทดสอบการเชื่อมต่อ Google Sheets ===\n');

  // ดึงข้อมูลทั้งหมด
  console.log('1. กำลังดึงข้อมูลทั้งหมด...');
  const allData = await accessGoogleSheet();

  if (allData) {
    console.log('\n=== สรุปข้อมูล ===');
    console.log(`พบข้อมูลทั้งหมด ${allData.length} แถว`);

    // แสดงข้อมูลบางส่วน
    if (allData.length > 0) {
      const firstRow = allData[0];
      console.log('\nคอลัมน์ที่มีอยู่:');
      Object.keys(firstRow).forEach(key => {
        if (key !== 'rowNumber' && key !== '_rawData') {
          console.log(`- ${key}`);
        }
      });
    }
  }

  console.log('\n' + '='.repeat(50));

  // ดึงข้อมูลเฉพาะช่วง
  console.log('\n2. กำลังดึงข้อมูลในช่วง A1:C10...');
  await getSpecificRange();

  console.log('\n=== ทดสอบเสร็จสิ้น ===');
}

// รันฟังก์ชันหลัก
main().catch(console.error);