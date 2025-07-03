import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('https://vantique.onrender.com/api/orders/successful')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Successful Orders</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Order ID</th>
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t">
              <td className="p-2">{order._id}</td>
              <td className="p-2">{order.userId?.name || 'Unknown'}</td>
              <td className="p-2 capitalize">{order.status}</td>
              <td className="p-2">₹{order.totalAmount.toLocaleString('en-IN')}</td>
              <td className="p-2">
                {order.items.map(item => (
                  <div key={item._id}>
                    {item.productId?.brand || 'Item'} × {item.quantity}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
