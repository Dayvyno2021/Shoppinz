import * as React from 'react';
// import { ProductType } from '../types';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { ProductType } from '@/redux/types/productTypes';



const Product = ({ product }: { product: ProductType }) => {

  return (
    <>
      <div className=" p-3 rounded">
        <Link to={`/product/${product._id}`} >
          <img src={product.image} alt={product.name} className='rounded-xl' />
        </Link>
        <div className="">
          <Link to={`/product/${product._id}`} >
            <p className="truncate text-xs font-semibold text-center my-1 md:text-sm md:my-3 lg:text-base transition-colors">{product.name}</p>  
          </Link>
          <h3 className="font-bold text-center text-xs text-black md:text-sm lg:text-base mb-2">&#8358; {product.price.toLocaleString()}</h3>
          <div>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Product);