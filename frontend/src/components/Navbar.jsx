import React, { useEffect, useState, useRef } from 'react';
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import { PiUserCircleThin } from "react-icons/pi";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showFirst, setShowFirst] = useState(true);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef();
  const location = useLocation();

  const tabs = [
    { label: 'ALL WATCHES', path: '/allwatches' },
    { label: 'MEN', path: '/men' },
    { label: 'WOMEN', path: '/women' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-3 bg-white shadow">
      {/* Logo + Slogan */}
      <Link to='/home' className='flex items-center space-x-2 w-[400px]'>
        <h1 className="text-base font-serif tracking-widest text-gray-900 uppercase font-[Cinzel]">Vantique</h1>
        <span className="text-gray-400 text-xl font-light pb-[6px]">|</span>
        <h1 className='text-xs text-gray-700 transition-all duration-75'>
          {showFirst ? 'ONE TRUSTED DESTINATION' : 'THE ART OF VINTAGE LUXURY'}
        </h1>
      </Link>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-10">
        {tabs.map(({ label, path }) => (
          <Link
            key={label}
            to={path}
            className={`text-sm uppercase font-medium ${
              location.pathname === path ? 'text-cyan-700 font-semibold' : 'text-gray-700 hover:text-cyan-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Icons and Account Menu */}
      <div className="flex justify-end items-center space-x-6 w-[400px] text-xl h-full">
        <Link to="/wishlist" className="hover:text-black text-2xl flex items-center justify-center">
          <CiHeart />
        </Link>

        <div className="relative flex items-center justify-center" ref={accountRef}>
          <button onClick={() => setShowAccountMenu(!showAccountMenu)} className="hover:text-black text-2xl flex items-center justify-center">
            <PiUserCircleThin />
          </button>
          {showAccountMenu && (
            <div className="absolute -right-3 mt-53 w-45 bg-white rounded shadow-md py-2 z-50">
              <Link to="/account" onClick={() => setShowAccountMenu(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm">My Account</Link>
              <Link to="/orders" onClick={() => setShowAccountMenu(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm">My Orders</Link>
              <Link to="/wishlist" onClick={() => setShowAccountMenu(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm">My Wishlist</Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  setShowAccountMenu(false);
                  window.location.href = '/';
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <Link to="/cart" className="hover:text-black text-2xl flex items-center justify-center">
          <CiShoppingCart />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

