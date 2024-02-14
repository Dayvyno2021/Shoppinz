'use client';
import { useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthRegisterMutation } from '../redux/slices/usersApiSlice';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { verifyUser } from '../redux/slices/authSlice';
import Loader from '../components/Loader';

// interface Data {
//   message?: string;
// }

const VerifyEmailScreen = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const email = sp.get('email');
  const token = sp.get('token');
  // console.log({ email, token });
  
  const [verifyRegister, { isLoading, error}] = useAuthRegisterMutation();

  const { userInfo } = useAppSelector((state) => state.authSlice);


  useEffect(() => {

    async function verify() {
      if (userInfo?._id) {
        navigate('/');
      }
      try {
        const res = await verifyRegister({ token, email }).unwrap();
        // console.log("RES: ", res);
        dispatch(verifyUser({ ...res }));
      } catch (err) {
        const ee = (error as any)?.data?.message || (error as any)?.error;
        toast.error(ee);
      }
    }

    if (token) verify();
  }, [token, userInfo])

  return (
    <div className='w-full min-h-[70vh] px-5 py-5'>
      {isLoading && <Loader/>}
      <div>
        <h1 className="text-center font-bold text-gray-800 my-10 text-base">
          Email Verification
        </h1>

        {
          error &&
            (<p className="bg-red-200 px-5 py-3">
              Token may have expired. Please proceed to register afresh
              <Link to='/register' className="bg-green-300 hover:bg-green-400 px-3 py-1 ml-2 rounded text-gray-800">Register</Link>
            </p> )           
        }
      </div>
    </div>
  )
}

export default VerifyEmailScreen