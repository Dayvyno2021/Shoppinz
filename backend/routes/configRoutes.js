import express from 'express';
import { protect } from '../middleware.js/authMiddleware.js';
import { query, body, param, checkSchema } from 'express-validator';
import { paymentKey } from '../controller/configController.js';

const router = express.Router();

router.route('/:payment').get(protect, param('payment').isString(), paymentKey);

export default router;