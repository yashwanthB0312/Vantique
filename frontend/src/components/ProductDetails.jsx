import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CiHeart } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa'; // Filled Heart

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`https://vantique.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));

    // Check if this product is already wishlisted
    axios.get(`https://vantique.onrender.com/api/wishlist/${userId}`)
      .then(res => {
        const wishlist = res.data.items || [];
        const found = wishlist.some(item => item.productId._id === id);
        setIsWishlisted(found);
      })
      .catch(() => setIsWishlisted(false));
  }, [id, userId]);

  const handleAddToCart = async () => {
    try {
      await axios.post('https://vantique.onrender.com/api/cart', {
        userId,
        productId: product._id,
        quantity: 1
      });
      alert('Added to cart');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await axios.delete(`https://vantique.onrender.com/api/wishlist/${userId}/${product._id}`);
        setIsWishlisted(false);
      } else {
        await axios.post('https://vantique.onrender.com/api/wishlist', {
          userId,
          productId: product._id
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      alert('Failed to update wishlist');
    }
  };

  if (!product) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-16 px-6 py-10 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="overflow-hidden rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.brand}
              className="w-full h-[450px] object-cover hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.brand}</h1>
            <p className="uppercase text-sm text-gray-600">{product.gender} • {product.type}</p>

            <div className="text-gray-700 space-y-2">
              <p><strong>Case Shape:</strong> {product.caseShape}</p>
              <p><strong>Dial Type:</strong> {product.dialType}</p>
              <p><strong>Strap:</strong> {product.strapColor} - {product.strapMaterial}</p>
              <p><strong>Dial Color:</strong> {product.dialColor}</p>
              <p><strong>Dial Thickness:</strong> {product.dialThickness} mm</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-blue-700">₹{product.price.toLocaleString('en-IN')}</p>
              <p className={`text-sm font-medium ${product.qty > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.qty > 0 ? `In Stock (${product.qty})` : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.qty === 0}
              className={`flex-1 py-3 rounded-lg text-white text-lg font-semibold transition
                ${product.qty > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleToggleWishlist}
              className="text-2xl hover:scale-110 transition"
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {isWishlisted ? <FaHeart /> : <CiHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
