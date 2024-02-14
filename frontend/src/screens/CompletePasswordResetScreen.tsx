'use client';
import { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import {FaCheckCircle} from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
// import Message from '../components/Message';
import { useCompletePasswordResetMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import Message from '../components/Message';

const CompletePasswordResetScreen = () => {

  //initialize useRouter
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  //Initialize the session object
  const { userInfo } = useAppSelector((state) => state.authSlice);
  
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const token = sp.get('token');

  //Initialize passwordVisible to control password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

  //Initialize form inputs
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //Manage password match
  const [passwordMatch, setPasswordMatch] = useState('');

  const [completePasswordReset, { isLoading, error }] = useCompletePasswordResetMutation();

  //Handle the form submission
  const updatePassword = async(e:React.FormEvent) => {
    e.preventDefault();
    try {
      
      if (password != confirmPassword) {
        setPasswordMatch('Password must match');
        return;
      } else {
        setPasswordMatch('');
      }

      const res = await completePasswordReset({ token, password }).unwrap();
      
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      
    } finally {
      setPassword('');
      setConfirmPassword('');
    }

  }

  const handleFormDisable = () => {
    if (!password || !confirmPassword || isLoading) return true;
    return false;
  }

  //redirect to home if session is valid
  useEffect(() => {
    if (userInfo?.firstName) {
      navigate('/');
    }
  },[userInfo, navigate])

  return (
    <div className='min-h-[75vh] flex items-center flex-col '>
      {error && <Message error='Error occured! email token may have expired. Try again' />}
      <div id='register' className="custom__form">
        <h1 className="font-bold text-lg text-center">Reset Password</h1>
        <form className="flex flex-col gap-5" onSubmit={updatePassword}>

        <div className="form__control">
          <label htmlFor="password" className=''>Password</label>
          <input type={passwordVisible ? 'text' : 'password'} required id='password' placeholder='enter password' className='' value={password}
            onChange={(e)=>setPassword(e.target.value)} pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
          />
          <button className="eye__cover remove__border p-0" disabled={Boolean(!password)} onClick={handlePasswordVisibility} >
            <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
          </button>
          <div className="password__validation flex gap-2 text-[8px] absolute -bottom-3 md:text-[10px] md:-bottom-4">
            <p className="flex items-center gap-1">
              <FaCheckCircle className={/[a-z]/.test(password)? 'check__green':'check__gray'} />
              <span className="text-gray-500">Lowercase</span>
            </p>
            <p className="flex items-center gap-1">
              <FaCheckCircle className={/[A-Z]/.test(password)? 'check__green':'check__gray'} />
              <span className="text-gray-500">Uppercase</span>
            </p>
            <p className="flex items-center gap-1">
              <FaCheckCircle className={password.length > 8? 'check__green':'check__gray'} />
              <span className="text-gray-500">Min char(8)</span>
            </p>
            <p className="flex items-center gap-1">
              <FaCheckCircle className={/\d/.test(password)? 'check__green':'check__gray'} />
              <span className="text-gray-500">Number</span>
            </p>
          </div>
        </div>
        <div className="form__control">
          <label htmlFor="psw-confirm" className=''>Confirm Password</label>
          <input type={confirmPasswordVisible? 'text' : 'password'} required id='psw-confirm' placeholder='confirm password' className='' value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />
          <button className="eye__cover p-0 remove__border" disabled={Boolean(!confirmPassword)} type='submit' onClick={handleConfirmPasswordVisibility}>
            <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
          </button>
          <p className="password__validation flex gap-2 text-[8px] absolute -bottom-3 md:text-[10px] md:-bottom-4 text-red-400">
            {passwordMatch}
          </p>
        </div>
        <button disabled={handleFormDisable()} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">Reset {isLoading && <span className="ml-2"><Spinner/></span> } </button>
      </form>
      </div>
    </div>
  )
}

export default CompletePasswordResetScreen;