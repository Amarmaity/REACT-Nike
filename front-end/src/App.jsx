import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import Footer from './components/Footer'
import { UpdateFollower } from 'react-mouse-follower'
import ProductList from './components/ProductList'
import SingleProduct from './components/SingleProduct'
import Register from './Pages/Register'
import Layout from './layout/Layout'
import Login from './Pages/Login'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='' element={<Layout/>} >
    <Route path='' element={<Home/>} />
    <Route path='/mens' element={<ProductList category="men" />} />
    <Route path='/contact' element={<Contact/>} />
    <Route path='user/register' element={<Register/>} />
    <Route path='user/login' element={<Login/>} />
    <Route path='cart' element={<Cart/>} />
    <Route path='/products/:productId' element={<SingleProduct/>} />
  </Route>  
))

const App = () => {
  return (
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
       <RouterProvider router={router}/>
       </UpdateFollower>
      </div>
    </main>
  )
}

export default App
