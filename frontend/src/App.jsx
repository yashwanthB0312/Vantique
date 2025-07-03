import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Watches from './pages/Watches'
import Men from './pages/Men'
import Women from './pages/Women';
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetails from './components/ProductDetails'
import Cart from './components/cart'
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Orders from './pages/Orders';


const App = () => {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));

  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);
  return (
    <BrowserRouter>
      {window.location.pathname !== '/' && window.location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path='/' element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
        <Route path='/allwatches' element={isLoggedIn ? <Watches /> : <Navigate to="/" />} />
        <Route path='/men' element={isLoggedIn ? <Men /> : <Navigate to="/" />} />
        <Route path='/women' element={isLoggedIn ? <Women /> : <Navigate to="/" />} />
        <Route path='/wishlist' element={isLoggedIn ? <Wishlist /> : <Navigate to="/" />} />
        <Route path='/account' element={isLoggedIn ? <Account /> : <Navigate to="/" />} />
        <Route path='/orders' element={isLoggedIn ? <Orders /> : <Navigate to="/" />} />
        <Route path='/product/:id' element={isLoggedIn ? <ProductDetails /> : <Navigate to="/" />} />
        <Route path='/cart' element={isLoggedIn ? <Cart /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
