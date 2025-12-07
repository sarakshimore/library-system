import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  user: any | null;
}

// Load auth data from localStorage and cookies on initialization
const loadAuthFromStorage = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("user_token") || Cookies.get("user_token") || null;
    const userStr = localStorage.getItem("user_data");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  }
  return { token: null, user: null };
};

const { token: initialToken, user: initialUser } = loadAuthFromStorage();

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user_token", action.payload);
        Cookies.set("user_token", action.payload, { expires: 7 }); // 7 days expiry
      }
    },
    setUser(state, action) {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(action.payload));
      }
    },
    // Set both token and user at once
    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        // Save to localStorage
        localStorage.setItem("user_token", action.payload.token);
        localStorage.setItem("user_data", JSON.stringify(action.payload.user));
        
        // Save to cookies for middleware access
        Cookies.set("user_token", action.payload.token, { 
          expires: 7, // 7 days
          sameSite: 'strict', // CSRF protection
          secure: process.env.NODE_ENV === 'production' // HTTPS only in production
        });
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        // Clear localStorage
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_data");
        
        // Clear cookies
        Cookies.remove("user_token");
      }
    },
  },
});

export const { setToken, setUser, setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
