const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password, name, address } = req.body;
        if (await User.findOne({ $or: [{ username }, { email }] })) {
            return res.status(400).json({ message: '이미 사용 중인 아이디 또는 이메일입니다.' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed, name, address });
        await user.save();
        res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
