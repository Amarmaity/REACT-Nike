import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "../../api/axios";


// export const fetchCategories = createAsyncThunk("category/fetchCategories", async (_, thunkAPI)=>{
//   try{
//    const res = await api.get("/master-category");
//    return res.data
//   }catch(error){
//     return thunkAPI.rejectWithValue(error.response?.data || error.message)

//   }
// })
export const fetchCategories = createAsyncThunk("category/fetchCategories", async(_, thunkAPI)=>{
  try{
    const res = await api.get('master-category');
    return res.data

  }catch(error){
    return thunkAPI.rejectWithValue(error.response?.data || error.message)

  }
})
const initialState = {
  categoryList: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default categorySlice.reducer;
