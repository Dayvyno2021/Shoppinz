import * as React from 'react';
import Loader from '@/components/Loader';
import PageContainer from '@/components/PageContainer'
// import { useAppSelector } from '@/redux/hooks';
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteUserMutation, useGetUsersQuery } from '@/redux/slices/usersApiSlice';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  //Instantiate dispatch, navigate
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //Reference the authslice userInfo
  // const { userInfo } = useAppSelector((state) => state.authSlice);

  //Initiate rtk useGetOrdersQuery
  const { currentData: users, refetch, isLoading, error } = useGetUsersQuery('');
  
  //Instantiate the rtk user Delete handler
  const [delUser, { isLoading: deleting }] = useDeleteUserMutation();

  const deleteHandler = async(id:string) => {
    if (window.confirm('Delete user?')) {
      try {
        const res = await delUser({ userId: id }).unwrap();
        refetch();
        toast.success(res.message);
      } catch (error) {
        const ee = (error as any)?.data?.message || (error as any)?.error;
        toast.error(ee); 
      }
    }
  }


  React.useEffect(() => {
    if (error) {
      const ee = ((error as any)?.data as any)?.message;

      if (ee.indexOf("Not authorized, no token") > -1) {
        dispatch(logout());
        navigate('/');
      }
    }
  },[error])

  return (
    <>
      {isLoading || deleting ? <Loader/>:''}
      <PageContainer>
        <div className="flex flex-col">
          {error ? <p className='text-red-400 text-sm'>Error loading orders, check your internet or you may log out and login again</p> : ''}
          <div className="py-10 overflow-x-scroll flex justify-center">
            {
              users?.length ? (
                <table className="profile__table">
                  <thead>
                    <tr className="">
                      <th className='rounded-ss-xl'>ID</th>
                      <th className='border'>FIRSTNAME</th>
                      <th className='border'>LASTNAME</th>
                      <th className='border'>EMAIL</th>
                      <th className='border'>ADMIN</th>
                      <th className='rounded-se-xl'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      users?.map((user) => (
                        <tr key={user?._id} className="">
                          <td className=""> {user?._id} </td>
                          <td className=""> {user?.firstName} </td>
                          <td className=""> {user?.lastName} </td>
                          <td className="">
                            <a href={`mailto:${user?.email}`}>{user?.email} </a>
                          </td>
                          <td className="">
                            <div className="flex justify-center">
                              {
                                user?.isAdmin ? ( <FaCheck className="fill-green-400"/>
                                ): (<FaTimes className="fill-red-400"/>)
                              }
                            </div>
                          </td>
                          <td className='flex items-center gap-2'>
                            <Link to={`/admin/user/${user?._id}/edit`} className='custom__btn'>
                              <button>
                                <FaEdit className='fill-white'/>
                              </button>
                            </Link>
                            <button onClick={()=>deleteHandler(user?._id)} className='trash_can rounded bg-gray-200 py-2 px-4 focus:border-none active:border-none focus:outline-none active:outline-none'>
                              <FaTrash fill='#f87171' className='' />
                            </button>
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

export default UserListScreen;