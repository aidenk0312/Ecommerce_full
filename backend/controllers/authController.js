const crypto      = require('crypto');
const nodemailer  = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

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

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: '등록된 이메일이 없습니다.'});

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken   = token;
        user.resetPasswordExpires = Date.now() + 3600 * 1000;
        await user.save();
        // fail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await transporter.sendMail({
            from:    `"VendiGo Support" <${process.env.MAIL_USER}>`,
            to:      user.email,
            subject: 'VendiGo 비밀번호 재설정 안내',
            html:    `<p>아래 링크를 클릭해 비밀번호를 재설정하세요 (1시간 이내 유효):</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>`,
        });

        res.json({ message: '비밀번호 재설정 메일을 발송했습니다.' });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken:   token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
        }

        user.password             = await bcrypt.hash(password, 10);
        user.resetPasswordToken   = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (err) {
        next(err);
    }
};