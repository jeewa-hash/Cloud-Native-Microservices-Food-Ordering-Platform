import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerHome from './pages/CustomerHome';
import ShopHome from './pages/ShopHome';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import CheckoutPage from './OrderManagementServiceFrontend/CheckoutPage';
import OrderHistoryPage from "./OrderManagementServiceFrontend/OrderHistoryPage"; 

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Accessible only if NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes (Accessible only if logged in and role matches) */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer-home" element={<CustomerHome />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} /> {/* Alternative route */}

        </Route>

        <Route element={<ProtectedRoute allowedRoles={['shop']} />}>
          <Route path="/shop-home" element={<ShopHome />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
