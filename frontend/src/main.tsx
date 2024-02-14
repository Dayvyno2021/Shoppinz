import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './index.scss';
import { Provider } from 'react-redux';
import PrivateRoute from './components/PrivateRoute.tsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.tsx';
import ProductScreen from './screens/ProductScreen.tsx';
import { store } from './redux/store.ts';
import CartScreen from './screens/CartScreen.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import RegisterScreen from './screens/RegisterScreen.tsx';
import RegisterSuccess from './screens/RSuccessScreen.tsx';
import VerifyEmailScreen from './screens/VerifyScreen.tsx';
import ResetPasswordScreen from './screens/ResetPasswordScreen.tsx';
import CompletePasswordResetScreen from './screens/CompletePasswordResetScreen.tsx';
import ShippingScreen from './screens/ShippingScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import Placeorder from './screens/Placeorder.tsx';
import OrderScreen from './screens/OrderScreen.tsx';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProfileScreen from './screens/ProfileScreen.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import OrderListScreen from './screens/admin/OrderListScreen.tsx';
import ProductListScreen from './screens/admin/ProductListScreen.tsx';
import ProductEditScreen from './screens/admin/ProductEditScreen.tsx';
import UserListScreen from './screens/admin/UserListScreen.tsx';
import UserEditScreen from './screens/admin/UserEditScreen.tsx';
import { HelmetProvider } from 'react-helmet-async';

// import * as dotenv from 'dotenv';
// dotenv.config();
// console.log("ENVSAMPLE: ", process.env) // remove this after you've confirmed it is working

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/register/success' element={<RegisterSuccess />} />
      <Route path='/verify' element={<VerifyEmailScreen />} />
      <Route path='/password-reset' element={<ResetPasswordScreen />} />
      <Route path='/password-reset/confirm' element={<CompletePasswordResetScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/placeorder' element={<Placeorder />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orders-list' element={<OrderListScreen />} />
        <Route path='/admin/products' element={<ProductListScreen />} />
        <Route path='/admin/products/:pageNumber' element={<ProductListScreen />} />
        <Route path='/admin/product-list/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/users-list' element={<UserListScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
)

const initialOptions = {
    clientId: "test",
    currency: "USD",
    intent: "capture",
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true} options={initialOptions}>
          <RouterProvider router={router}/>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
