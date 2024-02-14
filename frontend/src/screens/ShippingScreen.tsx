import * as React from 'react';
import PageContainer from '../components/PageContainer';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import CheckoutSteps from '../components/CheckoutSteps';

interface Shipping{
  address: string;
  city: string;
  postalCode: string;
  country: string;
}


const ShippingScreen = () => {

  const { shippingAddress } = useAppSelector((state) => state.cartSlice);

  const [inputs, setInputs] = React.useState<Shipping>({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || ''
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((inputValues) => ({ ...inputValues, [name]: value }));
  }
  
  const submitHanlder = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ ...inputs }));
    navigate('/payment');
  }

  //Handle the disable state of the form submission button
  const handleFormDisable = () => {
    if (!inputs.address || !inputs.city || !inputs.country || !inputs.postalCode) return true;
    return false;
  }

  return (
    <>
      <PageContainer>
        <CheckoutSteps step1 step2 />
        <div id='register' className="custom__form mx-auto">

          <h1 className="font-bold text-lg text-center">Shipping</h1>
        
          <form onSubmit={submitHanlder} className="flex flex-col gap-4">
            <div className="form__control">
              <label htmlFor="address" className=''>Address</label>
              <input type="address" required id='address' name='address' placeholder='Address' className='inp__el' value={inputs.address}
                onChange={handleInputChange} 
              />
            </div>
            <div className="form__control">
              <label htmlFor="city" className=''>City</label>
              <input type="city" required id='city' name='city' placeholder='City' className='inp__el' value={inputs.city}
                onChange={handleInputChange} 
              />
            </div>
            <div className="form__control">
              <label htmlFor="postalCode" className=''>Postal Code</label>
              <input type="postalCode" required id='postalCode' name='postalCode' placeholder='Postal Code' className='inp__el' value={inputs.postalCode}
                onChange={handleInputChange} 
              />
            </div>
            <div className="form__control">
              <label htmlFor="country" className=''>Country</label>
              <input type="country" required id='country' name='country' placeholder='Country' className='inp__el' value={inputs.country}
                onChange={handleInputChange} 
              />
            </div>

            <button disabled={handleFormDisable()} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">Continue</button>
          </form>
        </div>
      </PageContainer>
    </>
  )
}

export default ShippingScreen