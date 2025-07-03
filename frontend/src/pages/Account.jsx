import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState({ name: '', email: '', address: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get(`https://vantique.onrender.com/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios.put(`https://vantique.onrender.com/api/users/${userId}`, user)
      .then(() => setEditMode(false))
      .catch(err => console.error('Failed to update:', err));
  };

  return (
    <div className="p-16 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="space-y-4">
        <input name="name" value={user.name} onChange={handleChange} disabled={!editMode} className="w-full border p-2 rounded" />
        <input name="email" value={user.email} disabled className="w-full border p-2 rounded" />
        <textarea name="address" value={user.address} onChange={handleChange} disabled={!editMode} className="w-full border p-2 rounded" />
        {editMode ? (
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-gray-600 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>
    </div>
  );
};

export default Account;