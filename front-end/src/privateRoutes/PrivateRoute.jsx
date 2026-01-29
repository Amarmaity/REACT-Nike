import React from 'react'
import { useSelector } from "react-redux"
import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user)    
    console.log(user)
    if (!user) return <Navigate to={'/user/login'} replace />
    return children
}
export default PrivateRoute