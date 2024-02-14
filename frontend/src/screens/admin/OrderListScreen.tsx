import Loader from '@/components/Loader';
import PageContainer from '@/components/PageContainer'
import { useAppSelector } from '@/redux/hooks';
import { useGetOrdersQuery } from '@/redux/slices/orderApiSlice';
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';

const OrderListScreen = () => {
  //Reference the authslice userInfo
  const { userInfo } = useAppSelector((state) => state.authSlice);

  //Initiate rtk useGetOrdersQuery
  const { data: orders, isLoading, error } = useGetOrdersQuery('');
  

  return (
    <>
      {isLoading? <Loader/>:''}
      <PageContainer>
        <div className="flex flex-col">
          {error ? <p className='text-red-400 text-sm'>Error loading orders, check your internet or you may log out and login again</p> : ''}
          <div className="py-10 overflow-x-scroll flex justify-center">
            {
              orders?.length ? (
                <table className="profile__table">
                  <thead>
                    <tr className="">
                      <th className='rounded-ss-xl'>ID</th>
                      <th className='border'>USER</th>
                      <th className='border'>DATE</th>
                      <th className='border'>TOTAL(&#8358;)</th>
                      <th className='border'>PAID</th>
                      <th className='border'>DELIVERED</th>
                      <th className='rounded-se-xl'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orders?.map((order) => (
                        <tr key={order?._id} className="">
                          <td className=""> {order?._id} </td>
                          <td className=""> {userInfo?.firstName} </td>
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

export default OrderListScreen