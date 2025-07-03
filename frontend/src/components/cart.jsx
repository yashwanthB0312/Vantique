// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const userId = localStorage.getItem('userId');

// const CartPage = () => {
//   const [cart, setCart] = useState(null);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/cart/${userId}`)
//       .then(res => setCart(res.data))
//       .catch(err => console.error('Failed to fetch cart:', err));
//   }, []);

//   const total = cart?.items?.reduce((acc, item) => acc + (item.quantity * item.productId.price), 0) || 0;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
//       {cart?.items?.length > 0 ? (
//         <>
//           <div className="space-y-4">
//             {cart.items.map((item, index) => (
//               <div key={index} className="flex gap-4 border p-4 rounded-lg shadow bg-white">
//                 <img src={item.productId.image} alt="Product" className="w-24 h-24 object-cover rounded" />
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold">{item.productId.brand}</h3>
//                   <p className="text-sm text-gray-600">{item.productId.type} | {item.productId.gender}</p>
//                   <p className="text-sm text-gray-700">₹{item.productId.price} × {item.quantity}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 text-xl font-semibold">
//             Total: ₹{total}
//           </div>
//         </>
//       ) : (
//         <p>Your cart is empty.</p>
//       )}
//     </div>
//   );
// };

// export default CartPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const updateQuantity = async (productId, newQty, stockQty) => {
    if (newQty < 1) return;
    if (newQty > stockQty) {
      alert(`Only ${stockQty} items in stock`);
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/cart/${userId}`, {
        productId,
        quantity: newQty,
      });
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const deleteItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${userId}/${productId}`);
      fetchCart();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const checkout = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/cart/checkout/${userId}`);
      alert('Order placed successfully!');
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  const total = cart?.items?.reduce(
    (acc, item) => acc + item.quantity * item.productId.price,
    0
  ) || 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart?.items?.length > 0 ? (
        <>
          <div className="space-y-4">
            {cart.items.map((item, index) => (
              <div key={index} className="flex gap-4 border p-4 rounded-lg shadow bg-white items-center">
                <img src={item.productId.image} alt="Product" className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.productId.brand}</h3>
                  <p className="text-sm text-gray-600">{item.productId.type} | {item.productId.gender}</p>
                  <p className="text-sm text-gray-700">₹{item.productId.price} × {item.quantity}</p>
                  <div className="flex gap-2 mt-2 items-center">
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1, item.productId.qty)}
                      className="px-3 py-1 bg-gray-200 rounded text-lg font-bold"
                    >–</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1, item.productId.qty)}
                      className="px-3 py-1 bg-gray-200 rounded text-lg font-bold"
                    >+</button>
                    <button
                      onClick={() => deleteItem(item.productId._id)}
                      className="ml-4 text-red-500 hover:underline"
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-xl font-semibold">
            Total: ₹{total}
          </div>
          <button
            onClick={checkout}
            className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          >
            Confirm Order
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
