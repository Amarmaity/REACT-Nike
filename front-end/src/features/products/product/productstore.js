import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const fetchProductStore = createAsyncThunk( "product/fetchProductStore",async (_, thunkAPI)=>{
    try{
        const res = await api.get("/product/")
        return res.data

    }catch(error){
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }

})

const initialState = {
    productStore: [],
    loading: false,
    error: null
}

const productStoreSlice = createSlice({
    name: "productstore",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProductStore.pending,(state)=>{
            state.loading = true
        })
        .addCase(fetchProductStore.fulfilled,(state,action)=>{
            state.loading = false
            state.productStore = action.payload
        })
        .addCase(fetchProductStore.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        

    }
})
export default productStoreSlice.reducer

