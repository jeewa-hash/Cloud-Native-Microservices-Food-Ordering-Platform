import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, DollarSign, Image as ImageIcon, Tag, AlignLeft, Upload, X, CheckCircle, ToggleLeft } from 'lucide-react';

const AddProduct = ({ onProductAdded, initialData = null }) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        isAvailable: true
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                category: initialData.category || '',
                description: initialData.description || '',
                image: initialData.image || '',
                isAvailable: initialData.isAvailable !== false
            });
            if (initialData.image) {
                setImagePreview(initialData.image);
            }
        } else {
            setFormData({
                name: '',
                price: '',
                category: '',
                description: '',
                image: '',
                isAvailable: true
            });
            setImagePreview(null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isAvailable' ? value === 'true' : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Please select an image file' });
                return;
            }

            // Check file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result // Base64 string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            image: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            setMessage({ type: 'error', text: 'Please select a product image' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData };

            let response;
            if (isEditMode) {
                response = await axios.put(`http://localhost:4040/api/products/${initialData._id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                response = await axios.post('http://localhost:4040/api/products', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            if (response.status === 201 || response.status === 200) {
                if (!isEditMode) {
                    setFormData({
                        name: '',
                        price: '',
                        category: '',
                        description: '',
                        image: '',
                        isAvailable: true
                    });
                    setImagePreview(null);
                }
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to add product. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        if (onProductAdded) {
            onProductAdded();
        }
    };

    return (
        <>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                    <p className="text-gray-500 mt-1">
                        {isEditMode
                            ? 'Update the details of your existing product below.'
                            : 'Fill in the details below to add a new item to your catalog.'}
                    </p>
                </div>

                {message.text && message.type === 'error' && (
                    <div className="p-4 rounded-xl mb-6 flex items-center bg-red-50 text-red-600 border border-red-200">
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-orange-600" />
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Luxury Watch"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-orange-600" />
                                    Price (LKR)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-orange-600" />
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="Food">Food</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Grocery">Grocery</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Availability */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <ToggleLeft className="w-4 h-4 text-orange-600" />
                                    Availability
                                </label>
                                <select
                                    name="isAvailable"
                                    value={formData.isAvailable.toString()}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column - Image Upload */}
                        <div className="space-y-2 h-full flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-orange-600" />
                                Product Image
                            </label>

                            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-orange-500 transition-colors relative bg-gray-50 group flex flex-col items-center justify-center min-h-[200px]">
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover absolute inset-0 z-0"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 flex flex-col items-center">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                            <Upload className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium mb-1">Click to upload image</p>
                                        <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={`absolute inset-0 w-full h-full cursor-pointer z-20 ${imagePreview ? 'hidden' : 'opacity-0'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mt-6">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-orange-600" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Enter an appealing description of your product..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                isEditMode ? "Update Product" : "Add Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner">
                                <CheckCircle className="w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{isEditMode ? 'Product Updated!' : 'Success!'}</h3>
                            <p className="text-gray-500 mb-8 text-sm leading-relaxed px-4">
                                {isEditMode
                                    ? 'Your product details have been successfully updated in the catalog.'
                                    : 'Your product has been added to the catalog and is now live in your shop.'}
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                {onProductAdded && (
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-full bg-black text-white py-3.5 px-6 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md hover:shadow-orange-600/20"
                                    >
                                        Back to Catalog
                                    </button>
                                )}
                                {!isEditMode && (
                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="w-full bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Add Another Product
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddProduct;
