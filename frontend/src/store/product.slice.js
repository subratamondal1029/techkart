import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: [],
  reducers: {
    storeProducts: (state, action) => {
      state = action.payload;
    },
    addProduct: (state, action) => {
      const existingProduct = state.find(
        (product) => product._id === action.payload?._id
      );
      if (existingProduct) return;

      state.push(action.payload);
    },
  },
});

export const { storeProducts, addProduct } = productSlice.actions;
export default productSlice.reducer;
