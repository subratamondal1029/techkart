import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
// TODO: add order and cart slices

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
  },
});
