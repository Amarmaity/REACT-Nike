import React, { useEffect } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import { UpdateFollower } from 'react-mouse-follower'
import ProductList from './components/ProductList'
import SingleProduct from './components/SingleProduct'
import Register from './Pages/Register'
import Layout from './layout/Layout'
import Login from './Pages/Login'
import Error from './Pages/Error'
import PrivateRoute from './privateRoutes/PrivateRoute'
import AdminPrivateRoute from './privateRoutes/AdminPrivateRoute'
import AuthCheck from './Utils/AuthOnloadCheck'
import Profile from './Pages/user/Profile'
import AdminLayout from './Pages/admin/layout/AdminLayout'
import Users from './Pages/admin/dashboard/Users'
import DashboardHome from './Pages/admin/dashboard/DashboardHome'
import { Payments, Orders, WebsiteContent, Settings, Reports, Customers, Products } from "./Pages/admin/dashboard"
import {ProductOverview , ProductEditor } from "./Pages/admin/dashboard/productmanagement"
import {ADMIN_PATHS} from "./routePath/adminPaths"
import { PUBLIC_PATHS } from './routePath/publicPaths'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path={`${PUBLIC_PATHS.HOME}`} element={<Layout />} >
    <Route index element={<Home />} />
    <Route path={`${PUBLIC_PATHS.MENS}`} element={<ProductList category="men" />} />
    <Route path={`${PUBLIC_PATHS.CONTACT}`} element={<Contact />} />
    <Route path={`${PUBLIC_PATHS.REGISTER}`} element={<Register />} />
    <Route path={`${PUBLIC_PATHS.LOGIN}`} element={<Login />} />
    <Route errorElement={<Error />} element={<PrivateRoute />} >
      <Route path={`${PUBLIC_PATHS.CART}`} element={<Cart />} />
      <Route path={`${PUBLIC_PATHS.PROFILE()}`} element={<Profile />} />
    </Route>
    <Route element={<AdminPrivateRoute />}>
      <Route path={`${ADMIN_PATHS.DASHBOARD}`} element={<AdminLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path={`${ADMIN_PATHS.USERS}`} element={<Users />} />
        <Route path={`${ADMIN_PATHS.PAYMENTS}`} element={<Payments />} />
        <Route path={`${ADMIN_PATHS.ORDERS}`} element={<Orders />} />
        <Route path={`${ADMIN_PATHS.SETTINGS}`} element={<Settings />} />
        <Route path={`${ADMIN_PATHS.REPORTS}`} element={<Reports />} />
        <Route path={`${ADMIN_PATHS.CUSTOMERS}`} element={<Customers />} />
        <Route path={`${ADMIN_PATHS.WEBSITE_CONTENT}`} element={<WebsiteContent />} />
        <Route path={`${ADMIN_PATHS.PRODUCTS}`} element={<Products />}>
          <Route index element={<ProductOverview/>} />
          <Route path={`${ADMIN_PATHS.PRODUCT_EDIT()}`} element={<ProductEditor/>} />
        </Route>       
      </Route>
    </Route>

    {/* <Route path={`${PUBLIC_PATHS.PRODUCT_BY_ID}`} element={<SingleProduct />} /> */}
    <Route  path={PUBLIC_PATHS.PRODUCT_BY_ID()} element={<SingleProduct />}
/>

    <Route path='*' element={<Error />} />
  </Route>
))

const App = () => {
  useEffect(() => {
    console.log("hello")

  }, [])
  return (

    <AuthCheck>
      <main className='overflow-x-hidden min-h-screen w-full font-sans relative'>
        {/* Dark Background Layer */}
        <div
          className="fixed inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
          }}
        />
        <div className='relative z-10'>
          <UpdateFollower
            mouseOptions={{
              backgroundColor: "white",
              zIndex: 10,
              followSpeed: 1.5,
            }}
          >
            <RouterProvider router={router} />
          </UpdateFollower>
        </div>
      </main>
    </AuthCheck>

  )
}
export default App
