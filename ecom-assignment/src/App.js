import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductCatalog from './Products'; // adjust the path as needed
import ProductDetail from './ProductDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductCatalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;