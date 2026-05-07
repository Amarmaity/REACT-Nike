import {configureStore} from "@reduxjs/toolkit"
import authReducer from  "../features/auth/authSlice"
import categoryReducer from "../features/products/mastercategory/categorylist"
import subCategoryReducer from "../features/products/subcategory/subcategory"

export const store = configureStore({
    reducer:{
        auth:authReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer
    }
    
})