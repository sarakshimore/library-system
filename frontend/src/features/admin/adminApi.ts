import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token to requests
      const token = (getState() as any).auth.token;
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Books', 'Authors', 'Users', 'Borrows'],
  endpoints: (builder) => ({
    // --- BOOK ENDPOINTS ---
    getBooks: builder.query({
      query: () => '/books',
      providesTags: ['Books'],
    }),
    getBookById: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: ['Books'],
    }),
    addBook: builder.mutation({
      query: (body) => ({
        url: '/books',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/books/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),

    // --- AUTHOR ENDPOINTS ---
    getAuthors: builder.query({
      query: () => '/authors',
      providesTags: ['Authors'],
    }),
    addAuthor: builder.mutation({
      query: (body) => ({
        url: '/authors',
        method: 'POST',        
        body,
      }),
      invalidatesTags: ['Authors'],
    }),
    updateAuthor: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/authors/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Authors'],
    }),
    deleteAuthor: builder.mutation({
      query: (id) => ({
        url: `/authors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Authors'],
    }),

    // --- USER ENDPOINTS ---
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    getUserBorrows: builder.query({
      query: (userId) => `/borrows/users/${userId}/borrowed`,
      providesTags: ['Borrows'],
    }),

    // --- BORROW ENDPOINTS ---
    getBorrows: builder.query({
      query: () => '/borrows',
      providesTags: ['Borrows'],
    }),

    borrowBook: builder.mutation({
      query: (data) => ({
        url: '/borrows/borrow',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Borrows', 'Books'],
    }),

    returnBook: builder.mutation({
      query: (id) => ({
        url: `/borrows/return/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Borrows', 'Books'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,

  useGetAuthorsQuery,
  useAddAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,

  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserBorrowsQuery,

  useGetBorrowsQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
} = adminApi;