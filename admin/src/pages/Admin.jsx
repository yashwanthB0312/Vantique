// src/pages/Admin.jsx
import React, { useState } from 'react';
import DashboardOverview from '../components/Dashboard';
import ManageProducts from '../components/Products';
import Orders from '../components/Orders';
import Users from '../components/Users';

const tabs = ['Dashboard', 'Products', 'Orders', 'Users'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-2 py-2 rounded hover:bg-cyan-700 ${
              activeTab === tab ? 'bg-cyan-600' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-10 bg-gray-50">
        {activeTab === 'Dashboard' && <DashboardOverview />}
        {activeTab === 'Products' && <ManageProducts />}
        {activeTab === 'Orders' && <Orders />}
        {activeTab === 'Users' && <Users />}
      </div>
    </div>
  );
};

export default Admin;
