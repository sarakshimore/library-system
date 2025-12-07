import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/authApi";
import authReducer from "@/features/auth/authSlice";
import { adminApi } from "@/features/admin/adminApi"; 

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer, 
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault()
      .concat(authApi.middleware) // authApi middleware
      .concat(adminApi.middleware),    // adminapi middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
