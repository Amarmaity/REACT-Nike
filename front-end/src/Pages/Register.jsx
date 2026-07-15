import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Utils/Button";
import Input from "../Utils/Input";
import { showSuccess, showError } from "../Utils/alert";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, isSubmitting },
    } = useForm();
    const onSubmit = async (data) => {
        try {
            const res = await api.post("/register/", data);
            console.log(res.data, "=============register data")
            showSuccess("Register Successfully!");
        } catch (err) {
            showError(err.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <div className="bg-gray-900 border my-10 border-gray-800 rounded-lg p-8 shadow-lg animate-normal max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                <Input type="text" register={register} placeholder={"User Name"} name={"username"} errors={errors} />
                <Input type="email" register={register} placeholder={"Email"} name={"email"} errors={errors} />
                <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    register={register}
                    errors={errors}
                    registerOptions={{
                        minLength: {
                            value: 10,
                            message: "Phone number must be at least 10 digits",
                        },
                        maxLength: {
                            value: 10,
                            message: "Phone number must not exceed 10 digits",
                        },
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers are allowed",
                        },
                    }}
                />
                <Input
                    type="password"
                    register={register}
                    placeholder={"Password"}
                    name={"password"}
                    errors={errors}
                    registerOptions={{
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    }}
                />
                <Button disabled={isSubmitting} text={isSubmitting ? "Registering..." : "Register"} />
            </form>
            <div className="mt-5 text-center text-sm text-gray-400">
                <span>Already Have an account?</span>
                <Link
                    to="/user/login"
                    className="ml-1 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Login Now
                </Link>
            </div>
        </div>
    );
};

export default Register;
