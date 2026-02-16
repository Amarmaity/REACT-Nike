import React from "react";

const AdminButton = ({
    text,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
    ...props
}) => {
    const base =
        "px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none";

    const variants = {
        primary: `
      bg-[#2EC4C4]
      text-[#071A35]
      shadow-md
      hover:bg-[#29B3B3]
      active:scale-[0.98]
      focus:ring-2 focus:ring-[#33CCCC]
    `,
        secondary: `
      bg-[#1C355E]
      text-gray-200
      border border-gray-600
      hover:bg-[#244575]
      active:scale-[0.98]
    `,
        danger: `
      bg-red-500
      text-white
      hover:bg-red-600
      active:scale-[0.98]
    `,
    };

    const disabledStyle = "opacity-50 cursor-not-allowed";

    return (
        <button
            type={type}
            disabled={disabled}
            className={`
        ${base}
        ${variants[variant]}
        ${disabled ? disabledStyle : ""}
        ${className}
      `}
            {...props}
        >
            {text}
        </button>
    );
};

export default AdminButton;
