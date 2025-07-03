import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const filterKeys = [
  'brand', 'type', 'gender', 'price', 'dialColor',
  'caseShape', 'dialType', 'strapColor', 'strapMaterial', 'dialThickness',
];

const priceRanges = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000–₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000–₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000–₹50,000', min: 25000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity },
];

const getUniqueValues = (data, key, filters) => {
  return [...new Set(
    data.filter(item =>
      Object.entries(filters).every(([fKey, fVals]) =>
        fKey === key || fKey === 'price' || fVals.length === 0 || fVals.includes(item[fKey])
      )
    ).map(item => item[key])
  )];
};

const getFilteredPriceRanges = (data, filters) => {
  return priceRanges.filter(range => {
    return data.some(item => {
      const price = typeof item.price === 'string' ? Number(item.price.replace(/[\u20b9,]/g, '')) : Number(item.price);
      const matchesOtherFilters = Object.entries(filters).every(([key, vals]) => {
        if (key === 'price') return true;
        return vals.length === 0 || vals.includes(item[key]);
      });
      return matchesOtherFilters && price >= range.min && price < range.max;
    });
  });
};

const Watchgallery = ({ initialFilter = {} }) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(filterKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
  const [openSections, setOpenSections] = useState(filterKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}));
  const navigate = useNavigate();

  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/products')
  //     .then(res => setProducts(res.data))
  //     .catch(err => console.error('Failed to load products:', err));
  // }, []);
  useEffect(() => {
    axios.get('https://vantique.onrender.com/api/products')
      .then(res => {
        let filtered = res.data;

        // Apply initial filter (e.g., gender: 'men')
        Object.entries(initialFilter).forEach(([key, val]) => {
          filtered = filtered.filter(product => product[key] === val);
        });

        setProducts(filtered);
      })
      .catch(err => console.error('Failed to load products:', err));
  }, [initialFilter]);


  const handleCheckboxChange = (key, value) => {
    setFilters(prev => {
      const selected = prev[key];
      return {
        ...prev,
        [key]: selected.includes(value)
          ? selected.filter(val => val !== value)
          : [...selected, value]
      };
    });
  };

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = products.filter(item =>
    Object.entries(filters).every(([key, vals]) => {
      if (key === 'price' && vals.length > 0) {
        return vals.some(label => {
          const range = priceRanges.find(r => r.label === label);
          return item.price >= range.min && item.price <= range.max;
        });
      }
      return vals.length === 0 || vals.includes(item[key]);
    })
  );

  return (
    <div className="flex gap-8 px-20 py-5">
      <div className="w-1/4 pr-2 sticky top-16 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        {filterKeys.map((key) => {
          const isOpen = openSections[key];
          const filterOptions =
            key === 'price'
              ? getFilteredPriceRanges(products, filters).map(p => p.label)
              : getUniqueValues(products, key, filters);

          return (
            <div key={key} className="mb-4">
              <button
                onClick={() => toggleSection(key)}
                className="flex items-center text-left text-gray-800 capitalize text-1xl"
              >
                {isOpen ? <FaChevronUp className="mr-2 text-xs" /> : <FaChevronDown className="mr-2 text-xs" />}
                {key.replace(/([A-Z])/g, ' $1')}
              </button>
              {isOpen && (
                <div className="pl-5 mt-2 space-y-1">
                  {filterOptions.map((val, idx) => (
                    <label key={idx} className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        value={val}
                        checked={filters[key].includes(val)}
                        onChange={() => handleCheckboxChange(key, val)}
                        className="mr-2"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-3/4">
        <h2 className="text-xl font-bold mb-6">Watches</h2>
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {filteredData.map((watch, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-200 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${watch._id}`)}
              >
                <img
                  src={watch.image}
                  alt={`Watch ${index + 1}`}
                  className="w-full h-70 object-cover rounded-t-lg bg-transparent"
                />
                <div className="p-1 space-y-1 text-center">
                  <h3 className="text-base font-semibold text-gray-800">{watch.brand}</h3>
                  <p className="text-sm text-gray-600">{watch.gender} | {watch.type}</p>
                  <p className="text-lg font-bold text-gray-800">₹{watch.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No watches found matching the filters.</p>
        )}
      </div>
    </div>
  );
};

export default Watchgallery;
