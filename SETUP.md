# Setup & Commands

## 1️⃣ Create Project

```bash
npm create vite@latest enterprise-crud -- --template react-ts
cd enterprise-crud
npm install

2️⃣ Run Development Server
npm run dev

App runs at:
http://localhost:5173

3️⃣ Install Core Dependencies

npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-data-grid
npm install react-router-dom
npm install @tanstack/react-query
npm install @reduxjs/toolkit react-redux
npm install react-hook-form zod @hookform/resolvers
npm install axios uuid

4️⃣ JSON Server Setup
npm install json-server --save-dev

4️⃣ JSON Server Setup
npm install json-server --save-dev

Run backend:
npm run server

API base URL:
http://localhost:3001


✅ STEP 5 — Install MUI DataGrid
Terminal me run karo:
npm install @mui/x-data-grid


🧠 JSON Server Kya Kar Raha Hai?

Ye automatically REST API generate karta hai:

GET    /employees
POST   /employees
PUT    /employees/:id
DELETE /employees/:id

✅ STEP 17 — Install Form Libraries (If Not Installed)
Run:
npm install react-hook-form zod @hookform/resolvers
