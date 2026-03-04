import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerHome = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">Customer Home</h1>
            <p className="text-gray-600 mb-8">Welcome back! Browse your favorite restaurants and meals here.</p>
            <button
                onClick={handleLogout}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
                Log Out
            </button>
        </div>
    );
};

export default CustomerHome;
