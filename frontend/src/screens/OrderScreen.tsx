import * as React from 'react';
import { useChangePayMethodMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPaymentKeyQuery, useDeliverOrderMutation } from '@/redux/slices/orderApiSlice';
import { useParams } from 'react-router-dom';
import Loader from '@/components/Loader';
import { FaRegTimesCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
// import { PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useAppSelector } from '../redux/hooks';
// import { useAppSelector } from '@/redux/hooks';
import {PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Spinner from '@/components/Spinner';
import { Dialog, Transition } from '@headlessui/react';
import { PaystackButton } from 'react-paystack';
import { Switch } from '@headlessui/react';
// import PageContainer from '@/components/PageContainer';
import PageContainer from '../components/PageContainer';


const OrderScreen = () => {

  //Catch errors
  const [err, setErr] = React.useState('');

  
  //Hide paypal button when modal is visible
  const [hidePayPal, setHidePayPal] = React.useState(false);
  
  //Instantiate the usePaypalScriptReducer from the paypal package
  const [{ isPending, options }, payPalDispatch] = usePayPalScriptReducer();

  //Bring in the userInfo from redux slice
  const { userInfo } = useAppSelector(state => state.authSlice);

  //Instantiate useParams;
  const params = useParams();

  //Instantiate the rtk useGetOrderDetailsQuery
  const { data: order, error, refetch, isLoading } = useGetOrderDetailsQuery({ id: params?.id! });
  
  // console.log("ORDER: ", order);
  //Instantiate the rtk usePayPalCientQuery
  const [skip, setSkip] = React.useState(true);
  const { data: makePayment, isLoading:loadingPayKey, isError } = useGetPaymentKeyQuery({payMethod: (order?.paymentMethod as string)?.toLowerCase()}, {skip});

  //Instantiate the rtk usePayOrderMutation
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  //Popup modal for choosing payment option
  const [modal, setModal] = React.useState(false);

  //Initial options for paypal payment
  const initialOptions = {
    clientId: makePayment?.clientId!,
    currency: "USD",
    intent: "capture",
  };

  // const onApproveTest = async() => {
  //   await payOrder({ id: order?._id!, payMethod: order?.paymentMethod, details:{payer:{}} });
  //   refetch();
  //   toast.success('Payment successful');
  // }

  function onApprove(_data: any, actions: any) {
    return actions.order.capture()
      .then(async (details: any) => {
        try {
          console.log("SUCCESSFULLLY PAID")
          await payOrder({ id: order?._id, details });
          refetch();
          toast.success('Payment successful');
        } catch (error) {
          console.log("ERROR APPROVE: ", error);
          toast.error((error as any)?.data?.Message || (error as any)?.message);
        }
      })
  }

  function onError(err: any) {
    toast.error(err?.Message);
  }

  function createOrder(_data: any, actions: any) {
    const amount = (order?.totalPrice!/1000).toPrecision(2)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount
          }
        }
      ]
    })
  }
  

  //Define a payment variable and function
  const [payment, setPayment] = React.useState('');

  const handlePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayment(e.target.value);
  }

  //Change payment method
  const [newPayMethod, { isLoading:loadingPayMethod }] = useChangePayMethodMutation();

  const changePaymentMethod = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    // console.log("PAYMENT: ", payment);
    try {
      const res = await newPayMethod({ payMethod: payment, orderId: params.id! }).unwrap();
      if (res) {
        refetch();
      }
    } catch (error) {
      setErr('Error changing payment method')
    } finally {
      setModal(false);
      setHidePayPal(false);
    }
  }
  //Amount
  const amount = Number((order?.totalPrice!)?.toFixed(0));
  const payStackAmount = amount * 100;

  //PayStack payment
  const componentProps = {
    email: userInfo?.email!,
    amount: payStackAmount,
    name: `${userInfo?.firstName!} ${userInfo?.lastName!}`,
    publicKey: makePayment?.clientId!,
    text: 'Make Payment',
    onSuccess: () => {
      const pay = async () => {
        const res = await payOrder({ id: order?._id!, payMethod: order?.paymentMethod, details: {} });
        if (res) {
          refetch();
          toast.success('Payment successful');
        }
      }
      pay();
    },
    onClose: () => {
      toast.error('Could not complete payment')
    }
  }

  //Implement Fincra payment
  const fincraPayment = () => {
    (window as any)?.Fincra.initialize({
      key: makePayment?.clientId!,
      amount: amount,
      currency: "NGN",
      customer: {
          name: `${userInfo?.lastName} ${userInfo?.firstName}`,
          email: userInfo?.email,
          phoneNumber: '07069230276',
        },
      //Kindly chose the bearer of the fees
      feeBearer: "business",
      onClose: function () {
        alert("Transaction was not completed, window closed.");
      },
      onSuccess: function (data:any) {
        const reference = data?.reference;
        const pay = async () => {
          const res = await payOrder({ id: order?._id!, payMethod: order?.paymentMethod, details: { id: reference } });
          if (res) {
            refetch();
            toast.success('Payment successful');
          }
        }
        pay();
      },
    });
  }

  //Instantiate the rtk useDeliverOrderMutation
  const [updateOrderToDelivered, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  
  async function handleOrdeliveryStatus() {
    if (!order?.isDelivered) {
      try {
        const res = await updateOrderToDelivered({ id: order?._id });
        if (res) {
          refetch();
          toast.success('Successful');
        }
      } catch (err) {
        const ee = ((err as any)?.data).message || (err as any)?.error
        setErr(ee);
      }
    }
  }
   
  React.useEffect(() => {
    //Get payment key only when order is fully loaded
    if (order?.paymentMethod) {
      setSkip(false);
    }

    //For Fincra and PayPal
    if (!loadingPayKey && !isError && makePayment?.clientId && !order?.isPaid) {
      
      //Manage PayPal Payment
      if (order?.paymentMethod?.toLowerCase() === 'paypal') {
        payPalDispatch({
          type: "resetOptions",
          value: { ...options, ...initialOptions },
        });
      }
  
      //Manage Fincra Payment
      const fincraPay = () => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@fincra-engineering/checkout@2.2.0/dist/inline.min.js";
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script)  
      }
      
      if (order?.paymentMethod?.toLowerCase() === 'fincra') {
        fincraPay()
      }

    }

  }, [order, isError, makePayment, payPalDispatch, loadingPayKey]);

  return (
    <>
      {isLoading || loadingPayKey || loadingPay? <Loader /> : ''}
      <PageContainer>

        <div className="w-full flex gap-10 flex-col lg:flex-row items-center lg:items-start">
          <div className="w-[340px] md:w-[600px] lg:w-[60%] flex flex-col order-2 lg:order-1 gap-5 ">
            {error? <p className="text-sm lg:text-base text-red-400"> Could not find order. You may need to logout and re-login </p> : ''}
            {err? <p className="text-sm lg:text-base text-red-400"> {err} </p> : ''}
            {/* {
              order?.paymentMethod === 'Paypal' && isError? <p className="text-sm lg:text-base text-red-400"> Error Loading paypal </p> : ''
            } */}
            <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-lg lg:text-3xl mb-2">Shipping</h1>
              <p className="text-sm lg:text-base font-medium">
                <strong className='font-medium'>Name: </strong> {order?.user?.name}
              </p>
              <p className="text-sm lg:text-base font-medium">
                <strong className='font-medium'>Email: </strong> {order?.user?.email}
              </p>
              <p className="text-sm lg:text-base font-medium">
                <strong className='font-medium'>Address: </strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city }, {order?.shippingAddress?.postalCode}, {order?.shippingAddress?.country}.
              </p>
              <p className={`${order?.isDelivered? "border border-green-600 bg-green-100":"border border-red-400 bg-red-100"} p-2 rounded min-w-[330px] max-w-max` } >
                {
                  order?.isDelivered ?
                    (
                      <span className="flex gap-2 items-center">
                        <FaRegCheckCircle className='fill-green-600' />
                        <span className="">Delivered on: {order?.deliveredAt}</span>
                      </span>
                    ) :
                    (
                    <span className="flex gap-2 items-center">
                      <FaRegTimesCircle className="fill-red-400 inline-block" />
                      <span className="">Not Delivered</span>
                    </span>
                    )
                }
              </p>
            </div>
            <div className="flex gap-1 flex-col">
            <h1 className="font-bold text-lg lg:text-3xl mb-1">Payment Method</h1>
              <p className="text-sm lg:text-base font-medium">
                <strong className='font-medium'>Method: </strong> {order?.paymentMethod}
              </p>

              <p className={`${order?.isPaid? "border border-green-600 bg-green-100":"border border-red-400 bg-red-100"} p-2 rounded min-w-[330px] max-w-max` } >
                {
                  order?.isPaid ?
                    (
                      <span className="flex gap-2 items-center">
                        <FaRegCheckCircle className='fill-green-600 inline-block' />
                        <span className="">Paid on: {order?.paidAt}</span>
                      </span>
                    ) :
                    <span className="flex gap-2 items-center">
                      <FaRegTimesCircle className="fill-red-400 inline-block" />
                      <span className="">Not Paid</span>
                    </span>
                }
              </p>
            </div>

          
            <div className="flex flex-col gap-3">
              <h1 className="font-bold text-lg lg:text-3xl mb-2">Order Items</h1>
              {
                order?.orderItems!.map((item: any) => (
                  <div key={item?.product} className="flex gap-10 items-center border px-2 py-3 rounded">
                    <div className="flex gap-5 w-[70%] items-center ">
                      <img src={item?.image} className='w-10 h-10 inline-block rounded-md' alt={item?.name} />
                      <p className="text-sm lg:text-base "> {item?.name} </p>
                    </div>
                    <p className=" w-[30%] "> {item?.qty} x {item?.price} = <span className="font-medium"> &#8358;{(item?.qty * item?.price!).toLocaleString()}</span> </p>
                  </div>
                ))
              }
            </div> 
          </div>
          <div className="w-[340px] md:w-[600px] lg:w-[40%] order-1 lg:order-2">
            <div className="border border-gray-300 rounded-md flex flex-col">
              <h1 className="font-bold text-lg lg:text-3xl p-2">Order Summary</h1>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-medium "> Items: </p>
                <p className="text-sm lg:text-base">&#8358;{Number(order?.itemsPrice)?.toLocaleString()} </p>
              </div>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-medium "> Shipping: </p>
                <p className="text-sm lg:text-base"> &#8358;{order?.shippingPrice} </p>
              </div>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-medium "> Tax: </p>
                <p className="text-sm lg:text-base"> &#8358;{Number(order?.taxPrice).toLocaleString()} </p>
              </div>
              <hr/>
              <div className="flex p-2">
                <p className="text-sm lg:text-base w-[50%] font-semibold "> Total: </p>
                <p className="text-sm lg:text-base font-semibold"> &#8358;{Number(order?.totalPrice).toLocaleString()} </p>
              </div>
              <hr />
              {/* {
                error? 
              <div className="flex p-2 justify-center">
                <p className="text-sm lg:text-base text-red-400"> Could not create order </p>
              </div> : ''
              } */}
              <div className="flex p-2 justify-center">
                {
                  !order?.isPaid && (
                    <div className="text-sm lg:text-base">
                      <div className="">
                          {/* <button onClick={onApproveTest}  className=" mb-10 remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">
                            Test Pay Order
                          </button> */}
                        {order?.paymentMethod === 'Paypal' && !hidePayPal && (
                          isPending ? (
                          <Spinner/>
                          ) : (
                            <div className="flex w-[300px] flex-col items-center gap-2 px-4 pt-4 border rounded">
                              <PayPalButtons
                                // style={{ layout: "horizontal" }}
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                              />
                            </div>
                          ))
                        }
                        {
                          order?.paymentMethod?.toLowerCase() === 'paystack' && !hidePayPal ? (
                            <div className="flex flex-col items-center gap-4 px-4 py-2 my-4 border rounded">
                              <img src="/images/paystack.svg" className='w-[200px] ' alt="PayStack Pay" />
                              <PaystackButton
                                {...componentProps}
                                className=' remove__border bg-gray-800 hover:bg-gray-900 hover:text-cyan-500  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-4 rounded w-[250px] md:w-[300px] mx-auto text-cyan-400 flex justify-center'
                              />  
                            </div>
                        ):('')
                        }
                        {
                          order?.paymentMethod?.toLowerCase() === 'fincra' && !hidePayPal ? (
                            <div className="flex flex-col items-center gap-4 px-4 py-2 my-4 border rounded">
                              <img src="/images/fincra.svg" className='w-[200px] ' alt="Fincra Pay" />
                              <button
                                onClick={fincraPayment}
                                className=' remove__border bg-gray-800 hover:bg-gray-900 hover:text-purple-500  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-4 rounded w-[250px] md:w-[300px] mx-auto text-purple-400 flex justify-center'
                              >
                                Make Payment
                              </button>
                            </div>
                        ):('')
                        }
                      </div>
                    </div>
                  )
                }

              </div>
            </div>
            {
              !order?.isPaid && (
                <button disabled={loadingPayMethod} onClick={() => { setModal(true);  setHidePayPal(true)}} className="mt-10 remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">
                  Change Payment Method
                </button>
              )
            }
            {userInfo?.isAdmin ? (
            <div className="flex gap-5 py-10 items-center">
              <span className="font-medium">
                Mark As Delivered: 
              </span>
                <div className="">
                  <Switch
                    checked={order?.isDelivered}
                    onChange={handleOrdeliveryStatus}
                    className={`${order?.isDelivered ? 'bg-green-700' : 'bg-gray-400'}
                      relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${order?.isDelivered ? 'translate-x-9' : 'translate-x-0'}
                        pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>
              {loadingDeliver && <Spinner/>}
            </div>
              ):('')
            }
          </div>
        </div>
      </PageContainer>
       <Transition appear show={modal} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>setModal(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-10"
                  >
                    Change Payment Method
                  </Dialog.Title>
                  <form onSubmit={changePaymentMethod} className="flex flex-col justify-start gap-5">
                    <div className="form__radio-group">
                      <input type="radio" name="payment"
                        checked={payment.toLowerCase() === 'paypal'}
                        value="Paypal" onChange={handlePayment} id="paypal"
                        className='form__radio-input'
                      />
                      <label htmlFor="paypal" className='form__radio-label'>
                        <span className="form__radio__button"></span>
                        PayPal or Credit Card
                      </label>
                    </div>
                    <div className="form__radio-group">
                      <input type="radio" name="payment" value="PayStack" onChange={handlePayment} id="paystack"
                        className='form__radio-input'
                        checked={payment.toLowerCase() === 'paystack'}
                      />
                      <label htmlFor="paystack" className='form__radio-label'>
                        <span className="form__radio__button"></span>
                        PayStack
                      </label>
                    </div>
                    <div className="form__radio-group">
                      <input type="radio" name="payment" value="Fincra" onChange={handlePayment} id="fincra"
                        className='form__radio-input'
                        checked={payment.toLowerCase() === 'fincra'}
                      />
                      <label htmlFor="fincra" className='form__radio-label'>
                        <span className="form__radio__button"></span>
                        Fincra
                      </label>
                    </div>
                    <button disabled={Boolean(!payment)} className="remove__border bg-gray-800 hover:bg-gray-900 hover:text-white  disabled:text-gray-600 disabled:hover:bg-gray-800 transition-colors px-4 py-2 my-4 rounded w-[250px] md:w-[300px] mx-auto text-white flex justify-center">
                      {loadingPayMethod? <Spinner/> :'Change'}
                    </button>
                  </form> 
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default OrderScreen