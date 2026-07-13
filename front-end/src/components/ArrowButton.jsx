
const ArrowButton = ({ children, className , ref }) => {
    return (
        <button
            ref={ref}
            className={`
                hidden md:flex
                absolute
                left-1/2
                -translate-x-1/2
                z-20
                bg-white
                shadow-md
                rounded-full
                p-2
                hover:bg-gray-100
                transition
                ${className ?? ""}
            `}
        >
            {children}
        </button>
    );
};

export default ArrowButton;