import {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useAppDispatch,useAppSelector } from '../redux/hooks';
import { AiFillEye } from 'react-icons/ai';
import Spinner from '../components/Spinner';
// import Loader from '../components/Loader';
import { useLoginMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {

   //initialize useNavigate
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [login, { isLoading}] = useLoginMutation();

  // //handle page loading
  // const [loading, setLoading] = useState<Boolean | undefined>(undefined);
  
  const { userInfo } = useAppSelector((state) => state.authSlice);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  //Initialize passwordVisible to control password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  //Set password Visibility
  const handlePasswordVisibility = (e:React.FormEvent) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  }

  //Initialize form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Handle form submission
  const handleFormLogin = async(e:React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      navigate(redirect);
    } catch (error) {
      process.env.NODE_ENV === 'development' ? console.log('ERROR: ', error) : '';
      toast.error('Error occured! Check credentials');
    } finally {
      setPassword('');
      setEmail('');  
    }
  }

  //Handle the disable state of the form submission button
  const handleFormDisable = () => {
    if (!email || !password) return true;
    return false;
  }

  useEffect(() => {
    if (userInfo?._id) {
      navigate(redirect);
    }
  }, [userInfo, redirect])

  return (
    <>
      <PageContainer>
        <div id='register' className="custom__form mx-auto">

          <h1 className="font-bold text-lg text-center">Login With Credentials</h1>
        
          <form onSubmit={handleFormLogin} className="flex flex-col gap-4">
            <div className="form__control">
              <label htmlFor="email" className=''>Email</label>
              <input type="email" required id='email' placeholder='enter email' className='inp__el' value={email}
                onChange={(e)=>setEmail(e.target.value)} 
              />
            </div>
            <div className="form__control">
              <label htmlFor="password" className=''>Password</label>
              <input type={passwordVisible ? 'text' : 'password'} required id='password' placeholder='password' className='inp__el' value={password}
                onChange={(e)=>setPassword(e.target.value)} autoComplete='false'
              />
              <button className="eye__cover p-0 remove__border" disabled={Boolean(!password)} onClick={handlePasswordVisibility} >
                <AiFillEye className='text-gray-500 hover:text-gray-700 active:text-gray-700 transition-all' />
              </button>
            </div>
            <button disabled={handleFormDisable() || isLoading} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">Login {isLoading && <span className="ml-2"><Spinner /></span>} </button>
            <div className="italic  text-xs sm:text-sm">Forgot password? <Link to='/password-reset' className="text-amber-700">Reset Password</Link></div>
            <p className=" text-xs sm:text-sm">
              Have an account? proceed to
              <Link to='/register' className='text-amber-700 hover:text-amber-900 transition-colors ml-2 italic'>Register</Link>
            </p>
          </form>
        </div>
      </PageContainer>
    </>
  )
}

export default LoginScreen