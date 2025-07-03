// import React from 'react';

// const dummyOrders = [
//   { id: 1, customer: 'John Doe', status: 'Pending', total: '₹4999' },
//   { id: 2, customer: 'Alice', status: 'Shipped', total: '₹7999' },
// ];

// const Orders = () => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Orders</h2>
//       <table className="min-w-full bg-white border">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="text-left p-2">Order ID</th>
//             <th className="text-left p-2">Customer</th>
//             <th className="text-left p-2">Status</th>
//             <th className="text-left p-2">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dummyOrders.map((order) => (
//             <tr key={order.id} className="border-t">
//               <td className="p-2">{order.id}</td>
//               <td className="p-2">{order.customer}</td>
//               <td className="p-2">{order.status}</td>
//               <td className="p-2">{order.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Orders;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/successful')
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
