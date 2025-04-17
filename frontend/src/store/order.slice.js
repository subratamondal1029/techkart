import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: [],
  reducers: {
    storeOrders: (state, action) => {
      state = action.payload;
    },
    addOrder: (state, action) => {
      const index = state.findIndex(
        (order) => order._id === action.payload?._id
      );

      if (index !== -1) {
        const isSame =
          JSON.stringify(state[index]) === JSON.stringify(action.payload);
        if (isSame) return; // no need to update

        Object.assign(state[index], action.payload); // update only if changed
        return;
      }

      state.push(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.findIndex(
        (order) => order._id === action.payload?._id
      );
      if (index !== -1) {
        Object.assign(state[index], action.payload);
      }
    },
  },
});

export const { storeOrders, addOrder, updateOrder } = orderSlice.actions;
export default orderSlice.reducer;
