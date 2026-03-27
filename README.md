# Sisig Babi - E-Commerce Website

A full-stack e-commerce web application developed for a Filipino sisig restaurant. The system enables customers to order food online while providing administrators with tools for managing products, orders, and customers.

---

## 1. Technology Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MySQL
* JSON Web Token (JWT)
* bcryptjs

### Third-Party Services

* Cloudinary (Image Upload)
* Resend (Email Service)

------------------------------------------------------------------

## 2. System Features

### 2.1 Customer Module

* Landing page with option for Online Order or Walk-In
* User authentication (Register, Login, Logout, Forgot Password, Reset Password)
* Homepage with featured products and best sellers
* Menu page with category filtering and add-to-cart functionality
* Product page with add-ons (e.g., extra egg, extra rice)
* Shopping cart with quantity management
* Checkout system (Delivery or Pickup; Cash, GCash, Maya)
* Order tracking with status updates
* Order cancellation (pending orders only)

### 2.2 Point-of-Sale (POS) Module

* Walk-in ordering without account login
* Customer name-based ordering
* Payment options (Cash, GCash, Maya)
* Receipt generation and printing

### 2.3 Admin Module

* Dashboard with system statistics (orders, revenue, customers, products)
* Product management (create, update, delete, image upload)
* Order management (view, update status, identify walk-in vs online orders)
* Customer management (view users, ban/unban accounts)

### 2.4 Core System Features

* Role-based authentication and authorization
* Secure password handling using hashing
* Cloud-based image storage
* Email-based password recovery system

-------------------------------------------------------------------------------

## 3. Project Structure

```
Doricodes(WebEng)/
├── client/          # Frontend (React)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── customer/
│   │   └── utils/
└── server/          # Backend (Express)
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    └── uploads/
```

---

## 4. Setup and Installation

### Prerequisites

* Node.js
* MySQL

### 4.1 Clone Repository

```
git clone https://github.com/Sedorico/Sisig-Babi-WebSite.git
cd Sisig-Babi-WebSite
```

### 4.2 Backend Setup

```
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sisigan_db
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4.3 Database Setup

Create a MySQL database named `sisigan_db` and execute the required table structures.

### 4.4 Frontend Setup

```
cd client
npm install
```

### 4.5 Run the Application

Backend:

```
cd server
npm run dev
```

Frontend:

```
cd client
npm run dev
```

---

## 5. Deployment

* Frontend: [https://sisig-babi-web-site.vercel.app](https://sisig-babi-web-site.vercel.app)
* Backend: [https://sisig-babi-website-production.up.railway.app](https://sisig-babi-website-production.up.railway.app)
* Database: MySQL hosted on Railway

---

## 6. System Behavior

* After login:

  * Customer is redirected to `/home`
  * Administrator is redirected to `/admin`
* After logout: redirected to `/`

---

## 7. Key Notes

* Cart data is stored using localStorage
* Administrative routes are protected
* Product images are stored in Cloudinary and accessed via URL
* Backend services are deployed using Railway

---

## 8. Developer Reference

GitHub Repository:
[https://github.com/Sedorico](https://github.com/Sedorico)
