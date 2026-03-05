import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Support message passed from Register form
    const successMsg = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await axios.post('http://localhost:5002/api/auth/login', {
                userName: email,
                password
            });

            if (response.data && response.data.token) {
                // Save token
                localStorage.setItem('token', response.data.token);

                // Extract role from token payload
                try {
                    const base64Url = response.data.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const decoded = JSON.parse(jsonPayload);
                    const userRole = decoded.user?.role;

                    if (userRole === 'shop') {
                        navigate('/shop-home');
                    } else if (userRole === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/customer-home');
                    }
                } catch (decodeError) {
                    console.error("Token decoding error:", decodeError);
                    setErrorMsg("Invalid token received from server.");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMsg(error.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left side - Visual/Branding */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(234,88,12,0.15),transparent_50%)]"></div>
                <div className="z-10 p-16 max-w-lg text-white">
                    <div className="bg-orange-600 inline-block p-3 rounded-xl mb-8">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome back to excellence.</h1>
                    <p className="text-gray-400 text-lg">Sign in to access your curated collections, track orders, and discover new arrivals.</p>

                    {/* Aesthetic dots */}
                    <div className="flex space-x-2 mt-16">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-16 lg:px-24 justify-center relative">
                <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-black transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back home
                </Link>

                <div className="w-full max-w-md mx-auto">
                    <h2 className="text-3xl font-bold mb-2">Sign in</h2>
                    <p className="text-gray-500 mb-8">Enter your details to access your account.</p>

                    {successMsg && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm border border-green-200 font-medium">
                            {successMsg}
                        </div>
                    )}

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 font-medium flex items-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address / Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white font-bold py-3.5 px-4 rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-black hover:text-orange-600 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
