const Payment = require('../models/payment');
const Order = require('../models/order');

// 결제 생성
exports.createPayment = async (req, res, next) => {
    try {
        const { orderId, paymentMethod } = req.body;
        // 주문 존재 여부 확인
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });

        // 레코드 생성
        const payment = new Payment({
            order: orderId,
            paymentMethod,
            paymentStatus: 'success'
        });
        const saved = await payment.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// 주문 결제 내역 조회
exports.getPaymentsByOrder = async (req, res, next) => {
    try {
        const payments = await Payment.find({order: req.params.orderId});
        res.json(payments);
    } catch (err) {
        next(err);
    }
};