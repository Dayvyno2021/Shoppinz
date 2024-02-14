import { matchedData, validationResult } from "express-validator";
import asyncHandler from "../middleware.js/asyncHandler.js";
import productModel from "../models/productModel.js";

//Desc:     Fetch all products
//@route:   GET /api/products
//@access:  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword? {name: {$regex: req.query.keyword, $options: 'i'}}: {}

  const count = await productModel.countDocuments({...keyword});
  const products = await productModel.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize*(page-1));

  if (products) {
    return res.json({ products, pages: Math.ceil(count / pageSize), page });
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

//Desc: Create a new Product
//Route: POST /api/products
//Access: private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  const product = new productModel({
    name: 'Sample',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct)
});

/**
 * DESC: Update a product
 * ROUTE: PUT /api/products/:id
 * ACCESS: private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock, image } = req.body;
  // console.log({ name, price, description, brand, category, countInStock });

  const product = await productModel.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.image = image || product.image
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock


    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
    
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
})

/**
 * DESC: Delete a product
 * ROUTE: DELETE /api/products/:id
 * ACCESS: private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    const product = await productModel.findById(data.id);

    if (product) {
      await productModel.deleteOne({ _id: product._id });
      return res.json({ message: 'product deleted' });
    }

    res.status(404);
    throw new Error('Product not found');
  }

  res.status(400);
  throw new Error('Validation Error');
})

/**
 * DESC: Create a new eview
 * ROUTE: POST /api/products/:id/reviews
 * ACCESS: private
 */

export const createProductReview = asyncHandler(async (req, res) => {
  
  const { rating, comment } = req.body;
  
  const product = await productModel.findById(req.params.id);
  
  if (product){
    
    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.lastName + " " + req.user.firstName,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });

  }else {
    res.status(404);
    throw new Error('Resource not found');
  }

})

//Desc:     Get top rated products
//@route:   GET /api/products/top
//@access:  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({}).sort({rating: -1}).limit(3);

  if (products) {
    return res.json(products);
  }

  res.status(404);
  throw new Error('Resource not found');
})