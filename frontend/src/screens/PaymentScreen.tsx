import * as React from 'react'
import PageContainer from '../components/PageContainer'
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '@/redux/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';



const PaymentScreen = () => {
  //Initiate the dispatch method
  const dispatch = useAppDispatch();

  //Instantiate useNavigate
  const navigate = useNavigate();

  //Recall the cartslice storage states
  const {shippingAddress} = useAppSelector(state=>state.cartSlice)

  //Instantiate the payment method state
  const [payment, setPayment] = React.useState('');

  //Handle the selection of payment method
  const handlePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    setPayment(val);
  }

  //Submit the chosen payment method to storage
  const submitPayment = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(savePaymentMethod(payment));
    navigate('/placeorder')
  }

  React.useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping')
    }
  }, [navigate, shippingAddress])

  return (
    <>
      <PageContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1 className="font-bold text-lg lg:text-2xl text-center">Payment Method</h1>
        <div id='register' className="custom__form mx-auto ">
          <h2 className="font-medium lg:text-lg">Select Payment Method</h2>
          <form onSubmit={submitPayment} className="flex flex-col justify-start gap-5">
            <div className="form__radio-group">
              <input type="radio" name="payment" value="Paypal" onChange={handlePayment} id="paypal"
                className='form__radio-input' />
              <label htmlFor="paypal" className='form__radio-label'>
                <span className="form__radio__button"></span>
                PayPal or Credit Card
              </label>
            </div>
            <div className="form__radio-group">
              <input type="radio" name="payment" value="PayStack" onChange={handlePayment} id="paystack"
                className='form__radio-input' />
              <label htmlFor="paystack" className='form__radio-label'>
                <span className="form__radio__button"></span>
                PayStack
              </label>
            </div>
            <div className="form__radio-group">
              <input type="radio" name="payment" value="Fincra" onChange={handlePayment} id="fincra"
                className='form__radio-input' />
              <label htmlFor="fincra" className='form__radio-label'>
                <span className="form__radio__button"></span>
                Fincra
              </label>
            </div>
            <button disabled={Boolean(!payment)} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">Continue</button>
          </form>      
        </div>
      </PageContainer>


    </>
  )
}

export default PaymentScreen