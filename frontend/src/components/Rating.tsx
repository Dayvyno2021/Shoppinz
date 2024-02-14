import * as React from 'react';
import {FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa'

const Rating = ({value, text}:{value:number, text?:string}) => {
  return (
    <>
      <div className='star_rating flex items-center justify-center'>
        <span className="">
          {
            value >=1? (<FaStar className='fill-yellow-500' />) : value >= 0.5? (<FaStarHalfAlt className='fill-yellow-500' />) : (<FaRegStar className='fill-yellow-500' />)
          }
        </span>
        <span className="">
          {
            value >=2? (<FaStar className='fill-yellow-500' />) : value >= 1.5? (<FaStarHalfAlt className='fill-yellow-500' />) : (<FaRegStar className='fill-yellow-500' />)
          }
        </span>
        <span className="">
          {
            value >=3? (<FaStar className='fill-yellow-500' />) : value >= 2.5? (<FaStarHalfAlt className='fill-yellow-500' />) : (<FaRegStar className='fill-yellow-500' />)
          }
        </span>
        <span className="">
          {
            value >=4? (<FaStar className='fill-yellow-500' />) : value >= 3.5? (<FaStarHalfAlt className='fill-yellow-500' />) : (<FaRegStar className='fill-yellow-500' />)
          }
        </span>
        <span className="mr-3">
          {
            value >=5? (<FaStar className='fill-yellow-500' />) : value >= 4.5? (<FaStarHalfAlt className='fill-yellow-500' />) : (<FaRegStar className='fill-yellow-500' />)
          }
        </span>
        <span className="text-xs md:text-base"> {text && text} </span>
      </div>
    </>
  )
}

export default React.memo(Rating);