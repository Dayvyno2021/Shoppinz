import { useState, memo } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BsCart4 } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { Popover } from '@headlessui/react';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const navigation = [
  { name: 'Product', href: '/' },
  { name: 'Features', href: '/' },
  { name: 'Marketplace', href: '/' },
  { name: 'Company', href: '/' },
]

function Header() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //Manage the closing and opening of the mobile modal
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  //Intstantiate and get the cartItems state from the store
  const { cartItems } = useAppSelector((state) => state.cartSlice);
  
  //Calculate the carTItem quanitity
  const cartQty = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

  //Intstantiate and get the userInfo state from the store
  const { userInfo } = useAppSelector(state => state.authSlice);

  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  const handleLogout = async() => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  }

  return (
    <div className="bg-white">
      {isLoading && <Loader/>}
      <header className="inset-x-0 top-0 z-50 shadow">
        <nav className="flex justify-between h-[5rem] items-center bg-gradient-to-r from-green-400 to-green-500 w-full p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-6 lg:h-8 object-cover"
                src="/images/logo.png"
                alt=""
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <div className="custom__cart relative">
              <Link to='/cart' className='text-black' >
                <BsCart4 />
                {
                  cartItems?.length ? 
                    (
                    <span className="custom__cart__qty absolute -top-3 -right-3 p-1 font-semibold lg:text-sm text-red-600 border border-current w-5 h-5 flex place-items-center place-content-center rounded-full">
                      {cartQty}
                    </span>
                    
                    ):('')
                }
              </Link>
            </div>
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm md:text-base font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {
              userInfo?._id ?
                (
                  <div className="flex gap-3">
                    <Popover className="remove__border relative bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent">
                      {
                      ({ open}) => (
                        <>
                        <Popover.Button className='flex items-center gap-1 bg-transparent hover:bg-green-400/90 active:transparent focus:bg-green-400/90 text-gray-900' >
                          Profile
                          <MdOutlineArrowForwardIos className={open? 'rotate-90 text-sm transition-all': 'text-sm transition-all'}/>  
                        </Popover.Button>

                        <Popover.Panel className="absolute z-10">
                          <div className="grid grid-cols-2">
                            <Link to="/profile" className='text-gray-800'> {userInfo?.firstName} </Link>
                          </div>
                        </Popover.Panel>
                        </>
                     )}
                    </Popover>  
                    
                <button onClick={handleLogout} className="text-sm font-semibold leading-6 text-gray-900 bg-transparent p-2 hover:bg-green-400/90">
                  Log out <span aria-hidden="true"></span>
                </button>
              </div>
              ):
                (
                  <>
                <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 bg-transparent p-2 hover:bg-green-400/90 rounded-lg transition-all">
                  Log in <span aria-hidden="true"></span>
                </Link>
                <Link to="/register" className="ml-3 text-sm font-semibold leading-6 text-gray-900 bg-transparent p-2 hover:bg-green-400/90 rounded-lg transition-all">
                  Register <span aria-hidden="true">&rarr;</span>
                </Link>
                  </>
              )
            }
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="/images/logo.png"
                  alt="logo"
                />
              </Link>
              <button
                type="button"
                className="remove__border -m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="custom__cart relative">
                  <Link to='/cart' className='text-black' onClick={()=>setMobileMenuOpen(false)}>
                    <BsCart4  />
                    {
                      cartItems?.length ? 
                    (
                      <span className="custom__cart__qty absolute -top-3 -left-3 p-1 text-xs text-red-400 border border-current w-5 h-5 flex place-items-center place-content-center rounded-full">
                        {cartQty}
                      </span>
                    ):('')
                    }    

                  </Link>
                </div>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {
                    userInfo?._id ?
                    (
                  <button
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                    
                    )
                      :
                    (
                    <>
                          
                    <Link
                      to="/register"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>    
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>    
                      </>
                    )
                  }
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      {/* <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div> */}
    </div>
  )
}

export default memo(Header);