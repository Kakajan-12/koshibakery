// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ProductResponse } from './../index'

// Define a service using a base URL and expected endpoints
export const productApi   = createApi({
  reducerPath: 'productApi   ',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    getProduct: builder.query<ProductResponse, void>({
      query: () => `/products`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductQuery } = productApi   