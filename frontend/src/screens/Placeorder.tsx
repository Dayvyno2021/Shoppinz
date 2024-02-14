import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import CheckoutSteps from '@/components/CheckoutSteps';
import PageContainer from '@/components/PageContainer';
import { useCreateOrderMutation } from '@/redux/slices/orderApiSlice';
import Spinner from '@/components/Spinner';
import { clearCatItems } from '@/redux/slices/cartSlice';

const Placeorder = () => {
  //Define shipping address from redux store;
  const cart = useAppSelector((state) => state.cartSlice);

  //Define dispatch
  const dispatch = useAppDispatch();

  //Define useNavigate
  const navigate = useNavigate();

  //Define the rtk create order function
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const handlePlaceOrder = async() => {
    try {
      const res = await createOrder({
        orderItems: cart?.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice
      }).unwrap();
      dispatch(clearCatItems())
      navigate(`/order/${res._id}`);
    } catch (error) {
      process.env.NODE_ENV === 'development' ? console.log(error) : '';
      // console.log("ERROR:", error);
    }
  }

  React.useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, cart]);

  return (
    <>
      <PageContainer>
        <CheckoutSteps step1 step2 step3 step4 />
        <div className="w-full flex gap-10 flex-col lg:flex-row items-center lg:items-start">
          <div className="w-[340px] md:w-[600px] lg:w-[60%] flex flex-col order-2 lg:order-1 ">
            <h1 className="font-bold text-lg lg:text-3xl mb-3">Shipping Method</h1>
            <div className="flex gap-1 flex-wrap">
              <h1 className="text-sm lg:text-base font-medium">Address: </h1>
              <p className="text-sm lg:text-base"> {cart?.shippingAddress?.address} </p>
              <p className="text-sm lg:text-base"> {cart?.shippingAddress?.city} </p>
              <p className="text-sm lg:text-base"> {cart?.shippingAddress?.postalCode} </p>
              <p className="text-sm lg:text-base"> {cart?.shippingAddress?.country} </p>
            </div>
            <hr className='my-5' />
            <h1 className="font-bold text-lg lg:text-3xl mb-3">Payment Method</h1>
            <p className="text-sm lg:text-base">
              <span className="font-bold">Method:</span> {cart?.paymentMethod}
            </p>
            <hr className='my-5' />
            <h1 className="font-bold text-lg lg:text-3xl mb-3">Order Items</h1>
            <div className="flex flex-col gap-3">
              {
                cart.cartItems!.map((item) => (
                  <div key={item?._id} className="flex gap-10 items-center">
                    <div className="flex gap-5 w-[70%] items-center ">
                      <img src={item?.image} className='w-10 h-10 inline-block rounded-md' alt={item?.name} />
                      <p className="text-sm lg:text-base "> {item?.name} </p>
                    </div>
                    <p className=" w-[30%] "> {item?.qty} x {item?.price} = <span className="font-medium"> &#8358;{(item?.qty * item?.price!).toLocaleString()}</span> </p>
                  </div>
                ))
              }
              <hr className='my-5' />
            </div>
          </div>
          <div className="w-[340px] md:w-[600px] lg:w-[40%] order-1 lg:order-2">
            <div className="border border-gray-300 rounded-md flex flex-col">
              <h1 className="font-bold text-lg lg:text-3xl p-2">Order Summary</h1>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-medium "> Items: </p>
                <p className="text-sm lg:text-base">&#8358;{Number(cart?.itemsPrice)?.toLocaleString()} </p>
              </div>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-medium "> Shipping: </p>
                <p className="text-sm lg:text-base"> &#8358;{cart?.shippingPrice} </p>
              </div>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-medium "> Tax: </p>
                <p className="text-sm lg:text-base"> &#8358;{Number(cart?.taxPrice).toLocaleString()} </p>
              </div>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-semibold "> Total: </p>
                <p className="text-sm lg:text-base font-semibold"> &#8358;{Number(cart?.totalPrice).toLocaleString()} </p>
              </div>
              <hr />
              {
                error? 
              <div className="flex p-2 justify-center">
                <p className="text-sm lg:text-base text-red-400"> Could not create order. You may need to logout and re-login and try again </p>
              </div> : ''
              }
              <hr/>
              <div className="flex p-2">
                <button onClick={handlePlaceOrder} disabled={isLoading} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">
                  {isLoading? <Spinner/> : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default Placeorder