import * as React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AiOutlineRollback } from 'react-icons/ai';
import Rating from '../components/Rating';
import { useGetProductByIdQuery } from '../redux/slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();

  //Initialize useAppDispatch
  const dispatch = useAppDispatch();

  //Initialize useNavigate
  const navigate = useNavigate();

  //Manage product qty
  const [qty, setQty] = React.useState<number>(1);

  const { data: product, error, isLoading } = useGetProductByIdQuery(productId!);

  const addToCartHandler = (value:number) => {
    dispatch(addToCart({ ...product, qty: value }));
    navigate('/cart');
  }
  
  return (
    <>
      {error && <Message error='Could not fetch resource' />}
      {isLoading && <Loader />}
      <div className="max-w-[1536px] px-3 py-5 mb-10 mx-auto">
        <div className="flex flex-col gap-3 lg:gap-10">
          <Link to='/' className='mb-3 self-start'>
            <AiOutlineRollback fill='#d97706' />
          </Link>

          <div className="flex flex-col items-center gap-5 lg:gap-10 lg:flex-row lg:items-start">
            <img src={product?.image} alt={product?.name} className='w-[90%] rounded md:w-[70%] lg:w-[40%]' />

            <div className="flex flex-col gap-3 w-full py-5 lg:pt-0">
              <div className="w-full h-[1px] bg-amber-600 mb-5 lg:bg-gray-200"></div>

              <p className="text-center font-bold text-[#646cff]"> {product?.name} </p>

              <Rating value={product?.rating!} text={`${product?.numReviews} reviews`} />
              
              <p className="px-3"> {product?.description} </p>
              
              <div className="w-full h-[1px] bg-amber-600 mt-5 lg:bg-gray-200"></div>
            </div>

            <div className="border border-gray-200 w-[80%] rounded shadow">
              <p className="p-3 flex justify-between">
                <span className="font-semibold">Price</span>
                <span className="font-bold"> &#8358; {product?.price.toLocaleString()} </span>
              </p>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <p className="p-3 flex justify-between">
                <span className="font-semibold">Status</span>
                <span className="font-bold"> {product?.countInStock ? 'In Stock' :  'Out of Stock'} </span>
              </p>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="flex justify-center items-center py-2">
                <div className="flex gap-5 bg-gray-200 p-3 rounded">
                  {
                    product?.countInStock ? 
                      (
                      <>
                        <p className="font-semibold">Qty</p>
                        <select name="qty" id="qty" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className='rounded focus:border-none active:border-none focus:outline-none active:outline-none'>
                          {
                            [...Array(product?.countInStock).keys()].map((x, i) => (
                              <option key={`QTY${i}`} value={x+1} > {x+1} </option>
                            ))
                          }
                        </select>
                      </>
                      )
                      :
                      (<p className=''> <i>Out of Stock</i> </p>)
                        
                  }
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="flex justify-center items-center py-5">
                <button onClick={()=>addToCartHandler(qty)} className='disabled:bg-gray-600 shadow disabled:hover:text-[#646cff]' disabled={product?.countInStock === 0} >
                  Add To Cart
                </button>
              </div>


            </div>


          </div>
        </div>
      </div>
    </>
  )
}

export default ProductScreen;