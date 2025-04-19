const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: '성공' },
    paidAt:        { type: Date, default: Date.now },
}, { timestamps: false });

module.exports = mongoose.model('Payment', PaymentSchema);
