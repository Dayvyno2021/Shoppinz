import PageContainer from "../components/PageContainer";
import { Link } from 'react-router-dom';

type Steps = {
  step1?: boolean,
  step2?: boolean,
  step3?: boolean,
  step4?: boolean
}

const CheckoutSteps = ({ step1, step2, step3, step4 }: Steps) => {

  return (
    <>
      <PageContainer>
        <nav className="flex justify-center gap-1 text-xs md:text-sm lg:text-base md:gap-2 lg:gap-4">
          {
            step1? (
            <button className="py-1 px-2">
              <Link to='/login' className="text-gray-800">
                Sign In
              </Link>
            </button>
            ):(
            <button className="py-1 px-2 text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400" disabled>Sign In</button>
            )
          }
          {
            step2? (
              <button className="py-1 px-2">
              <Link to='/shipping' className="text-gray-800">
                Shipping
              </Link>
            </button>
            ):(
              <button className="py-1 px-2 text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400" disabled>Shipping</button>
            )
          }
          {
            step3? (
              <button className="py-1 px-2">
              <Link to='/payment'>
                Payment
              </Link>
            </button>
            ):(
              <button className= "py-1 px-2 text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400" disabled>Payment</button>
            )
          }
          {
            step4? (
              <button className="py-1 px-2">
              <Link to='/placeorder'>
                Place Order
              </Link>
            </button>
            ):(
              <button className="py-1 px-2 text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400" disabled>Place Order</button>
            )
          }
        </nav>
      </PageContainer>
    </>
  )
}

export default CheckoutSteps