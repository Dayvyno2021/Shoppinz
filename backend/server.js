import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware.js/errorMiddleare.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import uploadRoutes from './routes/uploadRoute.js'
// import formData from 'express-form-data';
// import os from 'os';

dotenv.config();//This has to come before connectDB function

connectDb();


const app = express();

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200
// }

// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true
// };

// // parse data with connect-multiparty. 
// app.use(formData.parse(options));
// // delete from the request all empty files (size == 0)
// app.use(formData.format());
// // change the file objects to fs.ReadStream 
// app.use(formData.stream());
// // union the body and the files
// app.use(formData.union());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Register the Cookie Parser middleware
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);


const __dirname = path.resolve(); // set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static(path.join(__dirname, '/frontend/dist')))
  //any route that is not api will be directed to index.html
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
  
} else {
  app.get('/', (req, res) => {
  res.send('API is running');
  })
}


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Server running on port ${port}`))