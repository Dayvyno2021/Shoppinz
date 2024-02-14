import { Cart } from "./slices/cartSlice";

export const addDecimal= (num: number): string=>{
  return num.toFixed(2);
}

export const updateCart = (state : Cart) => {
  //Calculate items Price
  state.itemsPrice = addDecimal(state.cartItems!.reduce((acc, item) => acc + item.price! * item.qty!, 0));

  //Calculate shipping price
  state.shippingPrice = addDecimal(Number(state.itemsPrice) > 10000 ? 0 : 1000);

  //Calculate taxPrice
  state.taxPrice = addDecimal(Number(state.itemsPrice) * 0.15);

  //Calculate total price
  state.totalPrice = addDecimal( Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice) )

  window.localStorage.setItem('cart', JSON.stringify(state));

  return state;
}