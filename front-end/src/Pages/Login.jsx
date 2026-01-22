import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { config } from '../../config/config'
import { showError, showSuccess } from '../Utils/alert'
import Input from '../Utils/Input'
import Button from '../Utils/Button'

const Login = () => {
    const[verfyisPending, setVerfyisPending] = useState(false)
    const { handleSubmit, register, formState: { errors, isSubmitting, } } = useForm()
    const onSubmit = async (data) => {
        try {
            const res = axios(`${config.BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)

            })
            const result = await res.json()
            showSuccess("User Is Loged In Successfully!")
            setVerfyisPending(true)
        } catch (error) {
            showError(error)
        }

    }
    const verifyOTP= async(data)=>{        
        try{
            const res = axios(`${config.BASE_URL}/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)

            })
            const result = await res.json()
            showSuccess("User Verification Successfully!")

        }catch(error){
            showError(error)
        }
    }
    return (
        <>
            <div className="bg-gray-900  border my-10 border-gray-800 rounded-lg p-8 shadow-lg animate-normal max-w-md mx-auto">
                {
                    verfyisPending ?
                    <form onSubmit={handleSubmit(verifyOTP)} className="flex flex-col space-y-6">
                    <Input type='tel' register={register} placeholder={'OTP'} name={'OTP'} errors={errors} />
                    <Button type='submit' text={isSubmitting ? 'Verifying OTP...' : 'Verify OTP'} />

                </form>                    
                :
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                    <Input type='email' register={register} placeholder={'Email'} name={'email'} errors={errors} />
                    <Input type='test' register={register} placeholder={"new text"} name={"newtext"} errors={errors} />
                    <Button type='submit' text={isSubmitting ? 'Sending OTP...' : 'Send OTP'} />
                </form>                
                }
                
            </div>
        </>

    )
}
export default Login