import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User as UserIcon, Phone, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...payload } = formData;
            const response = await axios.post('http://localhost:5002/api/auth/register', payload);

            if (response.status === 201) {
                // Pass a success message to the login page
                navigate('/login', { state: { message: "Account created successfully. Please login." } });
            }
        } catch (error) {
            console.error("Registration error:", error);
            setErrorMsg(error.response?.data?.message || "An error occurred during registration. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
            <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-black transition-colors font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back home
            </Link>

            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">

                {/* Left branding stripe (Desktop) */}
                <div className="hidden md:flex w-1/3 bg-black text-white p-8 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>

                    <div>
                        <div className="bg-orange-600 inline-block p-2 rounded-lg mb-6">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Join the Club.</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Create your elegant commerce profile today and unlock premium features.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-500 font-bold">1</div>
                            <span>Curated selections</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-500 font-bold">2</div>
                            <span>Fast checkout</span>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="w-full md:w-2/3 p-8 md:p-10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
                        <p className="text-gray-500 text-sm mt-1 mb-4">Fill in the fields below to get started.</p>
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center">
                                <span className="font-medium">{errorMsg}</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm" placeholder="John" />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-bold">@</span>
                                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} required
                                        className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm" placeholder="johndoe" />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer">
                                    <option value="customer">Customer</option>
                                    <option value="shop">Shop Owner</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Phone (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                </div>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6"
                                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all text-sm" placeholder="••••••" />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs uppercase tracking-wide text-gray-700 font-bold mb-2">Confirm</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-error focus:border-transparent outline-none transition-all text-sm" placeholder="••••••" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 bg-black text-white font-bold py-3 mt-4 rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-600/30 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-black hover:text-orange-600 transition-colors uppercase tracking-wide">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
