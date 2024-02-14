export type OrderType = {
  _id: string,
  user?: {
    _id: string,
    name: string,
    email: string
  },
  orderItems?: [{
    product: string
    name: string,
    image: string,
    qty: number,
    price: number,
  }],
  shippingAddress?: {
    address: string,
    city: string,
    postalCode: string,
    country: string
  },
  paymentMethod?: string,
  paymentResult?: {
    id: string,
    status: string,
    update_time:  string,
    email_address: string,
  },
  itemsPrice: number,
  taxPrice: number,
  shippingPrice: number,
  totalPrice: number,
  isPaid: boolean,
  paidAt: string,
  isDelivered: boolean,
  deliveredAt: string,
  createdAt: string,
  updatedAt: string
}