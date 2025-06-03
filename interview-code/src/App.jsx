import React from 'react';
import { Routes, Route } from 'react-router-dom';

// User Pages
import SelectPolicy from './pages/user/SelectPolicy';
import CustomerDetails from './pages/user/CustomerDetails';
import Payment from './pages/user/Payment';
import Confirmation from './pages/user/Confirmation';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPolicies from './pages/admin/AdminPolicies';

// Auth Guard
import ProtectedRoute from './components/ProtectedRoute';

import Admincustomer from './pages/admin/AdminCustomer';
import Help from './pages/admin/Help';

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<SelectPolicy />} />
      <Route path="/customer-details" element={<CustomerDetails />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/confirmation" element={<Confirmation />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/policies" 
        element={
          <ProtectedRoute>
            <AdminPolicies />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/customers" 
        element={
          <ProtectedRoute>
            <Admincustomer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/help" 
        element={
          <ProtectedRoute>
            <Help/>
          </ProtectedRoute>
        } 
      />
      
      
    </Routes>
  );
}

export default App;
