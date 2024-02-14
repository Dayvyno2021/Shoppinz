import express from 'express';
import {
  completePasswordReset,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  updateUserProfile,
  verifyUser,
} from '../controller/userControllers.js';
import { adminProtect, protect } from '../middleware.js/authMiddleware.js';

import {query, body, param, checkSchema} from 'express-validator';

//Login validation schema
const loginSchema = checkSchema({
  email: {isString:true, isEmail: true, notEmpty: true, escape: true },
  password: { isLength: { options: { min: 8 } }, escape: true }
});

//Register validation schema
const registerSchema = checkSchema({
  firstName: {isString: true, notEmpty: true, escape: true},
  lastName: { isString: true, notEmpty: true, escape: true },
  email: { isEmail: true, escape: true },
  password: {
    isString: true,
    matches: { options: { source: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/ } },
    errorMessage: 'Password must contain atleast 1 uppercase, lowercase, number and must be min of 8 characters'
  },
})
// id, firstName, lastName, isAdmin
//Register validation schema
const updateUserSchema = checkSchema({
  firstName: {optional: true, isString: true,  escape: true},
  lastName: { optional: true, isString: true,  escape: true },
  phone: { optional: true, isString: true, escape: true },
  id: { optional: true, isString: true, escape: true },
  isAdmin: {optional: true, isBoolean: true},
  password: {
    isString: true,
    optional: true,
    matches: { options: { source: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/ } },
    errorMessage: 'Password must contain atleast 1 uppercase, lowercase, number and must be min of 8 characters'
  },
})

// matches: { options: { source: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/ } }
  
const completePasswordResetSchema = checkSchema({
  token: { isString: true, trim: true, notEmpty: true, escape: true },
  password: {matches: {options:{source: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/ }}}
})

const router = express.Router();

router.route('/').get(protect, adminProtect, getUsers);
router.post('/logout', logoutUser);
router.post('/register', registerSchema, registerUser);
router.post('/verify/:token', param('token').notEmpty().escape(), query('email').isEmail().escape().trim().notEmpty(), verifyUser);
router.post('/reset-password', query('email').isEmail(), resetPassword);
router.post('/complete-password-reset', completePasswordResetSchema, completePasswordReset)
router.post('/auth', loginSchema, loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(updateUserSchema, protect, updateUserProfile);
router.route('/:id').delete(param('id').isString(), protect, adminProtect, deleteUser).get(param('id').isString(), protect, adminProtect, getUserById).put(updateUserSchema, protect, adminProtect, updateUser);

export default router;