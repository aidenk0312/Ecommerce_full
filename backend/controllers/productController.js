const Product = require('../models/Product');

// 전체 상품 조회
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// 단일 상품 조회
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// 상품 생성
exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// 상품 수정
exports.updateProduct = async (req, res, next) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: '수정할 상품을 찾을 수 없습니다.' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: '삭제할 상품을 찾을 수 없습니다.' });
        res.json({ message: '상품이 삭제되었습니다.' });
    } catch (err) {
        next(err);
    }
};
