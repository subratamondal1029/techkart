import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: null,
  reducers: {
    storeCart: (state, action) => {
      return action.payload;
    },
    addToCart: (state, action) => {
      state?.products?.push(action.payload);
    },
    changeQuantity: (state, action) => {
      const existingProduct = state?.products?.find(
        (product) => product?.product?._id === action.payload?.product._id
      );

      if (existingProduct) {
        if (action.payload.quantity === existingProduct.quantity) return;

        existingProduct.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.products = state?.products?.filter(
        (product) => product?.product?._id !== action?.payload
      );
    },
  },
});

export const { storeCart, addToCart, changeQuantity, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
