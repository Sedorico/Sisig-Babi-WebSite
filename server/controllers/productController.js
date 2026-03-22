const db = require('../config/db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage instead of diskStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sisig-babi',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

const toBool = (val) => {
  if (val === true || val === 1 || val === '1' || val === 'true') return 1;
  return 0;
};

const getProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE is_featured = 1');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price, category, is_featured, is_best_seller, is_available } = req.body;
    
    // Cloudinary returns full URL via req.file.path
    const image = req.file ? req.file.path : null;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required.' });
    }

    await db.query(
      'INSERT INTO products (name, description, price, category, is_spicy, stock, image, is_featured, is_best_seller, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        '',
        parseFloat(price),
        category,
        0,
        0,
        image,
        toBool(is_featured),
        toBool(is_best_seller),
        toBool(is_available !== undefined ? is_available : 1)
      ]
    );

    res.status(201).json({ message: 'Product added successfully!' });
  } catch (err) {
    console.error('addProduct error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const { name, price, category, is_featured, is_best_seller, is_available } = req.body;
    
    // Cloudinary returns full URL via req.file.path
    const image = req.file ? req.file.path : null;

    if (image) {
      await db.query(
        'UPDATE products SET name=?, price=?, category=?, image=?, is_featured=?, is_best_seller=?, is_available=? WHERE id=?',
        [
          name,
          parseFloat(price),
          category,
          image,
          toBool(is_featured),
          toBool(is_best_seller),
          toBool(is_available !== undefined ? is_available : 1),
          req.params.id
        ]
      );
    } else {
      await db.query(
        'UPDATE products SET name=?, price=?, category=?, is_featured=?, is_best_seller=?, is_available=? WHERE id=?',
        [
          name,
          parseFloat(price),
          category,
          toBool(is_featured),
          toBool(is_best_seller),
          toBool(is_available !== undefined ? is_available : 1),
          req.params.id
        ]
      );
    }

    res.json({ message: 'Product updated successfully!' });
  } catch (err) {
    console.error('editProduct error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { upload, getProducts, getFeaturedProducts, getProduct, addProduct, editProduct, deleteProduct };