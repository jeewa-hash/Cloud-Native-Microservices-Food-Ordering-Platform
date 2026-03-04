import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-gray-400 mb-8">System administration, user management, and global metrics.</p>
            <button
                onClick={handleLogout}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
            >
                Log Out
            </button>
        </div>
    );
};

export default AdminDashboard;
