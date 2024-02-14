import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { OrderType } from "../types/orderTypes";
import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderType, any>({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: 'POST',
        body: {...order}
      })
    }),
    getOrderDetails: builder.query<OrderType, {id:string}>({
      query: ({id}) => ({
        url: `${ORDERS_URL}/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5
    }),
    payOrder: builder.mutation<OrderType, any>({
      query: (body) => ({
        url: `${ORDERS_URL}/${body?.id}/pay`,
        method: 'PUT',
        body: body
      })
    }),
    getPaymentKey: builder.query<{clientId: string}, {payMethod:string}>({
      query: ({payMethod}) => ({
        url: `${PAYPAL_URL}/${payMethod}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 5
    }),
    changePayMethod: builder.mutation<any, { payMethod: string, orderId: string }>({
      query: ({ payMethod, orderId }) => ({
        url: `${ORDERS_URL}/${orderId}/pay-method`,
        method: 'PUT',
        body: {payMethod}
      })
    }),
    getMyOrders: builder.query<OrderType[], ''>({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
        method: "GET"
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query<OrderType[], ''>({
      query: () => ({
        url: ORDERS_URL
      }),
      keepUnusedDataFor: 5
    }),

    deliverOrder: builder.mutation({
      query: ({id}) => ({
        url: `${ORDERS_URL}/${id}/deliver`,
        method: "PUT",
      })
    })
  }),
  overrideExisting: true
})


export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useChangePayMethodMutation,
  useGetPaymentKeyQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation
} = orderApiSlice;