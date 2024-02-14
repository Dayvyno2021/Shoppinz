'use client';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FaCheckCircle} from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';
import Spinner from '../components/Spinner';
import { useAppSelector } from '../redux/hooks';
import { useRegisterMutation } from '../redux/slices/usersApiSlice';

const RegisterScreen = () => {

  //initialize useRouter
  const navigate = useNavigate();

  //Catch errors
  const [err, setErr] = useState('');

  const {userInfo} = useAppSelector(state=>state.authSlice)

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

  const [register, { isLoading }] = useRegisterMutation();

  //Initialize form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //Manage password match
  const [passwordMatch, setPasswordMatch] = useState('');

  const handleFormRegister = async(e:React.FormEvent) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setPasswordMatch('Password must match');
      return;
    } else {
      setPasswordMatch('');
    }

    try {
      await register({ firstName, lastName, email, password }).unwrap();
      navigate('/register/success');
      setErr('');
    } catch (error) {
      const ee = (error as any)?.data?.message || (error as any)?.error;
      setErr(ee);
    } finally {
      setFirstName('');
      setLastName('')
      setPassword('');
      setConfirmPassword('');
      setEmail('');
    }
  }

  const handleFormDisable = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) return true;
    return false;
  }

  //redirect to home if session is valid
  useEffect(() => {
    if (userInfo?.firstName) {
      navigate('/');
    }
  },[userInfo])

  return (
    <div className='min-h-[75vh] flex justify-center'>
      <div id='register' className="custom__form">
        <h1 className="font-bold text-lg text-center">Register With Credentials</h1>
        {err? (<p className="text-center text-xs text-red-400"> {err} </p>):('')}
        
        <form className="flex flex-col gap-5" onSubmit={handleFormRegister}>
        <div className="form__control">
          <label htmlFor="fn" className=''>First Name</label>
          <input type="text" required id='fn' placeholder='firstname' autoComplete='false' className='inp__el' value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
          />
        </div>
        <div className="form__control">
          <label htmlFor="ln" className=''>Last Name</label>
          <input type="text" required id='ln' placeholder='last name' className='inp__el' value={lastName} autoComplete='false'
            onChange={(e)=>setLastName(e.target.value)}
          />
        </div>
        <div className="form__control">
          <label htmlFor="email" className=''>Email</label>
          <input autoComplete='false' type="email" required id='email' placeholder='enter email' className='inp__el' value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        <div className="form__control">
          <label htmlFor="password" className=''>Password</label>
          <input type={passwordVisible ? 'text' : 'password'} required id='password' placeholder='enter password' className='inp__el' value={password}
            onChange={(e)=>setPassword(e.target.value)} pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
          />
          <button className="eye__cover remove__border p-0" disabled={Boolean(!password)} onClick={handlePasswordVisibility} >
            <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
          </button>
          <div className="password__validation text-[8px] absolute -bottom-3 md:text-[10px] md:-bottom-4">
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
          <input type={confirmPasswordVisible? 'text' : 'password'} required id='psw-confirm' placeholder='confirm password' className='inp__el' value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />
          <button className="eye__cover remove__border p-0" disabled={Boolean(!confirmPassword)} type='submit' onClick={handleConfirmPasswordVisibility}>
            <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
          </button>
          <p className="password__validation flex gap-2 text-[8px] absolute -bottom-3 md:text-[10px] md:-bottom-4 text-red-400">
            {passwordMatch}
          </p>
        </div>
        <button disabled={handleFormDisable() || isLoading} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">Register {isLoading && <span className="ml-2"><Spinner/></span> } </button>
        <p className="text-sm">
          Have an account? proceed to
          <Link to='/login' className='text-amber-700 hover:text-amber-900 transition-colors ml-2 italic'>Login</Link>
          </p>
          </form>
      </div>
    </div>
  )
}

export default RegisterScreen;