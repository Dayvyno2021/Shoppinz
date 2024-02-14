// import { ProductType } from "@/types";
import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { ProductType } from "../types/productTypes";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: ProductType[], page:number, pages: number }, {pageNumber?:number, keyword?: string}>({
      query: ({pageNumber, keyword}) => ({
        url: `${PRODUCTS_URL}`,
        params: {
          pageNumber,
          keyword
        }
      }),
      keepUnusedDataFor: 5,
      // providesTags: ['Product'] //Without this, you may have to refresh the page
    }),

    getProductById: builder.query<ProductType, {id:string}>({
      query: ({id}) => ({
        url: `${PRODUCTS_URL}/${id}`
      }),
      keepUnusedDataFor: 5
    }),

    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'post',
      }),
      // invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation<ProductType, {productId: string, data:any}>({
      query: (body) => ({
        url: `${PRODUCTS_URL}/${body.productId}`,
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        body: body.data
      }),
      // invalidatesTags: ['Product'] //To clear the cache
    }),

    uploadProductImage: builder.mutation({
      query: ({data, id}) => ({
        url: `${UPLOAD_URL}/${id}`,
        method: 'POST',
        body: data
      })
    }),

    deleteProduct: builder.mutation<{ message: string }, { productId: string }>({
      query: ({ productId }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE'
      })
    }),

    createReview: builder.mutation<{ message: string }, {rating:number, comment:string, productId: string}>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data
      }),
      // invalidatesTags: ['Product']
    }),

    getTopProducts: builder.query<ProductType[], ''>({
      query: () => ({
        url: `${PRODUCTS_URL}/top`
      }),
      keepUnusedDataFor: 5
    })

  }),
  overrideExisting: true
})


export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery
} = productsApiSlice