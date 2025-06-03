import React, { createContext, useState, useEffect, useContext } from 'react';
import { format, addYears } from 'date-fns';

const PolicyContext = createContext();

export const usePolicy = () => useContext(PolicyContext);

export const PolicyProvider = ({ children }) => {
  // Initialize policies from localStorage or with sample data
  const [policies, setPolicies] = useState(() => {
    const storedPolicies = localStorage.getItem('policies');
    if (storedPolicies) {
      return JSON.parse(storedPolicies);
    }
    
    // Sample data for initial load
    return [
      {
        id: 'RSA-2023-001',
        customerName: 'Rahul Sharma',
        vehicleNumber: 'MH04 AB 1234',
        duration: '2 Years',
        startDate: '15 Jun 2023',
        expiryDate: '14 Jun 2025',
        status: 'Active',
        email: 'rahul.s@example.com',
        address: 'Mumbai, Maharashtra',
        phoneNumber: '9876543210',
        city: 'Mumbai',
        policyType: 'Standard Car Coverage',
        amount: 1499
      },
      {
        id: 'RSA-2023-002',
        customerName: 'Priya Patel',
        vehicleNumber: 'MH02 CD 5678',
        duration: '1 Year',
        startDate: '12 Jun 2023',
        expiryDate: '11 Jun 2024',
        status: 'Active',
        email: 'priya.p@example.com',
        address: 'Andheri, Mumbai',
        phoneNumber: '9876543211',
        city: 'Mumbai',
        policyType: 'Basic Car Coverage',
        amount: 799
      },
      {
        id: 'RSA-2023-003',
        customerName: 'Amit Desai',
        vehicleNumber: 'MH01 EF 9012',
        duration: '3 Years',
        startDate: '10 Jun 2023',
        expiryDate: '09 Jun 2026',
        status: 'Active',
        email: 'amit.d@example.com',
        address: 'Pune, Maharashtra',
        phoneNumber: '9876543212',
        city: 'Pune',
        policyType: 'Premium Car Coverage',
        amount: 2499
      },
      {
        id: 'RSA-2023-004',
        customerName: 'Neha Singh',
        vehicleNumber: 'MH03 GH 3456',
        duration: '2 Years',
        startDate: '08 Jun 2023',
        expiryDate: '07 Jun 2025',
        status: 'Active',
        email: 'neha.s@example.com',
        address: 'Thane, Maharashtra',
        phoneNumber: '9876543213',
        city: 'Thane',
        policyType: 'Standard Car Coverage',
        amount: 1499
      },
      {
        id: 'RSA-2022-125',
        customerName: 'Vikram Mehta',
        vehicleNumber: 'MH05 IJ 7890',
        duration: '1 Year',
        startDate: '20 Dec 2022',
        expiryDate: '19 Dec 2023',
        status: 'Expiring Soon',
        email: 'vikram.m@example.com',
        address: 'Navi Mumbai, Maharashtra',
        phoneNumber: '9876543214',
        city: 'Navi Mumbai',
        policyType: 'Basic Car Coverage',
        amount: 799
      },
      {
        id: 'RSA-2022-098',
        customerName: 'Sanjay Kumar',
        vehicleNumber: 'MH06 KL 1234',
        duration: '1 Year',
        startDate: '15 Oct 2022',
        expiryDate: '14 Oct 2023',
        status: 'Expired',
        email: 'sanjay.k@example.com',
        address: 'Borivali, Mumbai',
        phoneNumber: '9876543215',
        city: 'Mumbai',
        policyType: 'Basic Car Coverage',
        amount: 799
      }
    ];
  });

  // Current policy data for the purchase flow
  const [currentPolicy, setCurrentPolicy] = useState({
    policyType: '',
    amount: 0,
    duration: '',
    customerName: '',
    email: '',
    address: '',
    phoneNumber: '',
    city: '',
    vehicleNumber: '',
    termsAccepted: false
  });

  useEffect(() => {
    // Save policies to localStorage whenever they change
    localStorage.setItem('policies', JSON.stringify(policies));
  }, [policies]);

  // Function to select a policy and start the purchase flow
  const selectPolicy = (policyType, amount, duration) => {
    setCurrentPolicy({
      ...currentPolicy,
      policyType,
      amount,
      duration
    });
  };

  // Function to update customer details
  const updateCustomerDetails = (details) => {
    setCurrentPolicy({
      ...currentPolicy,
      ...details
    });
  };

  // Function to complete the purchase and create a new policy
  const createPolicy = () => {
    const today = new Date();
    const expiryDate = addYears(today, parseInt(currentPolicy.duration.split(' ')[0]));
    
    const newPolicy = {
      id: `RSA-${format(today, 'yyMM')}-${String(policies.length + 1).padStart(3, '0')}`,
      customerName: currentPolicy.customerName,
      vehicleNumber: currentPolicy.vehicleNumber,
      duration: currentPolicy.duration,
      startDate: format(today, 'dd MMM yyyy'),
      expiryDate: format(expiryDate, 'dd MMM yyyy'),
      status: 'Active',
      email: currentPolicy.email,
      address: currentPolicy.address,
      phoneNumber: currentPolicy.phoneNumber,
      city: currentPolicy.city,
      policyType: currentPolicy.policyType,
      amount: currentPolicy.amount
    };
    
    setPolicies([...policies, newPolicy]);
    return newPolicy;
  };

  // Function to get policy by ID
  const getPolicyById = (id) => {
    return policies.find(policy => policy.id === id);
  };

  // Function to update a policy
  const updatePolicy = (id, updatedData) => {
    const updatedPolicies = policies.map(policy => 
      policy.id === id ? { ...policy, ...updatedData } : policy
    );
    setPolicies(updatedPolicies);
  };

  // Function to delete a policy
  const deletePolicy = (id) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  // Analytics data for admin dashboard
  const getDashboardData = () => {
    const activePolicies = policies.filter(p => p.status === 'Active').length;
    const totalRevenue = policies.reduce((sum, policy) => sum + policy.amount, 0);
    const expiringSoon = policies.filter(p => p.status === 'Expiring Soon').length;
    const recentPolicies = [...policies].sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate);
    }).slice(0, 5);
    
    // Calculate policy distribution
    const oneYearPolicies = policies.filter(p => p.duration === '1 Year').length;
    const twoYearPolicies = policies.filter(p => p.duration === '2 Years').length;
    const threeYearPolicies = policies.filter(p => p.duration === '3 Years').length;
    const total = policies.length || 1; // Avoid division by zero
    
    const policyDistribution = {
      oneYear: Math.round((oneYearPolicies / total) * 100),
      twoYear: Math.round((twoYearPolicies / total) * 100),
      threeYear: Math.round((threeYearPolicies / total) * 100),
    };
    
    return {
      activePolicies,
      totalRevenue,
      expiringSoon,
      recentPolicies,
      policyDistribution
    };
  };

  const value = {
    currentPolicy,
    policies,
    selectPolicy,
    updateCustomerDetails,
    createPolicy,
    getPolicyById,
    updatePolicy,
    deletePolicy,
    getDashboardData
  };

  return (
    <PolicyContext.Provider value={value}>
      {children}
    </PolicyContext.Provider>
  );
};

export default PolicyContext;