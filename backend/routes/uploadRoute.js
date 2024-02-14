import path from 'path';
import express from 'express';
import formidable from 'formidable';
import productModel from '../models/productModel.js';
import fs from 'fs';
import asyncHandler from "../middleware.js/asyncHandler.js";
// import aws from 'aws-sdk';
import multer from 'multer';
const router = express.Router();
// import multerS3 from 'multer-s3';




import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { Readable } from 'stream';

// Configure AWS SDK
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer
const upload = multer();

router.post('/:id', upload.single('image'), asyncHandler(async (req, res) => {
  const { originalname, buffer } = req.file;

  const bucketName = 'shoppinz';
  const fileName = `${Date.now()}-${originalname}`;

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ACL: 'public-read',
  };

  if (process.env.AWS_ACCESS_KEY  && process.env.AWS_SECRET_ACCESS_KEY) {
    const val = await new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }).send(new PutObjectCommand(uploadParams));
    
    if (val) {
      // console.log(`https://${bucketName}.s3.amazonaws.com/${fileName}`);
      return res.json({
        image: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
        message: 'Image upload successful'
      });    
    } else {
      // console.error(error);
      res.status(500);
      throw new Error('Failed to upload image to S3')
    } 
  } else {
    res.status(500);
    throw new Error('E nor work')
  }

}));

export default router;