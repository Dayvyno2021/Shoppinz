import * as React from 'react';
import {Link} from 'react-router-dom'

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className='h-[5rem] w-full bg-gradient-to-r from-green-500 to-green-400 flex justify-center items-center'>
        <p className=" flex gap-5">
          <Link to='/'>
            <img src="/images/logo.png" alt="Shoppinz" />
          </Link>
          <span>&copy; {currentYear}</span>
        </p>
      </footer>
    </>
  )
}

export default React.memo(Footer)