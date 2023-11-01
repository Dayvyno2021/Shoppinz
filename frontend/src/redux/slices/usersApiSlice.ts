import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const authsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data
      })
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST'
      })
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data
      })
    }),

    authRegister: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify/${data?.token}?email=${data?.email}`,
        method: "POST",
      })
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password?email=${data?.email}`,
        method: 'POST'
      })
    }),

    completePasswordReset: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/complete-password-reset`,
        method: 'POST',
        body: data
      })
    })

  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useAuthRegisterMutation,
  useResetPasswordMutation,
  useCompletePasswordResetMutation
} = authsApiSlice;