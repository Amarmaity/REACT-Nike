import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { showError, showToastSuccess } from "../Utils/alert";
import Input from "../Utils/Input";
import Button from "../Utils/Button";
import { loginSuccess } from "../features/auth/authSlice";

const getApiErrorMessage = (err, fallback) => {
  const data = err.response?.data;

  if (typeof data === "string") {
    return data;
  }

  return data?.error || data?.message || fallback;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const res = await api.post("/login/", data);
      const user = res.data.user;

      dispatch(loginSuccess(user));
      showToastSuccess("Login successful");

      if (user.role === "admin") {
        navigate("/backoffice");
      } else {
        navigate("/");
      }
    } catch (err) {
      showError(getApiErrorMessage(err, "Invalid email or password"));
    }
  };

  return (
    <div className="bg-gray-900 border my-10 border-gray-800 rounded-lg p-8 shadow-lg max-w-md mx-auto">
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <Input
          type="email"
          register={register}
          placeholder="Email address"
          name="email"
          errors={errors}
          required
        />
        <Input
          type="password"
          register={register}
          placeholder="Password"
          name="password"
          errors={errors}
          required
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full"
          text={isSubmitting ? "Logging in..." : "Login"}
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
    </div>
  );
};

export default Login;
