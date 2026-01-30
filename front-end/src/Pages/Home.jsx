import React from 'react'
import Hero from '../components/Hero'
import { useSelector } from 'react-redux'

const Home = () => {
  const user = useSelector((state)=>state.auth.isAuthenticated);
  console.log(user)
  return (
    <div>
      <Hero/>
    </div>
  )
}

export default Home
