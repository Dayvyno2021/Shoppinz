import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware.js/errorMiddleare.js';
import cookieParser from 'cookie-parser';

dotenv.config();//This has to come before connectDB function

connectDb();


const app = express();

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200
// }

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Register the Cookie Parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running');
})

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Server running on port ${port}`))