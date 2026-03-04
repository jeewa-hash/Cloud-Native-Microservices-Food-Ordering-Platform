import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        const userRole = decoded.user?.role || 'customer'; // Default to customer

        // If specific roles are required and the user's role is not included, redirect to their home
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            if (userRole === 'shop') return <Navigate to="/shop-home" replace />;
            if (userRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
            return <Navigate to="/customer-home" replace />;
        }

        // User is authenticated and authorized
        return <Outlet />;
    } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
