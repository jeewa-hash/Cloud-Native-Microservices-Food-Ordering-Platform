import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Edit2, Trash2, Search, ArrowRight, Filter, AlertTriangle } from 'lucide-react';

const ProductCatalog = ({ onAddProduct, onEditProduct }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Decode token to get shop ID
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            const shopId = decoded.user?.id;

            if (!shopId) throw new Error("Could not derive Shop ID from token");

            const response = await axios.get(`http://localhost:4040/api/products/shops/${shopId}`);
            setProducts(response.data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4040/api/products/${productToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Update UI by removing the deleted product
            setProducts(products.filter(p => p._id !== productToDelete._id));
            setProductToDelete(null);
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <p className="font-medium mb-4">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
                    <p className="text-gray-500 mt-1">Manage and view all your current active products.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                    {/* Category Filter */}
                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer text-gray-700 font-medium"
                        >
                            <option value="All">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-700"
                        />
                    </div>
                </div>
            </div>

            {/* List View */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 max-w-sm">
                        {searchTerm ? "No products match your search term. Try a different query." : "You haven't added any products yet. Go to 'Add Products' to get started!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col">
                            {/* Image Placeholder or Actual Image */}
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 ${!product.isAvailable ? 'grayscale-[0.5] opacity-80' : 'group-hover:scale-105'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package className="w-12 h-12 opacity-20" />
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {product.category}
                                </div>

                                {!product.isAvailable && (
                                    <div className="absolute top-3 left-3 bg-red-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-red-600 shadow-sm border border-red-200">
                                        Not Available
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1">{product.name}</h3>
                                    <span className="font-bold text-orange-600 ml-3 shrink-0 flex items-center">
                                        LKR {Number(product.price).toFixed(2)}
                                    </span>
                                </div>

                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                                    {product.description}
                                </p>

                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                        onClick={() => onEditProduct(product)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(product)}
                                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Product Card */}
                    <button
                        onClick={onAddProduct}
                        className="bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-300 group flex flex-col items-center justify-center min-h-[300px] p-6"
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 mb-4">
                            <span className="text-3xl text-gray-400 group-hover:text-orange-500">+</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-600 group-hover:text-orange-600 transition-colors">Add New Product</h3>
                        <p className="text-gray-400 text-sm text-center mt-2 group-hover:text-orange-400/80 transition-colors">
                            Click here to add another item to your shop's catalog
                        </p>
                    </button>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
                                <AlertTriangle className="w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                            <p className="text-gray-500 mb-8 text-sm leading-relaxed px-2">
                                Are you sure you want to delete <span className="font-bold text-gray-800">{productToDelete.name}</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setProductToDelete(null)}
                                    disabled={isDeleting}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-70"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md hover:shadow-red-600/20 flex items-center justify-center disabled:opacity-70"
                                >
                                    {isDeleting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
