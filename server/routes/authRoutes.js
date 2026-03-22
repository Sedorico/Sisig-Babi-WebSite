const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getCustomers, banCustomer } = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin routes
router.get('/customers', verifyAdmin, getCustomers);
router.put('/customers/:id/ban', verifyAdmin, banCustomer);

module.exports = router;