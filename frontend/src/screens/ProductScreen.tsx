import * as React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AiOutlineRollback } from 'react-icons/ai';
import Rating from '../components/Rating';
import { useCreateReviewMutation, useGetProductByIdQuery } from '../redux/slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import ReviewComponent from '@/components/ReviewComponent';
import { ProductType } from '@/redux/types/productTypes';

const ratingValues = [
  { id: "", name: 'Rate Product' },
  { id: "1", name: '1 - Poor' },
  { id: "2", name: '2 - Fair' },
  { id: "3", name: '3 - Good' },
  { id: "4", name: '4 - Very Good' },
  { id: "5", name: '5 - Excellent' },
]

const ProductScreen = () => {
  const { id: productId } = useParams();

  //Initialize useAppDispatch
  const dispatch = useAppDispatch();

  //Initialize useNavigate
  const navigate = useNavigate();

  //Manage product qty
  const [qty, setQty] = React.useState<number>(1);

  //Initialize the get product query
  const { currentData: product, error, isLoading, refetch } = useGetProductByIdQuery({ id: productId! });

  const [data, setData] = React.useState<Partial<ProductType>>({})

  React.useEffect(() => {
    // console.log(product);
    if (product?._id && !data?._id) {
      setData(product);
    }
    // if (data) {
    //   console.log(data);
    //   console.log()
    // }
  },[product, data])

  const addToCartHandler = (value:number) => {
    dispatch(addToCart({ ...product, qty: value }));
    navigate('/cart');
  }
  //Lets add the create review functionality here
  const [rating, setRating] = React.useState(ratingValues[0]);
  const [comment, setComment] = React.useState('');
  // console.log(rating)

  //Initiliaze the create review mutation
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  
  const { userInfo } = useAppSelector((state) => state.authSlice);

  async function submitHandler(e:React.FormEvent) {
    e.preventDefault();

    try {
      if (!comment || !Number(rating.id)) {
        toast.error('Invalid input values');
        return;
      }
      const res = await createReview({ productId: productId!, rating: Number(rating.id), comment }).unwrap();
      if (res) {
        await refetch();
        toast.success('Review Submitted');
        setRating(ratingValues[0]);
        setComment('')
      }
    } catch (error) {
      const ee = (error as any)?.data?.message || (error as any)?.error;
      toast(ee);
    }
  }
  
  return (
    <>
      {error && <Message error='Could not fetch resource' />}
      {isLoading || loadingProductReview?  <Loader /> : ''}
      <div className="max-w-[1536px] px-3 py-5 mb-10 mx-auto">
        <div className="flex flex-col gap-3 lg:gap-10">
          <Link to='/' className='mb-3 self-start p-2 bg-neutral-200 rounded hover:bg-neutral-300 transition-all'>
            <AiOutlineRollback fill='#d97706' />
          </Link>

          <div className="flex flex-col items-center gap-5 lg:gap-10 lg:flex-row lg:items-start">
            <div className="flex flex-col gap-5 items-center w-[90%] md:w-[70%] lg:w-[40%]">
              <img src={product?.image} alt={product?.name} className=' rounded w-full' />
              <div className="w-full lg:hidden">
                {
                  product?._id ? (
                    <ReviewComponent
                      product={data}
                      userInfo={userInfo}
                      submitHandler={submitHandler}
                      rating={rating} 
                      onChangeHandler={setRating}
                      ratingValues={ratingValues}
                      comment={comment}
                      onCommentChange={(e)=>setComment(e.target.value)}
                      loadingProductReview={loadingProductReview}
                    />
                      ):('')
                }
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full py-5 lg:pt-0">
              <div className="w-full h-[1px] bg-amber-600 mb-5 lg:bg-gray-200"></div>

              <p className="text-center font-bold text-[#646cff]"> {product?.name} </p>

              <Rating value={product?.rating!} text={`${product?.numReviews} reviews`} />
              
              <p className="px-3"> {product?.description} </p>
              
              <div className="w-full h-[1px] bg-amber-600 mt-5 lg:bg-gray-200"></div>

              <div className="lg:flex lg:flex-col hidden">
                
                                
                {
                  product?._id? (
                    <ReviewComponent
                      product={data}
                      userInfo={userInfo}
                      submitHandler={submitHandler}
                      rating={rating} 
                      onChangeHandler={setRating}
                      ratingValues={ratingValues}
                      comment={comment}
                      onCommentChange={(e)=>setComment(e.target.value)}
                      loadingProductReview={loadingProductReview}
                    />
                  ):('')
                }

              </div>
            </div>

            <div className="border border-gray-200 w-[80%] rounded shadow">
              <p className="p-3 flex justify-between">
                <span className="font-semibold">Price</span>
                <span className="font-bold"> &#8358; {product?.price?.toLocaleString()} </span>
              </p>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <p className="p-3 flex justify-between">
                <span className="font-semibold">Status</span>
                <span className="font-bold"> {product?.countInStock ? 'In Stock' :  'Out of Stock'} </span>
              </p>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="flex justify-center items-center py-2">
                <div className="flex gap-5 bg-gray-200 p-3 rounded">
                  {
                    product?.countInStock ? 
                      (
                      <>
                        <p className="font-semibold">Qty</p>
                        <select name="qty" id="qty" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className='rounded focus:border-none active:border-none focus:outline-none active:outline-none'>
                          {
                            [...Array(product?.countInStock).keys()].map((x, i) => (
                              <option key={`QTY${i}`} value={x+1} > {x+1} </option>
                            ))
                          }
                        </select>
                      </>
                      )
                      :
                      (<p className=''> <i>Out of Stock</i> </p>)
                        
                  }
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="flex justify-center items-center py-5">
                <button onClick={()=>addToCartHandler(qty)} className='custom__btn' disabled={product?.countInStock === 0} >
                  Add To Cart
                </button>
              </div>


            </div>


          </div>
        </div>
      </div>
    </>
  )
}

export default ProductScreen;