import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    userData: null,
    isCartCreated: false,
    otherData: {
        orders: [],
        cart: []
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) =>{
            if (action.payload.userData) {
                state.isLogin = true
                state.userData = action.payload.userData
                if (action.payload.otherData) state.otherData = {...state.otherData, ...action.payload.otherData}
                if(action.payload.isCartCreated) state.isCartCreated = action.payload.isCartCreated
            }else if (action.payload.otherData) {
                state.otherData = action.payload.otherData
            }else if(action.payload.isCartCreated) state.isCartCreated = action.payload.isCartCreated
        },

        logout: (state) => {
            state.isLogin = false
            state.userData = null
            state.isCartCreated = false,
            state.otherData = {
                orders: [],
                cart: []
            }
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer