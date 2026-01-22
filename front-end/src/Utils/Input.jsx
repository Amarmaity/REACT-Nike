import React from "react";

const Input = ({
  type = "text",
  name,
  placeholder,
  register,
  registerOptions = {},
  errors,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={type}
        id={name}
        required
        inputMode={type === "tel" ? "numeric" : undefined}
        placeholder=" "
        className={`
          peer block w-full rounded-lg border-2
          border-gray-600 bg-gray-800 text-white
          px-4 py-4 pt-6 text-sm
          focus:outline-none focus:border-[#33CCCC]
          focus:ring-2 focus:ring-[#33CCCC]
          transition-all
          ${errors[name] ? "border-red-500" : ""}
        `}
        {...register(name, {
          required: `${placeholder} is required`,
          ...registerOptions,
          onChange: (e) => {
            if (type === "tel") {
              e.target.value = e.target.value.replace(/\D/g, "");
            }
          },
        })}
        {...props}
      />

      <label
        htmlFor={name}
        className={`
          absolute left-4 px-1 bg-gray-800
          text-gray-400 text-sm pointer-events-none
          transition-all duration-200 ease-in-out
          top-1/2 -translate-y-1/2
          peer-focus:-top-2
          peer-focus:text-[#33CCCC]
          peer-valid:-top-2
          peer-valid:text-[#33CCCC]
        `}
      >
        {placeholder}
      </label>

      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};
export default Input;
