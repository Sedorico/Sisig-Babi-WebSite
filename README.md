# Sisig Babi - E-Commerce Website

A full-stack e-commerce web application for **Sisig Babi**, a Filipino sisig restaurant. Built with React, Node.js, Express, and MySQL.

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js + Express
- MySQL
- JWT Authentication
- Cloudinary (Image Upload)
- Nodemailer (Email)
- Bcryptjs

---

## Features

### Customer Side
- Landing page with Online Order / Walk-In choice
- User Authentication (Register, Login, Logout, Forgot Password)
- Homepage with animated best seller hero slider and featured carousel
- Menu page with category filter and add to cart
- Product page with spicy option and add-ons (extra egg/rice)
- Shopping cart with quantity controls
- Checkout (Delivery/Pickup, COD/GCash/Maya)
- Order tracking with progress bar
- Cancel order (pending orders only)

### POS System (Walk-In)
- No login required
- Order by name
- Cash/GCash/Maya payment
- Print receipt

### Admin Panel
- Dashboard with stats (total orders, revenue, customers, products)
- Product management (add, edit, delete, image upload via Cloudinary)
- Order management (view all, update status, walk-in/online badge)
- Customer management (view, ban/unban)

---

## Project Structure
```
Doricodes(WebEng)/
├── client/          # React Frontend (port 5173)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── customer/
│   │   └── utils/
└── server/          # Express Backend (port 5000)
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    └── uploads/
```

---

## Setup and Installation

### Prerequisites
- Node.js
- MySQL

### 1. Clone the repository
```bash
git clone https://github.com/Sedorico/Sisig-Babi-WebSite.git
cd Sisig-Babi-WebSite
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `server/`:
```env
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

### 3. Setup Database
Create a MySQL database named `sisigan_db` and run the following:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  is_banned TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_spicy TINYINT(1) DEFAULT 0,
  stock INT DEFAULT 0,
  image VARCHAR(255),
  is_featured TINYINT(1) DEFAULT 0,
  is_best_seller TINYINT(1) DEFAULT 0,
  is_available TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  guest_name VARCHAR(100),
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_type VARCHAR(50) NOT NULL,
  address TEXT,
  contact_number VARCHAR(20),
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  extra_egg TINYINT(1) DEFAULT 0,
  extra_rice TINYINT(1) DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 4. Setup Frontend
```bash
cd client
npm install
```

### 5. Run the Application

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

---

## Deployment

- Frontend: [Vercel](https://sisig-babi-web-site.vercel.app)
- Backend: [Railway](https://sisig-babi-website-production.up.railway.app)
- Database: MySQL on Railway

---

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sisigan.com | admin123 |

---

## Mobile Responsive

The website is fully responsive and works on desktop, tablet, and mobile devices.

---

## Developer

[GitHub](https://github.com/Sedorico)

---

## License

This project is for educational purposes only.
```

I-replace mo yung `README.md` sa:
```
C:\Users\Karl\OneDrive\Documents\Doricodes(WebEng)\README.md
