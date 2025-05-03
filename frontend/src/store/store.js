import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth.slice";
import productSlice from "./product.slice";
import cartSlice from "./cart.slice";
import orderSlice from "./order.slice";
import searchSlice from "./search.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
    search: searchSlice,
  },
});
