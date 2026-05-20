import {configureStore} from "@reduxjs/toolkit"
import authReducer from  "../features/auth/authSlice"
import categoryReducer from "../features/products/categorySlice"
import subCategoryReducer from "../features/products/subcategorySlice"
import productSlice from "../features/products/productSlice"


export const store = configureStore({
    reducer:{
        auth:authReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        products: productSlice
    }    
})