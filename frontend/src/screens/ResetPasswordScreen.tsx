'use client';
import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks';
import { useResetPasswordMutation } from '../redux/slices/usersApiSlice';

const ResetPasswordScreen = () => {

  //instantiate useRouter and useSession
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.authSlice);

  //Define the email, error and loading useState
  const [email, setEmail] = useState<string>('');
  const [data, setData] = useState();

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  async function handlePasswordReset(e:React.FormEvent) {
    e.preventDefault()
    try {
      const res = await resetPassword({ email }).unwrap();
      setData(res);
      
    } catch (error) {
      
    } finally {
      setEmail('');
    }
  }

  const handleFormDisable = () => {
    if (!email || isLoading) return true;
    return false;
  }

  useEffect(() => {
    if (userInfo?._id) {
      navigate('/');
    }
  },[userInfo])

  return (
    <div className="min-h-[70vh]">
      {
        data && <Message success='Successful! Check your mail for a password reset message' />
      }
      <div className="flex flex-col px-5 py-5 my-5 gap-4 items-center">
        <h1 className="font-bold text-center text-lg">Password Reset</h1>
        {
          error && (
            <Message error='Error reseting password. Try again' />
          )
        }
        <p className="bg-blue-200 rounded px-2 py-1">
          Have you forgotten your password? don't worry, you can reset it, just fill the form below and submit
        </p>

        <div id='reset' className="custom__form ">
          
          <form onSubmit={handlePasswordReset} className="flex flex-col gap-4 items-center">
            <div className="form__control">
              <label htmlFor="email" className=''>Email</label>
              <input type="email" required id='email' placeholder='enter email' className='inp__el' value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <button disabled={handleFormDisable()} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">Reset {isLoading && <span className="ml-2"><Spinner /></span>} </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default ResetPasswordScreen