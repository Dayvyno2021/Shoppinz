import { ProductType } from '@/redux/types/productTypes';
import React, { useState, useEffect } from 'react';
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
// import { ProductType } from '@/types';
import { Link } from 'react-router-dom';

interface CarouselProps {
  // slides: React.ReactNode[];
  slides: ProductType[];
  autoplayInterval?: number
}

const Carousel: React.FC<CarouselProps> = ({slides, autoplayInterval=3000}) => {

  const [currentSlide, setCurrentSlide] = useState(0);

  // const autoplayInterval = 3000

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides!?.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides!?.length) % slides!?.length);
  };

  useEffect(() => {
    const autoplayTimer = setInterval(goToNextSlide, autoplayInterval);

    return () => {
      clearInterval(autoplayTimer);
    };

  }, [autoplayInterval]);

  return (
    <div className="pb-10 lg:pb-[100px] pt-5 lg:pt-[20px] w-full bg-green-200 ">
      <h2 className="text-center font-bold text-xl mt-5 mb-3 md:text-2xl lg:text-4xl lg:mt-7 lg:mb-5">Top products</h2>
      <div className="carousel w-[90%] md:w-[80%] ">
        <button onClick={goToPrevSlide} className='remove__border'>
          <FaArrowCircleLeft className="fill-green-500 text-4xl" />
        </button>
        <div className="slide-container">
          {slides?.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <Link to={`/product/${slide?._id}`}>
                <img src={slide?.image} alt={slide?.name} className='mx-auto w-[200px] sm:w-[400px] lg:w-auto ' />
                <p className="p-3 mx-auto flex items-center text-green-100 justify-center bg-black/50 w-[200px] sm:w-[400px] lg:w-[70%] ">
                  {slide?.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
        <button onClick={goToNextSlide} className='remove__border'>
          <FaArrowCircleRight className="fill-green-500 text-4xl" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
