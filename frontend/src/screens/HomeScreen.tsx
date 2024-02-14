import Product from '../components/Product';
import { useGetProductsQuery, useGetTopProductsQuery} from '../redux/slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Pagination from '@/components/Pagination';
import SearchBox from '@/components/SearchBox';
import { AiOutlineRollback } from 'react-icons/ai';
import Carousel from '@/components/ProductCarousel';
import Meta from '@/components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [val, setVal] = useState(pageNumber? Number(pageNumber) : 1)
  const { currentData: data, error, isLoading } = useGetProductsQuery({ pageNumber: val, keyword });

  const handlePageClick = (e: any) => {
    setVal((e as any)?.selected + 1);
  }


  const { currentData: slides, isLoading: loadingCarousel, error: carouselError } = useGetTopProductsQuery('');
  
  const [autoplayInterval, setAutoplayInterval] = useState(3010);

  useEffect(() => {
    if (slides?.length) {
      setAutoplayInterval(3020);
    }
  }, [slides])

  return (
    <>
      {error || carouselError? <Message error='Could not fetch resource'/> : ""}
      {isLoading || loadingCarousel ? <Loader /> : ''}
      <div className="flex flex-col">
        <Meta />
        <div className="flex justify-center p-4 bg-neutral-300 w-full sm:hidden">
          <SearchBox />
        </div>
          {
            keyword ? (
            <Link to='/' className='ml-10 mt-5 self-start p-2 bg-neutral-200 rounded hover:bg-neutral-300 transition-all'>
              <AiOutlineRollback fill='#d97706' />
            </Link>
            ):('')
        }
        <div className="">
          {
            keyword ? ('') : (
              <Carousel slides={slides!} autoplayInterval={autoplayInterval} />
            )
          }
        </div>
        <h1 className="text-center font-bold text-xl mt-5 mb-3 md:text-2xl lg:text-4xl lg:mt-7 lg:mb-5">Latest Products</h1>

        <div className="home__screen flex flex-wrap gap-1 md:gap-3 lg:gap-5 justify-center max-w-[1280px] mx-auto">
          {
            data?.products?.map((product) => (
              <div className="home__screen-product w-[45%] md:w-[40%] lg:w-[30%] bg-stone-50" key={product?._id}>
                <Product product={product}/>
              </div>
            ))
          }
        </div>
        
        <Pagination
          onPageChange={handlePageClick}
          pageCount={data?.pages!}
          val={val}
        />
      </div>
    </>
  )
}


export default HomeScreen;