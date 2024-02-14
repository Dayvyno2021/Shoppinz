import * as React from 'react';
import { FaTrash } from 'react-icons/fa';
// import Message from '../components/Message';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, addToCart, removeFromCart } from '../redux/slices/cartSlice';
import PageContainer from '../components/PageContainer';

const CartScreen = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cartItems } = useAppSelector((state) => state.cartSlice);


  const ChangeCartQty = (e: React.ChangeEvent<HTMLSelectElement>, product: CartItem) => {
    dispatch(addToCart({ ...product, qty: Number(e.target.value) }));
  }

  const handleDeleteFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  }

  const handleCheckout = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <>
      <PageContainer>
        <div className="flex flex-col">
          <h1 className="text-center font-extrabold text-gray-600 font-mono text-2xl lg:text-4xl my-5">SHOPPING CART</h1>
          {
            cartItems!.length === 0 ?
            (<div className="w-[90%] md:w-[600px] bg-blue-200 px-2 py-3 mx-auto flex gap-5 items-center rounded">
              <p className="">Cart is empty!</p>
              <Link to={'/'} className='bg-green-200 p-2 rounded hover:bg-green-300 text-amber-600 hover:text-amber-700 transition-all'> Go shopping </Link>
            </div>)
              :
            (<div className="flex flex-col gap-5 items-center lg:flex-row lg:items-start mx-auto xl:gap-10">
                <div className="flex flex-col gap-5 order-2 lg:order-1">
                  <h2 className="font-bold text-xl text-center mt-5 lg:hidden">Cart Details</h2>
                {
                  cartItems?.map((item) => (
                  <div className="border border-gray-200 p-5 bg-gray-50 rounded-xl shadow max-w-[850px]" key={item._id}>
                    <div className="w-full flex flex-col md:flex-row items-center gap-5 md:gap-5 justify-between">
                      <img src={item?.image} alt={item?.name} className='w-[60%] md:w-[25%] block rounded shadow' />   
                      <Link to={`/product/${item._id}`} className='text-center w-full lg:w-[35%]'> {item?.name} </Link>
                      <p className="font-semibold w-[6rem] px-2 py-3 text-amber-600 rounded">&#8358;{item?.price?.toLocaleString()} </p>
                        
                      <div className="flex gap-5 bg-gray-200 p-3 rounded">
                        {
                          item?.countInStock ? 
                            (
                            <>
                              <p className="font-semibold">Qty</p>
                              <select name="qty" id="qty" value={item.qty} onChange={(e)=>ChangeCartQty(e, item)} className='rounded focus:border-none active:border-none focus:outline-none active:outline-none'>
                                {
                                  [...Array(item?.countInStock).keys()].map((x, i) => (
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
                      
                      <button onClick={()=>handleDeleteFromCart(item._id!)} className='trash_can rounded bg-gray-200 p-4 focus:border-none active:border-none focus:outline-none active:outline-none'>  
                        <FaTrash fill='#f87171' className='' />
                      </button>
                        
                    </div>    
                    <div className="w-full h-2 bg-gray-200 hidden"></div>    
                  </div>
                ))    
                }
                </div>
                <div className="w-[90%] max-w-[450px] lg:w-[320px] order-1 lg:order-2 border border-gray-200 rounded-2xl">
                  <div className="px-3 py-5">
                    <h2 className="text-2xl font-bold">Subtotal ({cartItems?.reduce((acc, item)=>acc + Number(item.qty), 0)}) items</h2>
                    <p className="mt-2 font-semibold"> &#8358;{(cartItems!.reduce((acc, item)=> acc + Number(item.price)*Number(item.qty), 0)).toLocaleString()} </p>
                  </div>
                  <hr className='w-full border border-gray-200' />
                  <div className="flex justify-center items-center py-5">
                    <button onClick={handleCheckout} className='custom__btn' >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
            </div>  )
          }


        </div>
      </PageContainer>
    </>
  )
}

export default CartScreen