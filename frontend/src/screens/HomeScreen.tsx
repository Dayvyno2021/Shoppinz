// import * as React from 'react';
import Product from '../components/Product';
import { ProductType } from '../types';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {

  const { data: products, error, isLoading } = useGetProductsQuery('');

  return (
    <>
      {error && <Message error='Could not fetch resource'/>}
      {isLoading && <Loader />}
      <h1 className="text-center font-bold text-xl mt-5 mb-3 md:text-2xl lg:text-4xl lg:mt-7 lg:mb-5">Latest Products</h1>
      <div className="home__screen flex flex-wrap gap-1 md:gap-3 lg:gap-5 justify-center max-w-[1280px] mx-auto">
        {
          products?.map((product:ProductType) => (
            <div className="home__screen-product w-[45%] md:w-[40%] lg:w-[30%] bg-stone-50" key={product?._id}>
              <Product product={product}/>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default HomeScreen;