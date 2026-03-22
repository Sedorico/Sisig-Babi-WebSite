const express = require('express');
const router = express.Router();
const { placeOrder, placeGuestOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getStats, cancelOrder } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/', verifyToken, placeOrder);
router.post('/guest', placeGuestOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/stats', verifyAdmin, getStats);
router.get('/', verifyAdmin, getAllOrders);
router.put('/:id/status', verifyAdmin, updateOrderStatus);
router.put('/:id/cancel', verifyToken, cancelOrder);
router.get('/:id', verifyToken, getOrder);

module.exports = router;