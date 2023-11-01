import mongoose from "mongoose";
import colors from 'colors';
import orderModel from "./models/orderModel.js";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";
import { productsData } from "./data/products.js";
import dotenv from 'dotenv';
import { users } from "./data/user.js";
import connectDb from "./config/db.js";
dotenv.config();
connectDb();

export const importData = async () => {
  try {
    await orderModel.deleteMany();
    await productModel.deleteMany();
    await userModel.deleteMany();

    const createUsers = await userModel.insertMany(users);

    const sampleProducts = productsData.map((product) => {
      return { user: createUsers[0]._id, ...product };
    })

    await productModel.insertMany(sampleProducts);
    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    process.env.NODE_ENV === 'development' ? console.log(error) : '';
    process.exit(1);
  }
}

export const destroyData = async () => {
  try {
    await orderModel.deleteMany();
    await productModel.deleteMany();
    await userModel.deleteMany();
    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

// console.log(`LOG:: ${process.argv}`);