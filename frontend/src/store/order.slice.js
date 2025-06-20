import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    page: 0,
    data: [],
  },
  reducers: {
    storeOrders: (state, action) => {
      const { page, data: newItems } = action.payload;

      const uniqueItems = [
        ...state.data,
        ...newItems.filter(
          (newItem) =>
            !state.data.some((existing) => existing._id === newItem._id)
        ),
      ];

      return {
        page,
        data: uniqueItems,
      };
    },
    addOrder: (state, action) => {
      const index = state.data.findIndex(
        (order) => order._id === action.payload?._id
      );

      if (index !== -1) {
        const isSame =
          JSON.stringify(state.data[index]) === JSON.stringify(action.payload);
        if (isSame) return; // no need to update

        Object.assign(state.data[index], action.payload); // update only if changed
        return;
      }

      state.data.push(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.data.findIndex(
        (order) => order._id === action.payload?._id
      );
      if (index !== -1) {
        Object.assign(state.data[index], action.payload);
      }
    },
    clearOrders: () => {
      return {
        page: 0,
        data: [],
      };
    },
  },
});

export const { storeOrders, addOrder, updateOrder, clearOrders } =
  orderSlice.actions;
export default orderSlice.reducer;
