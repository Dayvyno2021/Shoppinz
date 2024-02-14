import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { UserTypes } from "../types/userTypes";

interface UpdateUserType extends Partial<UserTypes> {
  id: string
}

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
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data
      })
    }),

    getUsers: builder.query<UserTypes[], ''>({
      query: () => ({
        url: `${USERS_URL}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 5,
      providesTags: ['User']
    }),

    deleteUser: builder.mutation<any, {userId:string}>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE'
      })
    }),

    getUserDetails: builder.query<UserTypes, { userId: string }>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5
    }),

    updateUser: builder.mutation<any, UpdateUserType>({
      query: (data) => ({
        url: `${USERS_URL}/${data?.id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    })

  }),
  overrideExisting: true
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useAuthRegisterMutation,
  useResetPasswordMutation,
  useCompletePasswordResetMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation
} = authsApiSlice;