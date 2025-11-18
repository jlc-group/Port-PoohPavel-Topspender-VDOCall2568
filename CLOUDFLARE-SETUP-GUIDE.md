# คำแนะนำการตั้งค่า Cloudflare Pages เพื่อ Deploy โปรเจคให้สำเร็จ

## 📋 สรุปสั้น
โปรเจคนี้ได้รับการแก้ไขให้พร้อม deploy ขึ้น Cloudflare Pages แล้ว ตอนนี้ต้องตั้งค่า Cloudflare Dashboard เพื่อให้ Frontend + API Functions ทำงานเหมือน `localhost:3005` เป๊ะๆ

---

## ✅ สิ่งที่ผมแก้ไขให้แล้ว

1. **Functions ทั้ง 4 ไฟล์** - เปลี่ยนจาก hardcode secrets เป็นอ่านจาก environment variables
   - `functions/api/top-spender.js`
   - `functions/api/vdo-call.js`
   - `functions/api/registered-users.js`
   - `functions/api/combined-search.js`

2. **Frontend API handler** - เพิ่มการตรวจ `content-type` เพื่อป้องกัน SyntaxError
   - `src/utils/api.js` - ตรวจว่า response เป็น JSON จริงก่อน parse

3. **Build** - ทดสอบ build สำเร็จแล้ว
   - ไฟล์ build อยู่ใน `dist/` พร้อมส่ง Cloudflare

---

## 🚀 ขั้นตอนการตั้งค่า Cloudflare Pages

### ขั้นตอนที่ 1: เข้า Cloudflare Dashboard
1. ไปที่ https://dash.cloudflare.com
2. เลือก Account ของคุณ
3. ไปที่ **Pages** > เลือก Project `port-poohpavel-topspender-vdocall2568`

---

### ขั้นตอนที่ 2: ตั้งค่า Build & Output
1. ไปที่ **Settings > Build**
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
2. กด **Save**

---

### ขั้นตอนที่ 3: เปิดใช้งาน Functions
1. ไปที่ **Settings > Functions**
   - **Functions directory**: `functions`
   - **Node.js compatibility**: เปิด (toggle ON)
2. กด **Save**

---

### ขั้นตอนที่ 4: ตั้ง Environment Variables/Secrets
1. ไปที่ **Settings > Environment Variables**

#### เพิ่ม Variables (ปกติ):
- **Name**: `SPREADSHEET_ID`
  - **Value**: `1PA4KRWqZFSeI8R88-8_S4ZhvayJBugHOZboevVo9cMg`
  - **Environment**: Production + Preview

- **Name**: `SERVICE_ACCOUNT_EMAIL`
  - **Value**: `google-sheets-api-poohpavel@port-poohpavel2568.iam.gserviceaccount.com`
  - **Environment**: Production + Preview

#### เพิ่ม Secret (ความลับ):
- **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
  - **Value**: (ค่า PRIVATE_KEY จากไฟล์ `.env` ของคุณ - ต้องเป็น full private key JSON หรือ PEM format)
  - **Environment**: Production + Preview

> ⚠️ **สำคัญ**: ห้ามใส่ private key ลงใน `.env` ที่ push ขึ้น Git เด็ดขาด ตั้งเป็น Secret ใน Cloudflare เท่านั้น

---

### ขั้นตอนที่ 5: ตรวจ Redirects/Rules
1. ไปที่ **Settings > Rules** (ถ้ามี)
   - ต้องไม่มี rule ที่ rewrite `/api/*` ไปเส้นทางอื่น
   - ถ้ามี ให้ลบออก

---

### ขั้นตอนที่ 6: Redeploy
1. ไปที่ **Deployments**
2. กด **"Redeploy latest"** หรือ **"Retry deployment"**
3. รอให้ build สำเร็จ (ดูสถานะเป็น ✅ Success)

---

## 🧪 ทดสอบหลังตั้งค่า

### 1. ทดสอบ Frontend
- เปิด: `https://port-poohpavel-topspender-vdocall2568.pages.dev/`
- ควรเห็นหน้าเว็บปกติ (เหมือน `localhost:3005`)
- ลองค้นหา/ดูข้อมูล

### 2. ทดสอบ API Endpoint
- เปิด URL นี้ใน browser:
  ```
  https://port-poohpavel-topspender-vdocall2568.pages.dev/api/top-spender/customers
  ```
- ควรเห็น JSON:
  ```json
  {
    "success": true,
    "data": [...],
    "count": 123
  }
  ```
- ถ้าเห็น HTML หรือ error 500 ให้ดู Logs (ขั้นตอนด้านล่าง)

### 3. ดู Logs
- ไปที่ **Deployments** > เลือก deployment ล่าสุด
- แท็บ **Functions** > ดู logs
- ถ้ามี error ให้แปะข้อความมา

---

## ❌ Troubleshooting

### Error: "Received non-JSON from API"
- **สาเหตุ**: API ยังส่ง HTML (Functions ไม่รัน)
- **วิธีแก้**:
  1. ตรวจว่า Functions directory = `functions` ใน Settings
  2. ตรวจว่า Node.js compatibility เปิดอยู่
  3. ตรวจ Logs ว่ามี error ไหน
  4. Redeploy อีกครั้ง

### Error: "Internal server error 500"
- **สาเหตุ**: Functions crash (อาจเป็น env ไม่ถูกตั้ง หรือ private key ผิด)
- **วิธีแก้**:
  1. ตรวจ Logs ดูข้อความ error
  2. ตรวจว่า `GOOGLE_SERVICE_ACCOUNT_KEY` ถูกตั้งใน Secrets
  3. ตรวจว่า private key format ถูกต้อง (ต้องเป็น PEM format หรือ JSON)
  4. Redeploy

### Error: "Cannot connect to server"
- **สาเหตุ**: Network issue หรือ domain ไม่ถูก
- **วิธีแก้**:
  1. ตรวจ URL ว่า domain ถูกต้อง
  2. รอ 1-2 นาที แล้วลองใหม่
  3. ตรวจ Cloudflare status

---

## 📝 ไฟล์ที่เปลี่ยนแปลง

```
functions/api/top-spender.js      ✏️ แก้ env
functions/api/vdo-call.js         ✏️ แก้ env
functions/api/registered-users.js ✏️ แก้ env
functions/api/combined-search.js  ✏️ แก้ env
src/utils/api.js                  ✏️ เพิ่ม content-type check
dist/                             ✅ Build สำเร็จ
```

---

## 🎯 ผลลัพธ์ที่คาดหวัง

หลังตั้งค่าเสร็จ:
- ✅ หน้าเว็บบน Cloudflare ทำงานเหมือน `localhost:3005`
- ✅ API endpoints ตอบ JSON ถูกต้อง
- ✅ ค้นหา/ดูข้อมูล Top Spender, VDO Call, Registered Users ได้
- ✅ ไม่มี error ใน Console

---

## 📞 ถ้ามีปัญหา

1. ส่ง URL ที่ deploy มา
2. ส่ง error message จาก Console/Logs
3. ส่ง รูปหน้า Cloudflare Settings

ผมจะช่วยวิเคราะห์ต่อให้ครับ
