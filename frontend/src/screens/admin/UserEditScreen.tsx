import Loader from '@/components/Loader';
import PageContainer from '@/components/PageContainer';
import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineRollback } from 'react-icons/ai';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../redux/slices/usersApiSlice';
// import { useGetUserDetailsQuery, useUpdateUserMutation } from '@/redux/slices/usersApiSlice';
import { UserTypes } from '@/redux/types/userTypes';
import { Switch } from '@headlessui/react';

const UserEditScreen = () => {

  const { id: userId } = useParams();
  const navigate = useNavigate();

  //use the rtk UseGetProductByIdQuery to get a product
  const { currentData: user, isLoading, error, refetch } = useGetUserDetailsQuery({ userId: userId! })

  const [inputs, setInputs] = React.useState<Partial<UserTypes>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    // isAdmin: user?.isAdmin || false,
  })

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  //Toggle Admin
  const [admin, setAdmin] = React.useState(false);

  const [editUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const handleProductUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // console.log({ ...inputs, isAdmin: admin });
      const res = await editUser({ ...inputs, isAdmin: admin!, id: userId! }).unwrap();
      refetch()
      if (res) {
        toast.success('User updated successfully');
        navigate(`/admin/users-list`);
      }
    } catch (error) {
      const ee = (error as any)?.data?.message || (error as any)?.error;
      toast.error(ee);
    }
  }

  const handleUserAdminStatus = () => {
    setAdmin((val) => !val);
  }
  
  // console.log(product);
  React.useEffect(() => {
    // refetch();
    if (user) {
      setInputs({ ...user })
    }

    if (user?.isAdmin) {
      setAdmin(true);
    }
  }, [user]);

  return (
    <>
      {isLoading ? <Loader/> : ''}
      <PageContainer>
        <div className="flex flex-col items-center">
          <Link to='/admin/products' className='mb-3 self-start'>
            <AiOutlineRollback fill='#d97706' />
          </Link>
          {
            error ? (
              <p className="text-red-400 mx-auto text-sm lg:text-base">
                {(error as any)?.data?.message || (error as any)?.error}
              </p>         
            ):('')
          }

          <div id='register' className="custom__form">
            <h1 className="font-bold text-lg text-center">Update User Details</h1>
            <form className="flex flex-col gap-5" onSubmit={handleProductUpdate}>
              {/* {err? <div className="text-red-400"> {err} </div>:''} */}
              <div className="form__control">
                <label htmlFor="fn" className=''>First Name </label> 
                <input type="text"
                  id='fn'
                  placeholder='First Name'
                  name='firstName'
                  autoComplete='false' className='inp__el' value={inputs.firstName}
                  onChange={handleInputs}
                />
              </div>
              <div className="form__control">
                <label htmlFor="ln" className=''>Last Name</label>
                <input type="text" id='ln'
                  placeholder='Price'
                  name='lastName'
                  className='inp__el'
                  value={inputs.lastName} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>
              
              <div className="flex gap-5 items-center justify-center">
                <p className="font-semibold text-sm lg:text-base">
                  {
                    user?.isAdmin? ('Admin Status'):('Make Admin')
                  }:
                </p>
                <Switch
                  checked={admin}
                  onChange={handleUserAdminStatus}
                  className={`${admin ? 'bg-green-700' : 'bg-gray-400'}
                    relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${admin ? 'translate-x-9' : 'translate-x-0'}
                      pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
                      
              {/* <div className="form__control">
                <label htmlFor="brand" className=''>Brand</label>
                <input type="tel" id='brand'
                  placeholder='Brand'
                  name='brand'
                  className='inp__el'
                  value={inputs.brand} autoComplete='false'
                  onChange={handleInputs}
                />
              </div> */}


              <button disabled={isLoading}
                className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">
                Update {loadingUpdate && <span className="ml-2"><Spinner /></span>}
              </button>
            </form>
          </div>     

        </div>
      </PageContainer>
    </>
  )
}

export default UserEditScreen