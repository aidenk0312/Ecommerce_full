const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

// order list
router.get('/', authenticate, getMyOrders);

// create order
router.post('/', authenticate, createOrder);

// order detail
router.get('/:id', authenticate, getOrderById);

// update order status
router.put('/:id/status', authenticate, updateOrderStatus);

module.exports = router;