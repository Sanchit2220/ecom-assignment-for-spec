// Import React and required hooks
import React, { useEffect, useState } from 'react';
// Import useParams to get the product ID from the URL, and Link for navigation
import { useParams, Link } from 'react-router-dom';
// Import Star icon for displaying product rating
import { Star } from 'lucide-react';

// ProductDetail component displays detailed info for a single product
function ProductDetail() {
  // Get the product ID from the URL
  const { id } = useParams();
  // State to hold product data
  const [product, setProduct] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to track errors
  const [error, setError] = useState(null);

  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    if (!id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }
    // Log the ID for debugging
    console.log('Fetching product with ID:', id);

    // Fetch product details from backend API
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Show loading state
  if (loading) return <div>Loading...</div>;
  // Show error state
  if (error) return <div>{error} (ID: {id ? id : 'undefined'})</div>;
  // Show message if no product found
  if (!product) return <div>No product data found for ID: {id}</div>;

  // Render product details
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)', padding: '3rem 0', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
        {/* Back to Products link */}
        <Link to="/" style={{
          position: 'absolute',
          left: 0,
          top: -48,
          textDecoration: 'none',
          color: '#2563eb',
          fontWeight: 600,
          background: 'rgba(255,255,255,0.7)',
          padding: '8px 20px',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          fontSize: 16,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#2563eb'; }}
        > 0 Back to Products</Link>
        <div style={{
          background: 'rgba(255,255,255,0.65)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
          padding: '2.5rem 2rem 2rem 2rem',
          position: 'relative',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #e0e7ef',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            {/* Product image */}
            <div style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 4px 32px rgba(37,99,235,0.10)',
              border: '4px solid #fff',
              marginBottom: 18,
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
            }}>
              <img
                src={product.image && product.image.trim() !== '' ? product.image : '/default-product.png'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            {/* Category badge */}
            <span style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              padding: '4px 18px',
              borderRadius: 999,
              letterSpacing: 1,
              marginBottom: 10,
              boxShadow: '0 1px 6px rgba(37,99,235,0.10)'
            }}>{product.category}</span>
          </div>
          {/* Product name */}
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1e293b', marginBottom: 10, textAlign: 'center', letterSpacing: -1 }}>{product.name}</h1>
          {/* Brand and rating */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 18 }}>
            <span style={{ fontWeight: 500, color: '#475569' }}>Brand: <span style={{ color: '#2563eb', fontWeight: 700 }}>{product.brand}</span></span>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 500, color: '#f59e42', background: '#fff7ed', borderRadius: 8, padding: '2px 10px', fontSize: 15, boxShadow: '0 1px 4px rgba(245,158,66,0.08)' }}>
              <Star size={18} style={{ marginRight: 4, color: '#f59e42' }} />
              {product.rating}
            </span>
          </div>
          {/* Price */}
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669', marginBottom: 24, textAlign: 'center', background: 'linear-gradient(90deg, #e0f2fe 0%, #f0fdf4 100%)', borderRadius: 12, padding: '8px 0', boxShadow: '0 1px 6px rgba(5,150,105,0.08)' }}>
            ${product.price}
          </div>
          {/* Description and details */}
          <div style={{ background: '#f1f5f9', borderRadius: 14, padding: 24, marginBottom: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.03)' }}>
            <p style={{ margin: 0, color: '#334155', fontSize: 18, lineHeight: 1.6 }}><b>Description:</b> {product.description}</p>
            <p style={{ margin: '12px 0 0 0', color: '#334155', fontSize: 17 }}><b>Color:</b> {product.color}</p>
            <p style={{ margin: '12px 0 0 0', color: '#334155', fontSize: 17 }}><b>Material:</b> {product.material}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;