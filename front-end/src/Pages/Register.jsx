import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            console.log(result);
        } catch (err) {
            console.error("API Error:", err);
        }
    };


    return (
        <div className="bg-gray-900 border my-10 border-gray-800 rounded-lg p-8 shadow-lg animate-normal max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Your username"
                        {...register("username", { required: "Username is required" })}
                        className="mt-1 p-3 block w-full text-white border border-gray-700 rounded-md sm:text-sm bg-gray-800 focus:border-[#33CCCC] focus:ring-[#33CCCC]"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email", { required: "Email is required" })}
                        className="mt-1 p-3 block w-full text-white border border-gray-700 rounded-md sm:text-sm bg-gray-800 focus:border-[#33CCCC] focus:ring-[#33CCCC]"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <input
                        type="number"
                        placeholder="Phone Number"
                        {...register("phone", { required: "Phone Number is required" })}
                        className="mt-1 p-3 block w-full text-white border border-gray-700 rounded-md sm:text-sm bg-gray-800 focus:border-[#33CCCC] focus:ring-[#33CCCC]"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-[#33CCCC] text-black font-medium py-2 px-4 rounded-md shadow hover:bg-[#28a5a5] transition"
                >
                    Register
                </button>

            </form>
        </div>
    );
};

export default Register;
