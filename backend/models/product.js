// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brand: String,
  type: String,
  gender: String,
  price: Number,
  image: String,
  dialColor: String,
  caseShape: String,
  dialType: String,
  strapColor: String,
  strapMaterial: String,
  dialThickness: String,
  qty: Number
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
// module.exports = mongoose.model('Product', productSchema);
