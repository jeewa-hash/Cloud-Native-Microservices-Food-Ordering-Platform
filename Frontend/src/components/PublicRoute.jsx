import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            const userRole = decoded.user?.role || 'customer';

            if (userRole === 'shop') return <Navigate to="/shop-home" replace />;
            if (userRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
            return <Navigate to="/customer-home" replace />;
        } catch (error) {
            // Token is invalid, allow access to public routes by clearing invalid token
            localStorage.removeItem('token');
            return <Outlet />;
        }
    }

    // No token, proceed to public route (like Login or Register)
    return <Outlet />;
};

export default PublicRoute;
