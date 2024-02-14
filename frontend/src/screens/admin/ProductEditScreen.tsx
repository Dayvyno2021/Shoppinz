import Loader from '@/components/Loader';
import PageContainer from '@/components/PageContainer';
import { useGetProductByIdQuery, useUpdateProductMutation, useUploadProductImageMutation } from '@/redux/slices/productsApiSlice';
import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineRollback } from 'react-icons/ai';
import Spinner from '@/components/Spinner';
import { ProductType } from '@/redux/types/productTypes';
import { toast } from 'react-toastify';

const ProductEditScreen = () => {

  const { id: productId } = useParams();
  const navigate = useNavigate();

  //use the rtk UseGetProductByIdQuery to get a product
  const {data:product, isLoading, error, refetch} = useGetProductByIdQuery({id:productId!})

  const [inputs, setInputs] = React.useState<Partial<ProductType>>({
    name: product?.name || '',
    price: product?.price || 0,
    image: product?.image || '',
    brand: product?.brand || '',
    category: product?.category || '',
    countInStock: product?.countInStock || 0,
    description: product?.description || '',
  })

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  const [editProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

  const [uploadImage, {isLoading:loadingUpload}] = useUploadProductImageMutation()

  const handleProductUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // console.log(inputs)
      const res = await editProduct({ data: {...inputs}, productId:productId! }).unwrap();
      if (res) {
        toast.success('Product updated successfully');
        navigate(`/admin/products`);
      }
    } catch (error) {
      const ee = (error as any)?.data?.message || (error as any)?.error;
      toast.error(ee);
    }
  }

  //Handle file upload
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files![0]
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await uploadImage({data:formData, id:productId }).unwrap();
      toast.success(res.message);
      setInputs((values) => ({ ...values, ['image']: res.image }));
    } catch (error) {
      const ee = (error as any)?.data?.message || (error as any)?.error;
      toast.error(ee);
    }
  }
  
  // console.log(product);
  React.useEffect(() => {
    refetch();
    if (product) {
      setInputs({ ...product })
    }
  }, [product]);

  return (
    <>
      {isLoading ? <Loader/> : ''}
      <PageContainer>
        <div className="flex flex-col">
          <Link to='/admin/products' className='mb-3 self-start'>
            <AiOutlineRollback fill='#d97706' />
          </Link>
          {
            error ? (
              <p className="text-red-400 mx-auto text-sm lg:text-base">
                Error loading product. Check your internet connection
              </p>         
            ):('')
          }

          <div id='register' className="custom__form">
            <h1 className="font-bold text-lg text-center">Update Product Details</h1>
            <form className="flex flex-col gap-5" onSubmit={handleProductUpdate}>
              {/* {err? <div className="text-red-400"> {err} </div>:''} */}
              <div className="form__control">
                <label htmlFor="fn" className=''>Name </label> 
                <input type="text"
                  id='fn'
                  placeholder='Name'
                  name='name'
                  autoComplete='false' className='inp__el' value={inputs.name}
                  onChange={handleInputs}
                />
              </div>
              <div className="form__control">
                <label htmlFor="ln" className=''>Price</label>
                <input type="number" id='ln'
                  placeholder='Price'
                  name='price'
                  className='inp__el'
                  value={inputs.price} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>

              <div className="form__control">
                <label htmlFor="image" className=''>Image URL</label>
                <input type="tel" id='image_url'
                  placeholder='Enter Image Url'
                  name='image'
                  className='inp__el'
                  value={inputs.image} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>
              <div className="form__control">
                <label htmlFor="image" className=''>Image</label>
                {
                  loadingUpload ? <Spinner /> : (
                    <input type="file" className='inp__el' name="img" id="image" onChange={uploadFileHandler}  />
                  )
                }
              </div>
              
                      
              <div className="form__control">
                <label htmlFor="brand" className=''>Brand</label>
                <input type="tel" id='brand'
                  placeholder='Brand'
                  name='brand'
                  className='inp__el'
                  value={inputs.brand} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>
              <div className="form__control">
                <label htmlFor="countInStock" className=''>Count In Stock</label>
                <input type="number" id='countInStock'
                  placeholder='Count In Stock'
                  name='countInStock'
                  className='inp__el'
                  value={inputs.countInStock} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>
              <div className="form__control">
                <label htmlFor="description" className=''>
                  Description
                </label>
                <input type="text" id='description'
                  placeholder='description'
                  name='description'
                  className='inp__el'
                  value={inputs.description} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>
              <div className="form__control">
                <label htmlFor="category" className=''>Category</label>
                <input type="text" id='category'
                  placeholder='Category'
                  name='category'
                  className='inp__el'
                  value={inputs.category} autoComplete='false'
                  onChange={handleInputs}
                />
              </div>

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

export default ProductEditScreen