// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Wishlist = () => {
//   const [items, setItems] = useState([]);
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/wishlist/${userId}`)
//       .then(res => setItems(res.data.items))
//       .catch(err => console.error('Failed to fetch wishlist:', err));
//   }, []);

//   return (
//     <div className="p-16">
//       <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
//       {items.length ? (
//         <div className="grid grid-cols-4 gap-6">
//           {items.map((item, idx) => (
//             <div key={idx} className="bg-white shadow p-4 rounded">
//               <img src={item.image} alt={item.brand} className="w-full h-40 object-cover rounded" />
//               <h3 className="text-lg font-bold mt-2">{item.brand}</h3>
//               <p className="text-sm text-gray-600">₹{item.price}</p>
//             </div>
//           ))}
//         </div>
//       ) : <p>No items in wishlist.</p>}
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5000/api/wishlist/${userId}`)
      .then(res => setItems(res.data.items))
      .catch(err => console.error('Failed to fetch wishlist:', err));
  }, [userId]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${userId}/${productId}`);
      setItems(prev => prev.filter(item => item.productId._id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  return (
    <div className="p-16">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const product = item.productId;
            return (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={product.image}
                  alt={product.brand}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{product.brand}</h2>
                  <p className="text-sm text-gray-500">{product.gender} | {product.type}</p>
                  <p className="text-blue-700 font-bold text-xl mt-2">₹{product.price?.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No items in wishlist.</p>
      )}
    </div>
  );
};

export default Wishlist;
