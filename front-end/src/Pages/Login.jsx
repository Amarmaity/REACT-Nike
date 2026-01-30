import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { config } from "../../config/config";
import { showError, showSuccess } from "../Utils/alert";
import Input from "../Utils/Input";
import Button from "../Utils/Button";
import { loginSuccess } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const [step, setStep] = useState("EMAIL");
    const [email, setEmail] = useState("");
    const navigate = useNavigate()
    const {
        handleSubmit,
        reset,
        register,
        formState: { errors,  isSubmitting },
    } = useForm();

    const sendOTP = async (data) => {
        try {
            await axios.post(`${config.BASE_URL}/login/`, data);
            setEmail(data.email);
            setStep("OTP");
            showSuccess("OTP sent successfully!");
            reset()
        } catch (error) {
            showError(error.response?.data?.message || "Failed to send OTP");
        }
    };
    // Verify OTP========
    const verifyOTP = async (data) => {
        try {
            const res = await axios.post(`${config.BASE_URL}/verify-otp/`, {
                email,
                otp: data.otp,
            });
            localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess(res.data));
            showSuccess("Login successful!");
            navigate("/")
        } catch (error) {
            showError(error.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="bg-gray-900 border my-10 border-gray-800 rounded-lg p-8 shadow-lg max-w-md mx-auto">
            {step === "EMAIL" ? (
                <>
                    <form onSubmit={handleSubmit(sendOTP)} className="space-y-6">
                        <Input
                            type="email"
                            register={register}
                            placeholder="Email address"
                            name="email"
                            errors={errors}
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            text={isSubmitting ? "Sending OTP..." : "Send OTP"}
                        />
                    </form>
                    <div className="mt-5 text-center text-sm text-gray-400">
                        <span>Don’t have an account?</span>
                        <Link
                            to="/user/register"
                            className="ml-1 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Register now
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit(verifyOTP)} className="space-y-6">
                        <Input
                            type="text"
                            register={register}
                            placeholder="Enter OTP"
                            name="otp"
                            errors={errors}
                            required
                        />
                        <Button
                            type="submit"
                            text={isSubmitting ? "Verifying..." : "Verify OTP"}
                        />
                    </form>

                </>
            )}
        </div>
    );
};
export default Login;
