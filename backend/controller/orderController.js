import asyncHandler from "../middleware.js/asyncHandler.js";
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import nodemailer from 'nodemailer';
import { validationResult, matchedData } from "express-validator";
import orderModel from "../models/orderModel.js";
// import { uuid } from "uuidv4";
import { v4 as uuid_v4 } from "uuid";

//@Desc:     Create bew order
//@route:   POST /api/orders
//@access:  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = data;
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items')
    } else {
      const order = new orderModel({
        orderItems: orderItems.map((x)=>({...x, product: x._id, _id: undefined})), 
        user: req.user._id,
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
      })

      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    }

  } else {
    res.status(401);
    throw new Error('Invalid input credentials');
  }
})

//@Desc:     Get logged in user orders
//@route:   GET /api/orders/myorders
//@access:  Private
export const getMyorders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({
    user: req?.user?._id
  });

  return res.status(200).json(orders);
});

//Desc:     Get order by ID
//@route:   POST /api/orders
//@access:  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  console.log(result)
  if (result.isEmpty()) {
    const data = matchedData(req);
    const { id } = data;
    const order = await orderModel.findById(id).populate('user', 'name email')
    if (order) {
      return res.status(200).json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }

  } else {
    res.status(401);
    throw new Error('Invalid input');
  }
})

//Desc:     Update order to paid
//@route:   PUT /api/orders/:id/pay
//@access:  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {

    // const data = matchedData(req);
    // const { id, payMethod } = data;
  const order = await orderModel.findById(req.params.id);
  const user = await userModel.findById(req.user._id);
  if (order && user) {
    const id = uuid_v4();
    order.isPaid = true;
    order.paidAt = Date.now();

      if (req.body.payMethod.toLowerCase() === "paypal") {
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req?.body?.payer?.email_address
        }
      } else if ((req.body.payMethod.toLowerCase() === "paypal") || req.body.payMethod.toLowerCase() === "fincra") {
        order.paymentResult = {
          id: req.body.details.id || id,
          status: 'paid',
          update_time: Date.now(),
          email_address: user.email
        }
      }

    const updateOrder = await order.save();
    return res.status(200).json(updateOrder);
    } else {
      res.status(404)
      throw new Error('Order or User not found');
    }

})

//Desc:     Update order to delivered
//@route:   PUT /api/orders/:id/deliver
//@access:  Private
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const { id } = data;
    const order = await orderModel.findById(id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      return res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } else {
    res.status(401)
    throw new Error('Invalid inputs')
  }
})

//Desc:     Get all orders
//@route:   GET /api/orders
//@access:  Private
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({}).populate('user', '_id name');
  if (orders) {
    return res.status(200).json(orders);
  }

  res.status(400);
  throw new Error('Could not find orders for users');
})

//Desc:     Change payment method
//@route:   PUT /api/orders/:orderId/pay-method
//@access:  Private
export const changePaymentMethod = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const { payMethod, orderId } = data;

    const order = await orderModel.findById(orderId);
    if (order) {
      order.paymentMethod = payMethod;

      await order.save();
      return res.status(200).json('Successful');
    } else {
      res.status(404);
      throw new Error('Order does not exist');
    }

  } else {
    res.status(401);
    throw new Error('Invalid inputs');
  }
})