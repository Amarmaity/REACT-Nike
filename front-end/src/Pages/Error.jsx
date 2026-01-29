import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

const Error = () => {
    const errorMesssage = useRouteError()
    const navigate = useNavigate();

    console.log(errorMesssage)

    return (
        <div className="flex flex-col items-center justify-center min-h-[55vh] bg-gray-900 text-white p-6">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">Oops! Page Not Found</h2>
            <p className="mb-6 text-center max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default Error;
