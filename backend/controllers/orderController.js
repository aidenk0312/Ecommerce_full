const Order = require('../models/order');

// 주문 생성 (User)
exports.createOrder = async (req, res, next) => {
    try {
        const { products } = req.body;
        // 총 금액 계산
        const  totalPrice = products.reduce((sum, item) => {
            return sum + (item.price * item.quantity || 0);
        }, 0);
        const order = new Order({
            user: req.user._id,
            products,
            totalPrice
        });
        const saved = await order.save();
        res.status(201).json(saved);
    }   catch (err) {
        next(err);
    }
};

// 내 주문 목록 조회 (User)
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({user: req.user._id})
            .populate('products.product', 'title price')
            .sort('-createdAt');
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// 주문 단건 조회 (User/Admin)
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('products.product', 'title price')
            .populate('user', 'username email');
        if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.'});
        // 해당 user or admin 아닐 경우
        if (order.user._id.toString() !== req.user.id.toString() && req.user.isAdmin) {
            return res.status(403).json({ mesage: '조회 권한이 없습니다. 관리자에게 문의 바랍니다.'});
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
};

// 주문 상태 업데이트 (Admin)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.'});
        res.json(order);
    } catch (err) {
        next(err);
    }
};