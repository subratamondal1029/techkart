import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: []
    },
    reducers: {
        storeProducts: (state, action) => {
            state.products = action.payload
        },
        addProduct: (state, action) => {
            state.products = [action.payload]
        }
    }
})

export const { storeProducts, addProduct } = productSlice.actions
export default productSlice.reducer