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
      const { quantity, productId } = action.payload;
      const existingProduct = state?.products?.find(
        (product) => product?.product?._id === productId
      );

      if (existingProduct) {
        if (quantity === existingProduct.quantity) return;

        existingProduct.quantity = quantity;
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
