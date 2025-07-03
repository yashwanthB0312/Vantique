import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWatches: 0,
    totalOrders: 0,
    revenue: 0,
    totalUsers: 0,
    monthlySales: [],
    categoryDistribution: [],
    topProducts: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get('https://vantique.onrender.com/api/products'),
          axios.get('https://vantique.onrender.com/api/orders'),
          axios.get('https://vantique.onrender.com/api/users'),
        ]);

        const totalWatches = productsRes.data.length;
        const totalOrders = ordersRes.data.length;
        const revenue = ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalUsers = usersRes.data.length;

        const monthlySales = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleString('default', { month: 'short' }),
          total: 0,
        }));

        ordersRes.data.forEach(order => {
          const m = new Date(order.createdAt).getMonth();
          monthlySales[m].total += order.totalAmount;
        });

        const categories = {};
        productsRes.data.forEach(product => {
          const type = product.type || 'Other';
          categories[type] = (categories[type] || 0) + 1;
        });

        const categoryDistribution = Object.entries(categories).map(([name, value]) => ({ name, value }));

        const productSales = {};
        ordersRes.data.forEach(order => {
          order.items.forEach(item => {
            const id = item.productId._id;
            const name = item.productId.brand;

            if (!productSales[id]) {
              productSales[id] = { name, quantity: 0 };
            }
            productSales[id].quantity += item.quantity;
          });
        });

        const topProducts = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setStats({
          totalWatches,
          totalOrders,
          revenue,
          totalUsers,
          monthlySales,
          categoryDistribution,
          topProducts,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Watches" value={stats.totalWatches} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} />
        <StatCard label="Users" value={stats.totalUsers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold mb-4">Product Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border mt-10">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded shadow border hover:shadow-md transition duration-200">
    <p className="text-gray-500 text-sm">{label}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
  </div>
);

export default Dashboard;
