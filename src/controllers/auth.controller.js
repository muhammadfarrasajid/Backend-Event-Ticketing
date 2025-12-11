const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const jwtConfig = require('../config/jwt');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { sendResponse } = require('../utils/response.util');

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return sendResponse(res, 400, error.details[0].message);

    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return sendResponse(res, 409, 'Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'USER' },
    });

    sendResponse(res, 201, 'User registered successfully', {
      id: user.id, name: user.name, email: user.email, role: user.role
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return sendResponse(res, 400, error.details[0].message);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendResponse(res, 401, 'Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return sendResponse(res, 401, 'Invalid email or password');

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );

    sendResponse(res, 200, 'Login successful', {
      accessToken, refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, 'Refresh Token is required');

    jwt.verify(refreshToken, jwtConfig.refreshSecret, (err, decoded) => {
      if (err) return sendResponse(res, 403, 'Invalid or expired Refresh Token');

      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      sendResponse(res, 200, 'Access token refreshed', { accessToken: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) return sendResponse(res, 404, 'User not found');

    sendResponse(res, 200, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, refreshToken };