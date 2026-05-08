import {configureStore} from "@reduxjs/toolkit"
import authReducer from  "../features/auth/authSlice"
import categoryReducer from "../features/products/mastercategory/categorylist"
import subCategoryReducer from "../features/products/subcategory/subcategory"
import productStoreSlice from "../features/products/product/productstore"

export const store = configureStore({
    reducer:{
        auth:authReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        products: productStoreSlice
    }
    
})