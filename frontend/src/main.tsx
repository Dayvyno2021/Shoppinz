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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/register/success' element={<RegisterSuccess />} />
      <Route path='/verify' element={<VerifyEmailScreen />} />
      <Route path='/password-reset' element={<ResetPasswordScreen />} />
      <Route path='/password-reset/confirm' element={<CompletePasswordResetScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
