import React, { useState } from 'react'
import { useNavigate , Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({children}) => {
    const[isAdminAuthenticated , setIsAdminAuthenticated]= useState(true);
    const navigate = useNavigate()
    if(!isAdminAuthenticated) return <Navigate to={"/"} replace />
  return children
}

export default AdminPrivateRoute