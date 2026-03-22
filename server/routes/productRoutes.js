const express = require('express');
const router = express.Router();
const { upload, getProducts, getFeaturedProducts, getProduct, addProduct, editProduct, deleteProduct } = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', verifyAdmin, upload.single('image'), addProduct);
router.put('/:id', verifyAdmin, upload.single('image'), editProduct);
router.delete('/:id', verifyAdmin, deleteProduct);

module.exports = router;