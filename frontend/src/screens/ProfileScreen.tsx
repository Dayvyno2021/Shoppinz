import * as React from 'react';
import { useProfileMutation } from '@/redux/slices/usersApiSlice';
import { setCredentials } from '@/redux/slices/authSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import PageContainer from '@/components/PageContainer';
import { Link } from 'react-router-dom';
import {FaCheckCircle} from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { useGetMyOrdersQuery } from '../redux/slices/orderApiSlice';
import Loader from '../components/Loader';
// import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const ProfileScreen = () => {

  //Initiliaze useDispatch
  const dispatch = useAppDispatch();

  //Declare authSlice
  const { userInfo } = useAppSelector((state) => state.authSlice);

  //Get user Orders
  const {data: myOrders, isLoading:loadingMyOrders, error} = useGetMyOrdersQuery('')

  //Initoate the rtk useProfileMutation
  const [updateUser, { isLoading }] = useProfileMutation()
  
  //Catch all errors
  const [err, setErr] = React.useState('')

  //Initiate inputs
  const [inputs, setInputs] = React.useState<{ [key: string]: string |undefined }>({
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    password: '',
    confirmPassword: '',
    phone: userInfo?.phone || ''
  })

  //Initialize passwordVisible to control password visibility
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);

  //Manage password match
  const [passwordMatch, setPasswordMatch] = React.useState('');

    //Set password Visibility
  const handlePasswordVisibility = (e:React.FormEvent) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  }

  //Set confirm password visibility
  const handleConfirmPasswordVisibility = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmPasswordVisible(!confirmPasswordVisible);
  }

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  const handleUserUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputs.password) {
      if (inputs.password != inputs.confirmPassword) {
        setPasswordMatch('Password must match');
        return;
      } else {
        setPasswordMatch('');
      }
    } else {
      setPasswordMatch('');
    }
    try {
      const userDetails = {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        password: inputs.password,
        phone: inputs.phone
      }

      //Clone user details
      const clonedDetails = structuredClone(userDetails);

      //Strip cloned details of every property that is empty
      for (let x in clonedDetails) {
        if (!(clonedDetails as any)[x]) {
          delete (clonedDetails as any)[x]
        }
      }
      // console.log("CLONED: ", clonedDetails);
      const res = await updateUser(clonedDetails).unwrap();
      if (res) {
        dispatch(setCredentials({ ...res }));
        toast.success('Successful');
        setErr('');
      }
    } catch (err) {
      const e = ((err as any)?.data as any)?.message || (err as any)?.error
      setErr(e);
    }    
  }

  React.useEffect(() => {
    if (error) {
      const e = ((error as any)?.data as any)?.message || (error as any)?.error
      setErr(e);
    }
  },[error])

  return (
    <>
      {loadingMyOrders? <Loader/> : ''}
      <PageContainer>
        <div className="flex flex-col gap-10 xl:flex-row xl:justify-center">
          <div className="flex justify-center">
            <div id='register' className="custom__form">
              <h1 className="font-bold text-lg text-center">Update Profile</h1>
              <form className="flex flex-col gap-5" onSubmit={handleUserUpdate}>
                {err? <div className="text-red-400"> {err} </div>:''}
                <div className="form__control">
                  <label htmlFor="fn" className=''>First Name</label> 
                  <input type="text"
                    id='fn'
                    placeholder='first name'
                    name='firstName'
                    autoComplete='false' className='inp__el' value={inputs.firstName}
                    onChange={handleInputs}
                  />
                </div>
                <div className="form__control">
                  <label htmlFor="ln" className=''>Last Name</label>
                  <input type="text" id='ln'
                    placeholder='last name'
                    name='lastName'
                    className='inp__el'
                    value={inputs.lastName} autoComplete='false'
                    onChange={handleInputs}
                  />
                </div>
                <div className="form__control">
                  <label htmlFor="password" className=''>Password</label>
                  <input type={passwordVisible ? 'text' : 'password'}
                    id='password' placeholder='enter password'
                    name = 'password'
                    className='inp__el' value={inputs.password}
                    onChange={handleInputs}
                    pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
                  />
                  <button className="eye__cover remove__border p-0" disabled={Boolean(!inputs.password)}
                    onClick={handlePasswordVisibility} >
                    <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
                  </button>
                  <div className="password__validation text-[8px] absolute -bottom-3 md:text-[10px] md:-bottom-4">
                    <p className="flex items-center gap-1">
                      <FaCheckCircle className={/[a-z]/.test(inputs.password!)? 'check__green':'check__gray'} />
                      <span className="text-gray-500">Lowercase</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <FaCheckCircle className={/[A-Z]/.test(inputs.password!)? 'check__green':'check__gray'} />
                      <span className="text-gray-500">Uppercase</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <FaCheckCircle className={inputs.password!.length > 8? 'check__green':'check__gray'} />
                      <span className="text-gray-500">Min char(8)</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <FaCheckCircle className={/\d/.test(inputs.password!)? 'check__green':'check__gray'} />
                      <span className="text-gray-500">Number</span>
                    </p>
                  </div>
                </div>            
                <div className="form__control">
                  <label htmlFor="psw-confirm" className=''>Confirm Password</label>
                  <input type={confirmPasswordVisible ? 'text' : 'password'} id='psw-confirm'
                    name='confirmPassword'
                    placeholder='confirm password' className='inp__el'
                    value={inputs.confirmPassword}
                    onChange={handleInputs}
                  />
                  <button className="eye__cover remove__border p-0"
                    disabled={Boolean(!inputs.confirmPassword)} type='submit'
                    onClick={handleConfirmPasswordVisibility}>
                    <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
                  </button>
                  <p className="password__validation flex gap-2 text-[8px] absolute -bottom-3 md:text-[10px] md:-bottom-4 text-red-400">
                    {passwordMatch}
                  </p>
                </div>
                <div className="form__control">
                  <label htmlFor="phone" className=''>Phone</label>
                  <input type="tel" id='phone'
                    placeholder='Phone'
                    name='phone'
                    className='inp__el'
                    value={inputs.phone} autoComplete='false'
                    onChange={handleInputs}
                  />
                </div>
                <button disabled={isLoading}
                  className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">
                  Update {isLoading && <span className="ml-2"><Spinner /></span>}
                </button>
              </form>
            </div>
          </div>
          <div className="py-10 overflow-x-scroll mx-auto">
            {
              myOrders?.length ? (
                <table className="profile__table">
                  <thead>
                    <tr className="">
                      <th className='rounded-ss-xl'>ID</th>
                      <th className='border'>DATE</th>
                      <th className='border'>TOTAL(&#8358;)</th>
                      <th className='border'>PAID</th>
                      <th className='border'>DELIVERED</th>
                      <th className='rounded-se-xl'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      myOrders?.map((order) => (
                        <tr key={order?._id} className="">
                          <td className=""> {order?._id} </td>
                          <td className=""> {order?.createdAt?.substring(0, 10)} </td>
                          <td className=""> {order?.totalPrice} </td>
                          <td className="">
                            {
                              order?.isPaid ? ( order?.paidAt?.substring(0, 10)
                              ): (<FaTimes className="fill-red-400"/>)
                            }
                          </td>
                          <td className="">
                            {
                              order?.isDelivered ? ( order?.deliveredAt?.substring(0, 10)
                              ): (<FaTimes className="fill-red-400"/>)
                            }
                          </td>
                          <td>
                            <Link to={`/order/${order?._id}`} className='custom__btn'>
                              <button>
                                Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              ):('')
            }
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default ProfileScreen;