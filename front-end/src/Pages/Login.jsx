import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { showError, showSuccess ,showToastSuccess } from "../Utils/alert";
import Input from "../Utils/Input";
import Button from "../Utils/Button";
import { loginSuccess } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  // --------------------
  // Send OTP
  // --------------------
  const sendOTP = async (data) => {
    try {
      await api.post("/login/", data);

      setEmail(data.email);
      setStep("OTP");
      showToastSuccess("OTP sent successfully");
      reset();
    } catch (err) {
      showError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // --------------------
  // Verify OTP
  // --------------------
  const verifyOTP = async (data) => {
    try {
      const res = await api.post("/verify-otp/", {
        email,
        otp: data.otp,
      });
      const user = res.data.user;
      dispatch(loginSuccess(user));
      showToastSuccess("Login successful");
      
      if (user.role === "admin") {
        navigate("/backoffice");
      } else {
        navigate("/");
      }
    } catch (err) {
      showError(err.response?.data?.error || "Invalid OTP");
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
            disabled={isSubmitting}
              type="submit"
              className="w-full"
              text={isSubmitting ? "Sending OTP..." : "Send OTP"}
            />
          </form>

          <div className="mt-5 text-center text-sm text-gray-400">
            <span>Don’t have an account?</span>
            <Link
              to="/user/register"
              className="ml-1 font-medium text-indigo-400 hover:text-indigo-300"
            >
              Register now
            </Link>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
};

export default Login;
