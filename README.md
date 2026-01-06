 SSR E-Commerce Admin Dashboard

A server-side rendered (SSR) e-commerce **admin dashboard** built using Next.js.  
Admins can manage products, view charts, and control inventory.

---

 Live Demo
 https://ssr-ecommerce-admin-dashboard-e6y8oe6kh-siya-modis-projects.vercel.app/admin
---

 Demo Video
https://www.youtube.com/watch?v=zWSIOfVD3LU

---

Dummy Admin Credentials
Admin: admin@test.com
Password: Admin@123

---

 Features
- Admin authentication (login/logout)
- Add, edit & delete products
- Product image upload
- MongoDB database integration
- Charts for:
  - Stock per product
  - Revenue per product
  - Category-wise stock
- Fully server-side rendered (SSR)
- Protected admin routes using middleware

---

 Tech Stack
- Next.js (App Router, SSR)
- TypeScript
- MongoDB + Mongoose
- Tailwind CSS
- Recharts
- Vercel (Deployment)

---

 Project Structure
app/        → Pages & routes  
lib/        → Database & models  
public/     → Static assets  
middleware.ts → Route protection  
