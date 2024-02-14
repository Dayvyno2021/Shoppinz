import asyncHandler from "../middleware.js/asyncHandler.js";
import { validationResult, matchedData } from "express-validator";
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import nodemailer from 'nodemailer';

//Desc:     Auth user & get token
//@route:   POST /api/users/auth
//@access:  Public
export const loginUser = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  
  if (result.isEmpty()) {

    const data = matchedData(req);
    const { email, password } = data;

    const user = await userModel.findOne({ email });
    if (user && (await user.matchPassword(password))) {

      if (user.verified) {
        generateToken(res, user._id);
  
        return res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          verified: user.verified
        })  
      } else {
        await userModel.findByIdAndDelete(user._id);
        res.status(400);
        throw new Error('User not verified, proceed to re-register with the same email address');
      }


    } else {
      res.status(400);
      throw new Error('Invalid email or password')
    }

  }

  res.status(400);
  throw new Error('Invalid login credentials');
  
})

//Desc:     Register new user
//@route:   POST /api/users/register
//@access:  Public
export const registerUser = asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    
    const { firstName, lastName, email, password } = data;

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      if (!userExists.verified) {
        await userModel.findOneAndDelete({email: userExists.email})
      } else {
        res.status(400);
        throw new Error('User already exists');
      }
    }

    const user = await userModel.create({ firstName, lastName, email, password });

    if (user) {
      const idToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: 20 * 60 });
      
      //Send verification mail to new user
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      //The url of the token to be sent to the just registered user
      const emailMessage = `${process.env.BASE_URL}/verify?token=${idToken}&email=${user.email}`;
      
      //Send the mail to the just registered user
      const info = await transporter.sendMail({
        from: 'no-reply@gnext-auth.com', // sender address
        to: user.email, // list of receivers
        subject: 'Shoppinz Email Verification', // Subject line
        html: `
        <h2>Hi ${user.firstName}, </h2>
        <p>Welcome to the world's biggest online market. 
        You are few steps away from completing your registration. </p>
        <h3> Click the link below to complete your registration </h3>
        <p>The link is only valid for 20mins</p>
        <p> <a href=${emailMessage} target="_blank" rel="noopener noreferrer" style="color:#9f1239;text-decoration:underline;"> Complete Registration </a> </p>
        <p> You can copy the link below to your browser as an alternative should the above link not work </p>
        <p> ${emailMessage} </p>
        `
      });

      
      if (!info) {
        res.status(401);
        throw new Error('Could not verify user')
      }else {
        return res.status(200).json({ message: 'User registered, proceed to your email for verification link' });
      }


    } else {
      res.status(400);
      throw new Error('Could not register user, try again!');
    }
  }

  res.status(401);
  throw new Error('Could not register due to missing fields or invalid password');

})

//Desc:     Verify user
//@route:   POST /api/users/verify
//@access:  Public
export const verifyUser = asyncHandler(async (req, res) => {
  
  const result = validationResult(req);
  if (result.isEmpty()) {

    const data = matchedData(req);


    const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
    

    const user = await userModel.findById(decoded.userId);
    if (user) {
      user.verified = true;
      const verifiedUser = await user.save();

      generateToken(res, verifiedUser._id);

      return res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        verified: user.verified
      })

    } else {
      res.status(404);
      throw new Error('User not found');
    }

    
  } else {
    res.status(400);
    throw new Error('User token must be validated');
  }
  

})


//Desc:     Logout user / clear cookie
//@route:   POST /api/users/logout
//@access:  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  return res.status(200).json({ message: 'Logged out successfuly' });

})

//Desc:     Get user profile
//@route:   GET /api/users/profile
//@access:  Private
export const getUserProfile = asyncHandler(async (req, res) => {

  const user = await userModel.findById(req.user._id);
  if (user) {
    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      verified: user.verified
    })
  }
  
  res.status(404);
  throw new Error('User not found');
})

//Desc:     update user profile
//@route:   PUT /api/users/profile
//@access:  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  // console.log("RESULT: ", result);

  if (result.isEmpty()) {

    const data = matchedData(req);

    const user = await userModel.findById(req.user._id);
    if (user) {
      user.firstName = data.firstName || user.firstName;
      user.lastName = data.lastName || user.lastName;
      user.phone = data.phone || user.phone

      if (data.password) {
        user.password = data.password;
      }

      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        verified: updatedUser.verified,
        phone: updatedUser.phone
      })

    } else {
      res.status(404);
      throw new Error('Could not find user')
    }
    
  } else {
    res.status(400);
    throw new Error('Check that the entered inputs are valid');
  }

})

//Desc:     GET all users
//@route:   GET /api/users
//@access:  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {

  const users = await userModel.find({});
  return res.status(200).json(users);

})

//Desc:     GET user by ID
//@route:   GET /api/users/:id
//@access:  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {

  const result = validationResult(req);
  if (result.isEmpty()) {

    const data = matchedData(req);

    const user = await userModel.findById(data.id).select('-password');
    if (user) {
      return res.status(200).json(user);
    }

    res.status(404);
    throw new Error('User not found');

  } else {
    res.sttaus(401);
    throw new Error('Validation Error');
  }

})

//Desc:     Delete user
//@route:   DELETE /api/users/:id
//@access:  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {

  const result = validationResult(req);

  if (result.isEmpty()) {

    const { id } = matchedData(req);
    const user = await userModel.findById(id);

    const adminUser = await userModel.findById(req.user._id);

    if (adminUser && adminUser.isAdmin) {
      if (user && user.isAdmin) {
        res.status(400);
        throw new Error('Cannot delete admin user');
      } else {
        if (user) {
          await userModel.deleteOne({ _id: user._id });
          return res.status(201).json({ message: "User deleted" });
        }
  
        res.status(404);
        throw new Error('User not found');
      }
      
    } else {
      res.status(403);
      throw new Error('Only admin users can delete a user');
    }
    
    
  }else {
    res.sttaus(401);
    throw new Error('Validation Error');
  }

})

//Desc:     Update user
//@route:   PUT /api/users/:id
//@access:  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {

  const result = validationResult(req);
  if (result.isEmpty()) {
    const { id, firstName, lastName, isAdmin } = matchedData(req);

    const user = await userModel.findById(id);

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.isAdmin = Boolean(isAdmin);

      const updatedUser = await user.save();

      return res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isAdmin: updatedUser.isAdmin
      })
    } else {
      res.status(404);
      throw new Error('User not found');
    }

  }
  res.status(400);
  throw new Error('Validation Error');

})

//Desc:     Reset Password
//@route:   PUT /api/users/reset-password
//@access:  Protect
export const resetPassword = asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const { email } = matchedData(req);

    const user = await userModel.findOne({ email });

    if (user) {
      //Send verification mail to new user
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Register a jwt token that will expire in 20min
      const idToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: 1200 });

      //The url of the token to be sent to the just registered user
      const emailMessage = `${process.env.BASE_URL}/password-reset/confirm?token=${idToken}`;

      //Send the mail to user for email reset
      const info = await transporter.sendMail({
        from: 'no-reply@gnext-auth.com', // sender address
        to: user.email, // list of receivers
        subject: 'Reset your Shoppinz Password', // Subject line
        html: `
        <h2>Hi Esteemed Customer, </h2>
        <p> Welcome to the world's biggest online market. </p>
        <h3> Click the link below to reset your password </h3>
        <p> Link is valid for 20mins </p>
        <p> <a href=${emailMessage} target="_blank" rel="noopener noreferrer" style="color:#9f1239;text-decoration:underline;"> Verify password reset </a> </p>
        <p> You can copy the link below to your browser as an alternative should the above link not work </p>
        <p style="font-weight:bold; padding:2px; border-radius: 4px; border: 1px solid #f3f4f6"> ${emailMessage} </p>
        `
      });
      
      if (!info) {
        res.status(401);
        throw new Error('Error sending mail')
      };

      return res.status(200).json({ message: "Proceed to your email to confirm password reset" });
      
    } else {
      res.status(400);
      throw new Error('User does not exist in our database');
    }

    
  } else {
    res.status(400);
    throw new Error('invalid email input');
  }

})

//@desc Complete Password Reset
//@route /complete-password-reset
//@access public
export const completePasswordReset = asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    
    const { token, password } = matchedData(req);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (user) {
      if (user.verified) {

        user.password = password;

        const updatedUser = await user.save();

        generateToken(res, updatedUser._id);

        return res.status(201).json({
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          verified: updatedUser.verified
        });
        
      } else {
        res.status(404);
        throw new Error('User is not yet verified, you can re-register with thesame email and proceed to verification');
      }
      
    } else {
      res.status(404);
      throw new Error('User not found');
    }

  } else {
    res.status(400);
    throw new Error('invalid user inputs');
  }
})