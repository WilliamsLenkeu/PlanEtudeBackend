import express from 'express';
import { getUserProfile, updateUserProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateProfileSchema, changePasswordSchema } from '../utils/validation';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(validate(updateProfileSchema), updateUserProfile);

router.put('/change-password', validate(changePasswordSchema), changePassword);

export default router;