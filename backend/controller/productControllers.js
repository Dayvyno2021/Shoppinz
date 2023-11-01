import asyncHandler from "../middleware.js/asyncHandler.js";
import productModel from "../models/productModel.js";

//Desc:     Fetch all products
//@route:   GET /api/products
//@access:  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({});

  if (products) {
    return res.json(products);
  }

  res.status(404);
  throw new Error('Resource not found');
})

//Desc:     Fetch a single product
//@route:   GET /api/products/:id
//@access:  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);

  if (product) {
    return res.json(product);
  }

  res.status(404);
  throw new Error('Resource not found');
})