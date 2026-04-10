import React, { useEffect, useState } from 'react'
import { DashboardSection } from '../../../components'
import api from '../../../../../api/axios'
import CategoryTable from '../components/categoryTable/CategoryTable'

const ManageCategory = () => {
    const[catList, setCatList] = useState([])
    useEffect(()=>{
        const fetchData = async ()=>{
           try{
             const res = await api.get("master-category");
             setCatList(res.data)
             console.log(catList)
           }catch(error){
            console.log(error)
           }
        }
        fetchData()
    },[])
    console.log(catList)
  return (
    <DashboardSection title={"Category List"} >
       
        <CategoryTable categories={catList} />
            
        
    </DashboardSection>
  )
}

export default ManageCategory