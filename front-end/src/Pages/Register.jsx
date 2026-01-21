import React from 'react'
import {useForm } from "react-hook-form"

const Register = () => {
    const {register, handleSubmit, formState:{errors}} = useForm()
    const onSubmit=(data)=>{
        console.log(data)

    }
  return (
   <form onSubmit={handleSubmit(onSubmit(data))} >
    <input {...register("username",{required:{value: true, message:"username is reuired"}})} type="text" placeholder='UserName'  />
    <input {...register("email",{required:{value: true, message:"email is reuired"}})} type="email" placeholder='email'  />
    <input type="password" placeholder='password' {...register("password",{required:{value:true, message:"password is reuired"}})} />
    <input type="submit" value={"Register"} />

   </form>
  )
}

export default Register