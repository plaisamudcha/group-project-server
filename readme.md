---
.env

PORT = 3000
SECRET_KEY = MB9dYOPfmzpWiSFK3caLlNsPS4GXhzlF
RESET_KEY = jtp5oZaF0Azgjtt52XhrHq3QTX0vJeLY
---

---

.gitignore

node_modules

# Keep environment variables out of version control

.env
/generated/prisma

---

# 📘 Leave & Attendance Management System API

## 📖 Authentication

| Method | Endpoint       | Description             | Auth Required |
| ------ | -------------- | ----------------------- | ------------- |
| POST   | /auth/login    | Login ผู้ใช้งาน         | ❌            |
| POST   | /auth/register | ลงทะเบียนผู้ใช้งาน      | ❌            |
| GET    | /auth/me       | ข้อมูลผู้ใช้งานปัจจุบัน | ✅            |
| POST   | /auth/logout   | ออกจากระบบ              | ✅            |

## 👤 Users & Profiles

| Method | Endpoint          | Description               | Auth Required |
| ------ | ----------------- | ------------------------- | ------------- |
| GET    | /users            | ดูรายชื่อผู้ใช้งานทั้งหมด | ✅ (admin)    |
| GET    | /users/:id        | ดูรายละเอียดผู้ใช้        | ✅            |
| POST   | /users            | สร้างผู้ใช้ใหม่           | ✅ (admin)    |
| PUT    | /users/:id        | แก้ไขข้อมูลผู้ใช้         | ✅ (admin)    |
| GET    | /profiles/:userId | ดึงโปรไฟล์พนักงาน         | ✅ (admin)    |
| PUT    | /profiles/:userId | แก้ไขโปรไฟล์พนักงาน       | ✅ (admin)    |

## 🟢 Attendance (ลงเวลา)

| Method | Endpoint              | Description          | Auth Required   |
| ------ | --------------------- | -------------------- | --------------- |
| POST   | /attendance/clock-in  | ลงเวลาเข้างาน        | ✅              |
| POST   | /attendance/clock-out | ลงเวลาเลิกงาน        | ✅              |
| GET    | /attendance           | ดูรายการเข้า-ออกงาน  | ✅ (self/admin) |
| GET    | /attendance/reports   | รายงานการเข้า-ออกงาน | ✅              |

## 🟣 Leave Requests (การลา)

| Method | Endpoint           | Description                  | Auth Required |
| ------ | ------------------ | ---------------------------- | ------------- |
| POST   | /leaves            | ส่งคำขอลา                    | ✅            |
| GET    | /leaves            | ดูคำขอลาทั้งหมดหรือของตัวเอง | ✅            |
| GET    | /leaves/:id        | ดูรายละเอียดคำขอลา           | ✅            |
| PUT    | /leaves/:id/status | อนุมัติ / ปฏิเสธ คำขอลา      | ✅ (HR/Admin) |

## 🟠 Work Policies (นโยบายการทำงาน)

| Method | Endpoint           | Description     | Auth Required |
| ------ | ------------------ | --------------- | ------------- |
| GET    | /work-policies     | ดูนโยบายทั้งหมด | ✅            |
| POST   | /work-policies     | สร้างนโยบายใหม่ | ✅ (admin)    |
| PUT    | /work-policies/:id | แก้ไขนโยบาย     | ✅ (admin)    |

## 🔵 Shifts (กะงาน)

| Method | Endpoint    | Description      | Auth Required |
| ------ | ----------- | ---------------- | ------------- |
| GET    | /shifts     | ดูรายการกะงาน    | ✅            |
| POST   | /shifts     | เพิ่มกะงานใหม่   | ✅ (admin)    |
| PUT    | /shifts/:id | แก้ไขข้อมูลกะงาน | ✅ (admin)    |

## 📙 Leave Adjustments

| Method | Endpoint           | Description                   | Auth Required     |
| ------ | ------------------ | ----------------------------- | ----------------- |
| GET    | /leave-adjustments | ดูการปรับเวลาที่เกี่ยวกับใบลา | ✅                |
| POST   | /leave-adjustments | สร้างการปรับเวลาสำหรับใบลา    | ✅ (system/admin) |
| PUT    | /leave-adjustments | แก้ไขสถานะใบลา                | (admin)           |

## 📗 Holidays (วันหยุด)

| Method | Endpoint  | Description        | Auth Required |
| ------ | --------- | ------------------ | ------------- |
| GET    | /holidays | ดูวันหยุดของบริษัท | ✅            |
| POST   | /holidays | เพิ่มวันหยุดใหม่   | ✅ (admin)    |
| PUT    | /holidays | แก้ไขวันหยุด       | (admin)       |
| DELTE  | /holidays | ลบวันหยุด          | (admin)       |

## 📕 Audit Logs

| Method | Endpoint    | Description               | Auth Required |
| ------ | ----------- | ------------------------- | ------------- |
| GET    | /audit-logs | ดูบันทึกการกระทำในระบบ    | ✅ (admin)    |
| POST   | /audit-logs | สร้างบันทึกการกระทำในระบบ | (admin)       |