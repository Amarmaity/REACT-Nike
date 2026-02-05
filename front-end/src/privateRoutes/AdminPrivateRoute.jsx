import React, { useState } from 'react'
import { useSelector } from 'react-redux';
const AdminPrivateRoute = ({ children }) => {  
  const user = useSelector((state)=> state.auth) 
  console.log("admin=====user", user) 
  if(user.user.role === "admin") return 
  return children
}
export default AdminPrivateRoute