import React, { useEffect, useState } from 'react'

const useOnlineStatus = () => {
    const[onlineStatus, setOnlineStatus]= useState(true);
    useEffect(()=>{
        const onlineHandler=()=> setOnlineStatus(true)
        const offlineHandler=()=> setOnlineStatus(false)
        window.addEventListener('online', onlineHandler)
        window.addEventListener("offline",offlineHandler)
        return()=>{
            window.removeEventListener("online", onlineHandler)
            window.removeEventListener("offline", offlineHandler)
        }

    },[])
  return onlineStatus
}
export default useOnlineStatus