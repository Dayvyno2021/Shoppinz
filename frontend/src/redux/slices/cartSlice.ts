import { PayloadAction, createSlice } from "@reduxjs/toolkit";;
import { updateCart } from "../cartUtils";


// let cartSlice;

export interface CartItem{
  _id?: string;
  qty: number;
  name?: string;
  image?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: number;
  countInStock?: number;
  rating?: number;
  numReviews?: number;
}

export interface Cart{
  cartItems: CartItem[];
  itemsPrice?: string;
  shippingPrice?: string;
  taxPrice?: string;
  totalPrice?: string;
  shippingAddress?: {address?: string, city?: string, postalCode?: string, country?: string},
  paymentMethod?: string

}

const initialState: Cart = window.localStorage.getItem('cart') ? 
  JSON.parse(window.localStorage.getItem('cart') || '') : { cartItems: [], itemsPrice: '0', shippingPrice: '0', taxPrice: '0', totalPrice: '0', shippingAddress: {}, paymentMethod: 'Paypal' }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action:PayloadAction<CartItem>) => {
      const item: CartItem = action.payload;

      const existItem = state.cartItems!.find((x) => x._id === item._id);

      if (existItem) {

        state.cartItems = state.cartItems!.map((x) => x._id === existItem._id? item : x )

      } else {

        state.cartItems = [...state.cartItems!, item];

      }

      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems!.filter((item) => item._id !== action.payload);


      // localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state); //The main purpose of running this function is for the localStorage function above, I can run the above localStorage function and omit this
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      // localStorage.setItem('cart', JSON.stringify(state))
      return updateCart(state); //The main purpose of running this function is for the localStorage function above, I can run the above localStorage function and omit this
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      // localStorage.setItem('cart', JSON.stringify(state))
      return updateCart(state); //The main purpose of running this function is for the localStorage function above, I can run the above localStorage function and omit this
    },

    clearCatItems: (state) => {
      state.cartItems = [];

      return updateCart(state);
    }

  }

})

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCatItems } = cartSlice.actions;

export default cartSlice.reducer;