import express from 'express';
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct
} from '../controller/productControllers.js';
import { adminProtect, protect } from '../middleware.js/authMiddleware.js';
import {query, body, param, checkSchema} from 'express-validator';
import { deleteUser } from '../controller/userControllers.js';
const router = express.Router();


const productValidationSchema = checkSchema({
  user: {isString:true, optional: true},
  name: {isString: true, optional: true},
  image: {isString:true, optional: true},
  brand: {isString:true, optional: true},
  category: {isString:true, optional: true},
  description: { isString: true, optional: true },
  imageString:{optional: true, escape: true},
  // reviews: {
  //   in: ['body'],
  //   isArray: { errorMessage: 'Reviews should be an array' },
  // },
  'reviews.*.rating': {isNumeric: true, optional: true},
  'reviews.*.name': {isString: true, optional: true},
  'reviews.*.user': {isString: true, optional: true},
  'reviews.*.comment': {isString: true, optional: true},
  numReviews: {isNumeric: true, optional: true},
  price: {isNumeric: true, optional: true},
  countInStock: {isNumeric: true, optional: true},
});


router.route('/').get(getProducts).post(protect, adminProtect, createProduct);
router.route('/top').get(getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminProtect, updateProduct)
  .delete(param('id').isString().notEmpty(), protect, adminProtect, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview)

export default router;