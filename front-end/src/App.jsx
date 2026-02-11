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
import { Payments , Orders  ,WebsiteContent, Settings ,Reports , Customers , Products  } from "./Pages/admin/dashboard"


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='' element={<Layout />} >
    <Route path='' element={<Home />} />
    <Route path='/mens' element={<ProductList category="men" />} />
    <Route path='/contact' element={<Contact />} />
    <Route path='/user/register' element={<Register />} />
    <Route path='/user/login' element={<Login />} />
    <Route errorElement={<Error />} element={<PrivateRoute />} >
      <Route path='/cart' element={<Cart />} />
      <Route path='/profile/:userName' element={<Profile />} />
    </Route>
    <Route element={<AdminPrivateRoute />}>
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path='users' element={<Users/>} />
        <Route path='payments' element={<Payments/>} />
        <Route path='orders' element={<Orders/>} />
        <Route path='settings' element={<Settings/>} />
        <Route path='reports' element={<Reports/>} />
        <Route path='customers' element={<Customers/>} />
        <Route path='website-content' element={<WebsiteContent/>} />
        <Route path='products' element={<Products/>} />
        <Route />
      </Route>
    </Route>

    <Route path='/products/:productId' element={<SingleProduct />} />
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
