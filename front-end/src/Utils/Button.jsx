import React from 'react'

const Button = ({text="Register", type="submit", className="",}) => {
    return (
        <button
            type={type}
            className={`bt-0 bg-[#33CCCC] text-black font-medium py-2 px-4 rounded-md shadow hover:bg-[#28a5a5] transition ${className}`}
        >
            {text}
        </button>
    )
}

export default Button