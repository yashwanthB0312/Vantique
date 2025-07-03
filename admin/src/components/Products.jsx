import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialForm = {
  brand: '',
  type: '',
  gender: '',
  price: '',
  dialColor: '',
  caseShape: '',
  dialType: '',
  strapColor: '',
  strapMaterial: '',
  dialThickness: '',
  qty: '',
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fieldList = [
    { label: 'Brand', name: 'brand' },
    { label: 'Type', name: 'type' },
    { label: 'Gender', name: 'gender' },
    { label: 'Price (₹)', name: 'price' },
    { label: 'Dial Color', name: 'dialColor' },
    { label: 'Case Shape', name: 'caseShape' },
    { label: 'Dial Type', name: 'dialType' },
    { label: 'Strap Color', name: 'strapColor' },
    { label: 'Strap Material', name: 'strapMaterial' },
    { label: 'Dial Thickness', name: 'dialThickness' },
    { label: 'Quantity', name: 'qty' },
  ];

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleAddOrUpdate = async () => {
    if (!editMode && !imageFile) return alert('Upload an image');

    try {
      setLoading(true);
      let imageUrl = '';

      // Upload new image if file is selected
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "vantique");
        data.append("cloud_name", "duheaepge");

        const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/duheaepge/image/upload", data);
        imageUrl = uploadRes.data.url;
      }

      const productData = {
        ...form,
        price: Number(form.price),
        qty: Number(form.qty),
        ...(imageUrl && { image: imageUrl }),
      };

      if (editMode) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, productData);
      } else {
        const res = await axios.post("http://localhost:5000/api/products", {
          ...productData,
          image: imageUrl,
        });
        setProducts(prev => [...prev, res.data]);
      }

      fetchProducts();
      setForm(initialForm);
      setImageFile(null);
      setShowForm(false);
      setEditMode(false);
      setEditingId(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("❌ Error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setImageFile(null);
    setEditingId(product._id);
    setEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setShowForm(!showForm);
            setForm(initialForm);
            setEditMode(false);
            setImageFile(null);
          }}
        >
          {showForm ? 'Close' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="border p-6 rounded mb-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            {fieldList.map((field) => (
              <div key={field.name}>
                <label className="text-sm font-semibold block mb-1">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full text-sm"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}

            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold block mb-1">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {(imageFile || form.image) && (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover border rounded"
                />
              )}
            </div>
          </div>

          <button
            onClick={handleAddOrUpdate}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : editMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p, index) => (
          <div key={index} className="border rounded-lg shadow bg-white overflow-hidden hover:shadow-md transition-all">
            <div className="w-full h-52 bg-gray-100 flex justify-center items-center">
              <img src={p.image} alt={p.brand} className="object-cover h-full w-full" />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">{p.brand}</h3>
              <p className="text-sm text-gray-600"><strong>Category:</strong> {p.type} | {p.gender}</p>
              <p className="text-sm text-gray-600"><strong>Price:</strong> ₹{p.price}</p>
              <p className="text-sm text-gray-500"><strong>Dial:</strong> {p.dialColor} / {p.dialType}</p>
              <p className="text-sm text-gray-500"><strong>Strap:</strong> {p.strapColor} / {p.strapMaterial}</p>
              <p className="text-sm text-gray-600"><strong>Qty:</strong> {p.qty}</p>

              {/* Actions */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
