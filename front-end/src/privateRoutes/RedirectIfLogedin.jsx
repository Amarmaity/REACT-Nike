import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { PUBLIC_PATHS } from '../routePath/publicPaths'


const RedirectIfLogedin = ({children}) => {
  const {user ,isAuthenticated, loading } = useSelector((state)=> state.auth)
  if(loading) return null
  (!isAuthenticated) ? <Navigate to={`${PUBLIC_PATHS.LOGIN}`} replace />: children 
}
export default RedirectIfLogedin