// import * as React from 'react';
import PageContainer from '@/components/PageContainer';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../redux/slices/productsApiSlice';
// import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '@/redux/slices/productsApiSlice';
import Loader from '@/components/Loader';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Pagination from '@/components/Pagination';

const ProductListScreen = () => {

  const { pageNumber } = useParams();
  const [val, setVal] = useState(pageNumber? Number(pageNumber) : 1)

  //Define rtk useGetProducts@uery
  const { data, error, isLoading, refetch } = useGetProductsQuery({ pageNumber: val });

  const handlePageClick = (e: any) => {
    setVal((e as any)?.selected + 1);
  }

  //Create a blank new product using the useCreateProductMutation
  const [createProuct, {isLoading:loadingCreate}] = useCreateProductMutation();

  // async function deleteHandler(id:string) {
  //   console.log("ID", id);
  // }

  //Launch the rtk function meant for product deletion
  const [productDeletion, { isLoading: deletingProduct }] = useDeleteProductMutation();

  const deleteHandler = async(id: string) => {
    if (window.confirm('Delete product?')) {
      try {
        const res = await productDeletion({ productId: id }).unwrap();
        refetch();
        toast.success(res.message);
      } catch (error) {
        const ee = (error as any)?.data?.message || (error as any)?.error;
        toast.error(ee); 
      }
    }
  }

  //Handle the creation of a new blank product
  const createProductHandler = async () => {
    if (window.confirm('Create new product ?')) {
      try {
        await createProuct('').unwrap();
        refetch();
      } catch (error) {
        const ee = (error as any)?.data?.message || (error as any)?.error;
        toast.error(ee);
      }
    }
  }

  return (
    <>
      {isLoading || deletingProduct? <Loader/>:''}
      <PageContainer>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg lg:text-3xl">Products</h1>
            <button onClick={createProductHandler} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 rounded gap-2 text-white flex items-center justify-center;">
              {
                loadingCreate ? (<Spinner />) : (
                  <>
                    <FaEdit className='fill-white' />
                    <span className="text-white">Create Product</span>
                  </>
                )
              }
            </button>
          </div>
          {error ? <p className='text-red-400 text-sm'> {(error as any)?.data?.message || (error as any)?.error} </p> : ''}
          <div className="py-10 overflow-x-scroll flex justify-center">
            {
              data?.products?.length ? (
                <table className="profile__table">
                  <thead>
                    <tr className="">
                      <th className='rounded-ss-xl'>ID</th>
                      <th className='border'>NAME</th>
                      <th className='border'>PRICE(&#8358;)</th>
                      <th className='border'>CATEGORY</th>
                      <th className='border'>BRAND </th>
                      <th className='rounded-se-xl'> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data?.products?.map((prod) => (
                        <tr key={prod?._id} className="">
                          <td className=""> {prod?._id} </td>
                          <td className=""> {prod?.name} </td>
                          <td className=""> {prod.price} </td>
                          <td className=""> {prod?.category} </td>
                          <td className=""> {prod?.brand} </td>

                          <td className='flex items-center gap-2'>
                            <Link to={`/admin/product-list/${prod._id}/edit`} className='custom__btn'>
                              <button>
                                <FaEdit className='fill-white'/>
                              </button>
                            </Link>
                            <button onClick={()=>deleteHandler(prod._id!)} className='trash_can rounded bg-gray-200 py-2 px-4 focus:border-none active:border-none focus:outline-none active:outline-none'>  
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
      <Pagination
        onPageChange={handlePageClick}
        pageCount={data?.pages!}
        val={val}
      />
      </PageContainer>
    </>
  )
}

export default ProductListScreen