// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// Product 라우트 연결
app.use('/api/products', productRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('🛒 e‑Commerce API is running');
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// 404 처리
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
