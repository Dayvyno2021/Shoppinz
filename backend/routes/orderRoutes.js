import express from 'express';
import { adminProtect, protect } from '../middleware.js/authMiddleware.js';
import { addOrderItems, changePaymentMethod, getMyorders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid } from '../controller/orderController.js';
const router = express.Router();
import { query, body, param, checkSchema } from 'express-validator';

//Define create order schema
const orderSchema = checkSchema({
  orderItems: { 
    in: 'body',
    isArray: {
      errorMessage: 'orderSchema must be an array'
    }
  },
  'orderItems.*.name': {
    isString: {
      errorMessage: 'Invalid name in order item',
    },
    exists: {
      errorMessage: 'Name is required in order item',
    },
  },
  'orderItems.*.image': {
    isString: {
      errorMessage: 'Invalid image in order item',
    },
    exists: {
      errorMessage: 'Image is required in order item',
    },
  },
  'orderItems.*.qty': {
    isInt: {
      errorMessage: 'Invalid quantity in order item',
    },
    exists: {
      errorMessage: 'Quantity is required in order item',
    },
    escape: true
  },
  'orderItems.*.price': {
    isFloat: {
      errorMessage: 'Invalid price in order item',
    },
    exists: {
      errorMessage: 'Price is required in order item',
    },
  },
  'shippingAddress.country': { escape: true },
  'shippingAddress.postalCode': { escape: true },
  'shippingAddress.city': { escape: true },
  'shippingAddress.address': { escape: true },
  paymentMethod: { escape: true },
  itemsPrice: { escape: true },
  taxPrice: { escape: true },
  shippingPrice: { escape: true },
  totalPrice: {escape: true},
})

router.route('/').post(protect, orderSchema, addOrderItems).get(protect, adminProtect, getOrders);
router.route('/mine').get(protect, getMyorders);
router.route('/:id').get(param('id').isString().trim().notEmpty(), protect, getOrderById);
router.route('/:id/pay').put( protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, adminProtect, param('id').isString(), updateOrderToDelivered);
router.route('/:orderId/pay-method').put(protect, param('orderId').isString(), body('payMethod').isString(), changePaymentMethod);

export default router;