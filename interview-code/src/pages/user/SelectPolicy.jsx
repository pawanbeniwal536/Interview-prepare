import React from 'react';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import PolicyCard from '../../components/PolicyCard';

const SelectPolicy = () => {
  const policies = [
    {
      type: 'Basic Car Coverage',
      price: 1,
      duration:"1 Year",
      features: [
        { name: '24/7 Roadside Assistance', included: true },
        { name: 'Towing up to 25km', included: true },
        { name: 'Flat Tire Assistance', included: true },
        { name: 'Fuel Delivery', included: false },
        { name: 'Battery Jump Start', included: true },
      ]
    },
    {
      type: 'Standard Car Coverage',
      price: 1499,
      duration:"2 Year",
      features: [
        { name: '24/7 Roadside Assistance', included: true },
        { name: 'Towing up to 50km', included: true },
        { name: 'Flat Tire Assistance', included: true },
        { name: 'Fuel Delivery', included: true },
        { name: 'Battery Jump Start', included: true },
      ]
    },
    {
      type: 'Basic Bike Coverage',
      price: 599,
      duration:"3 Year",
      features: [
        { name: '24/7 Roadside Assistance', included: true },
        { name: 'Towing up to 15km', included: true },
        { name: 'Flat Tire Assistance', included: true },
        { name: 'Fuel Delivery', included: false },
        { name: 'Battery Jump Start', included: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Select Your RSA Policy
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {policies.map((policy, index) => (
            <PolicyCard 
              key={index}
              type={policy.type}
              price={policy.price}
              features={policy.features}
              duration={policy.duration}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SelectPolicy;