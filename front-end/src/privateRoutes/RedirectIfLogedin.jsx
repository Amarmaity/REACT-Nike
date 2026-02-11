import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const RedirectIfLogedin = ({children}) => {
  const {user ,isAuthenticated, loading } = useSelector((state)=> state.auth)
  if(loading) return null
  (!isAuthenticated) ? <Navigate to={"/user/login"} replace />: children 
}
export default RedirectIfLogedin