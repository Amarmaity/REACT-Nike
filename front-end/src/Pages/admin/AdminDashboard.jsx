import React from 'react'
import Sidebar from './Sidebar'
import Content from './Content'

const AdminDashboard = () => {
  return (
   <>
   <div className="w-full grid-cols-2 ">
    <Sidebar/>
    <Content/>
    

   </div>
   </>
  )
}

export default AdminDashboard