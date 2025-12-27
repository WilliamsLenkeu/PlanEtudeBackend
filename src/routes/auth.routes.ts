import express from 'express';
import { register, login, googleLogin, refreshToken } from '../controllers/authController';
import { validate } from '../middleware/validateMiddleware';
import { registerSchema, loginSchema } from '../utils/validation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleLogin);
router.post('/refresh', refreshToken);

export default router;