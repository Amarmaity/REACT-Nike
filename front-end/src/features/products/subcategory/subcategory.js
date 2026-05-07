import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

// API call
export const fetchSubCategories = createAsyncThunk(
  "subcategory/fetchSubCategories",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/sub-category/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const initialState = {
  subCategoryList: [], 
  loading: false,
  error: null,
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategoryList = action.payload; 
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subCategorySlice.reducer;