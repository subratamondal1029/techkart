import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    page: 0,
    data: [],
  },
  reducers: {
    storeProducts: (state, action) => {
      const { page, data: newItems } = action.payload;

      const uniqueData = [
        ...state.data,
        ...newItems?.filter(
          (newItem) =>
            !state.data.some((existing) => existing._id === newItem._id)
        ),
      ];

      return {
        page,
        data: uniqueData,
      };
    },
    addProduct: (state, action) => {
      const existingProduct = state.data.find(
        (product) => product._id === action.payload?._id
      );
      if (existingProduct) return;

      state.data.push(action.payload);
    },
  },
});

export const { storeProducts, addProduct } = productSlice.actions;
export default productSlice.reducer;
