import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice"; // <-- ADD THIS LINE

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer, // <-- ADD THIS LINE
    // Add other reducers here (e.g., cart)
  },
});

export default store;
