import { useState, memo, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BsCart4 } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { Menu } from '@headlessui/react';
import SearchBox from './SearchBox';

// const navigation = [
//   // { name: 'Map', href: '/map' },
//   { name: 'Features', href: '/' },
//   { name: 'Marketplace', href: '/' },
//   { name: 'Company', href: '/' },
// ]

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

  useEffect(() => {
    const currentTime = new Date().getTime() * 60 * 60 * 24 * 1000;
    const expirationTIme = localStorage.getItem("expirationTime")? JSON.parse(localStorage.getItem("expirationTime") || '') : 0

    if (currentTime - expirationTIme) {
      dispatch(logout());
      navigate('/');
      setMobileMenuOpen(false);
    }
  },[dispatch, navigate])

  return (
    <div className="">
      {isLoading && <Loader/>}
      <header className="inset-x-0 top-0 z-50 shadow">
        <nav className="flex justify-between h-[5rem] items-center bg-gradient-to-r from-green-400 to-green-500 w-full p-6 lg:px-[100px] " aria-label="Global">
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
          <div className="hidden sm:block">
            <SearchBox />
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
          <div className="hidden lg:flex lg:gap-x-12 pl-10">
            <Link to='/cart' className="custom__cart relative remove__border head__btn flex items-center">
              {/* <Link to='/cart' className='text-black' > */}
                <BsCart4 />
                {
                  cartItems?.length ? 
                    (
                    <span className="custom__cart__qty absolute -top-[1px] -right-1 font-semibold lg:text-sm text-red-600 border border-current w-5 h-5 flex place-items-center place-content-center rounded-full">
                      {cartQty}
                    </span>
                    ):('')
                }
              {/* </Link> */}
            </Link>
            {/* <div className=" hidden sm:block">
              <SearchBox />
            </div> */}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {
              userInfo?._id ?
                (
              <div className="flex gap-3 items-center">
                <Menu >
                  {
                    ({ open }) => (
                      <div className="">
                        <Menu.Button className={`remove__border flex items-center gap-1 head__btn hover:bg-green-400/90 `} >
                          {/* <span className={`text-sm md:text-base font-medium leading-6 text-white`}> Profile </span> */}
                          {userInfo?.firstName}
                          <MdOutlineArrowForwardIos className={`text-sm fill-gray-800 transition-all ${open? 'rotate-90': 'text-sm'}`}/>
                        </Menu.Button>
                        <Menu.Items className='absolute z-10  rounded w-[120px] pl-2 pr-5 py-2 bg-green-400 transition-all flex flex-col gap-2 text-pry '>
                          <Menu.Item >
                            <Link to={`/profile`} className="w-[100%] gap-3 rounded-[4px] bg-green-400 hover:bg-green-300 flex px-1 py-1">
                              Profile
                            </Link>
                          </Menu.Item>
                          {
                            userInfo?.isAdmin && (
                              <>
                                <Menu.Item >
                                  <Link to={`/admin/products`} className="w-[100%] gap-3 rounded-[4px] bg-green-400 hover:bg-green-300 flex px-1 py-1">
                                    Products
                                  </Link>
                                </Menu.Item>
                                <Menu.Item >
                                  <Link to={`/admin/users-list`} className="w-[100%] gap-3 rounded-[4px] bg-green-400 hover:bg-green-300 flex px-1 py-1">
                                    Users
                                  </Link>
                                </Menu.Item>
                                <Menu.Item >
                                  <Link to={`/admin/orders-list`} className="w-[100%] gap-3 rounded-[4px] bg-green-400 hover:bg-green-300 flex px-1 py-1">
                                    Orders
                                  </Link>
                                </Menu.Item>
                              </>
                            )
                          }
                        </Menu.Items>
                      </div>
                    )
                  }
                </Menu>
                    
                <button onClick={handleLogout} className="remove__border head__btn">
                  Log out <span aria-hidden="true"></span>
                </button>
              </div>
              ):
                (
                  <>
                <Link to="/login" className="remove__border head__btn">
                  Log in <span aria-hidden="true"></span>
                </Link>
                <Link to="/register" className="ml-3 remove__border head__btn">
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
                <div className="space-y-2 py-6 ">
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
                
                  {/* {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))} */}
                </div>
                <div className="py-6">
                  {
                    userInfo?._id ?
                      (
                        <div>

                          <Menu >
                            {
                              ({ open }) => (
                                <div className="">
                                  <Menu.Button className={` flex items-center gap-1 py-2 `} >
                                    {/* <span className={`text-sm md:text-base font-medium leading-6 text-white`}> Profile </span> */}
                                    {userInfo?.firstName}
                                    <MdOutlineArrowForwardIos className={`text-sm fill-gray-800 transition-all ${open? 'rotate-90': 'text-sm'}`}/>
                                  </Menu.Button>
                                  <Menu.Items className='bg-neutral-200 z-10  rounded w-[120px] pl-2 pr-5 py-2 transition-all flex flex-col gap-2 text-pry '>
                                    <Menu.Item >
                                      <Link to={`/profile`} onClick={() => setMobileMenuOpen(false)} className="w-[100%] gap-3 rounded-[4px] flex px-1 py-1">
                                        Profile
                                      </Link>
                                    </Menu.Item>
                                    {
                                      userInfo?.isAdmin && (
                                        <div className=''>
                                          <Menu.Item >
                                            <Link to={`/admin/products`} onClick={() => setMobileMenuOpen(false)} className="w-[100%] gap-3 rounded-[4px] flex px-1 py-1">
                                              Products
                                            </Link>
                                          </Menu.Item>
                                          <Menu.Item >
                                            <Link to={`/admin/users-list`} onClick={() => setMobileMenuOpen(false)} className="w-[100%] gap-3 rounded-[4px] flex px-1 py-1">
                                              Users
                                            </Link>
                                          </Menu.Item>
                                          <Menu.Item >
                                            <Link to={`/admin/orders-list`} onClick={() => setMobileMenuOpen(false)} className="w-[100%] gap-3 rounded-[4px] flex px-1 py-1">
                                              Orders
                                            </Link>
                                          </Menu.Item>
                                        </div>
                                      )
                                    }
                                  </Menu.Items>
                                </div>
                              )
                            }
                          </Menu>

                          <button
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={handleLogout}
                          >
                            Log out
                          </button>
                        </div>
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
    </div>
  )
}

export default memo(Header);