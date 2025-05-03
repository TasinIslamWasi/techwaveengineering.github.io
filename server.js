// E-commerce Website with Admin Panel (React + Express + MongoDB - Full Stack)

// File: server.js (Express Backend)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  image: String
}));

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean
}));

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).send(newProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(5000, () => console.log('Server running on port 5000'));

// File: App.jsx (React Frontend)
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">E-Commerce Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="p-4 shadow rounded-xl">
            <img src={p.image} alt={p.name} className="w-full h-48 object-cover mb-2" />
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-600">${p.price}</p>
            {admin && (
              <button onClick={() => handleDelete(p._id)} className="text-red-600 mt-2">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
