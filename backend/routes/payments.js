const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const {
    createPayment,
    getPaymentsByOrder
} = require('../controllers/paymentController');

const router = express.Router();

// 결제 생성
router.post('/', authenticate, createPayment);
// 특정 주문 내역 조회
router.get('/:orderId', authenticate, getPaymentsByOrder);

module.exports = router;