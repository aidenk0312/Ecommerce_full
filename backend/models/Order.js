const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
    }],
    totalPrice: { type: Number, required: true },
    orderStatus:{ type: String, default: '주문 완료' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
