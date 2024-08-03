import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    userData: null,
    otherData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) =>{
            if (action.payload.userData) {
                state.isLogin = true
                state.userData = action.payload.userData
            }else if(action.payload.otherData) {
                state.otherData = action.payload.otherData
            }
        },

        logout: (state) => {
            state.isLogin = false
            state.userData = null
            state.otherData = null
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer