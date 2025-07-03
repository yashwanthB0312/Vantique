import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`https://vantique.onrender.com/api/orders/user/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-16">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length ? (
        <ul className="space-y-4">
          {orders.map((order, idx) => (
            <li key={idx} className="bg-white p-4 rounded shadow">
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <ul className="pl-4 list-disc">
                {order.items.map((item, i) => (
                  <li key={i}>{item.productId?.brand} x {item.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : <p>No orders yet.</p>}
    </div>
  );
};

export default Orders;