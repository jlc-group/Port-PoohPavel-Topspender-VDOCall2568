# Cloudflare Pages Deployment Guide

## ปัญหาที่แก้ไขแล้ว ✅

ปัญหาหลักคือการ deploy แอปพลิเคชันที่มีทั้ง Frontend (React) และ Backend (Express.js) ขึ้น Cloudflare Pages ซึ่งรองรับเฉพาะ Static Site แต่ไม่รองรับ Node.js Server

### สาเหตุของปัญหา
- Express.js API server (port 3005) ไม่สามารถทำงานบน Cloudflare Pages ได้
- Frontend พยายามเรียก API endpoint ที่ไม่มีอยู่จริงบน Cloudflare Pages
- ได้รับ HTML 404 page แทนที่จะเป็น JSON response

## วิธีแก้ไขที่ทำ ✅

### 1. แปลง Express Routes เป็น Cloudflare Functions
- `functions/api/top-spender.js` - จัดการข้อมูล Top Spender
- `functions/api/vdo-call.js` - จัดการข้อมูล VDO Call
- `functions/api/combined-search.js` - ค้นหาข้อมูลจากทั้งสอง sheet

### 2. อัพเดท Configuration
- `wrangler.toml` - กำหนดค่าสำหรับ Cloudflare Functions
- `src/utils/api.js` - ปรับ API endpoints ให้รองรับทั้ง development และ production

### 3. Environment Detection
- Development (localhost:3003) → ใช้ Express backend (port 3005)
- Production (*.pages.dev) → ใช้ Cloudflare Functions (relative paths)

## การ Deploy บน Cloudflare Pages

### Step 1: Build Project
```bash
npm run build
```

### Step 2: Deploy to Cloudflare Pages
```bash
npm run deploy
# หรือสำหรับ production
npm run deploy:prod
```

### Step 3: Setup Environment Variables (ถ้าต้องการ)
ใน Cloudflare Pages Dashboard:
1. ไปที่ Settings → Environment variables
2. เพิ่มตัวแปร:
   - `SPREADSHEET_ID`: 1PA4KRWqZFSeI8R88-8_S4ZhvayJBugHOZboevVo9cMg
   - `SERVICE_ACCOUNT_EMAIL`: google-sheets-api-poohpavel@port-poohpavel2568.iam.gserviceaccount.com

## การทำงานใน Local Development

### Full Development (Frontend + Backend)
```bash
npm run dev:local
```

### Frontend Only
```bash
npm run dev:frontend
```

### Backend Only
```bash
npm run dev
```

### Test Cloudflare Functions Locally
```bash
npm run wrangler:dev
```

## API Endpoints หลังการ Deploy

หลังจาก deploy แล้ว API endpoints จะทำงานผ่าน Cloudflare Functions:

- `GET /api/top-spender/customers` - ดึงข้อมูล Top Spender ทั้งหมด
- `GET /api/vdo-call/customers` - ดึงข้อมูล VDO Call ทั้งหมด
- `GET /api/combined-search/{searchTerm}` - ค้นหาข้อมูลจากทั้งสอง sheet
- `GET /api/top-spender/search/{searchTerm}` - ค้นหา Top Spender
- `GET /api/vdo-call/search/{searchTerm}` - ค้นหา VDO Call

## การตรวจสอบว่าใช้งานได้

1. **หน้าเว็บโหลดปกติ** - ไม่ขึ้น error 500 หรือ 404
2. **Search ทำงานได้** - ค้นหาชื่อ/เบอร์โทรศัพท์แล้วเจอข้อมูล
3. **ไม่มี console error** - ไม่มี "Unexpected token '<'" ใน console
4. **API responses** - ได้รับ JSON responses แทน HTML

## ถ้าเกิดปัญหา

### 1. Functions ไม่ทำงาน
- ตรวจสอบว่ามีไฟล์ใน `functions/` folder
- ตรวจสอบ `wrangler.toml` configuration

### 2. CORS Error
- Functions มี CORS headers ติดตั้งอยู่แล้ว
- ถ้ายังมีปัญหา ตรวจสอบ Cloudflare Pages settings

### 3. Google Sheets API Error
- ตรวจสอบ Service Account credentials
- ตรวจสอบว่า Google Sheets ถูกแชร์ให้ Service Account email

## Benefits หลังการแก้ไข

✅ **ใช้งานได้บน Cloudflare Pages** - เปลี่ยนจาก Server-Client เป็น Serverless
✅ **ประหยัดต้นทุน** - ไม่ต้องจ่ายค่า server
✅ **Auto-scaling** - ขยายตัวตามผู้ใช้งานโดยอัตโนมัติ
✅ **Global CDN** - เร็วขึ้นเพราะอยู่ใกล้ผู้ใช้
✅ **Zero Maintenance** - ไม่ต้องดูแล server