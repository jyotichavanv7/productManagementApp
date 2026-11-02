import React, { useState, useEffect } from 'react';

export default function ProductApp() {
  const [products, setProducts] = useState([]);
  
  // Form input states
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const API_URL = 'http://localhost:8080/api/products'; 

  // 1. READ: Products fetch karne ke liye
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // Console screenshot ke hisaab se array data.allProducts me hai
      if (data && data.allProducts) {
        setProducts(data.allProducts);
      }
    } catch (error) {
      console.error("Fetch karne me error aaya:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form inputs handle karne ke liye (Force fully capturing keypress)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // 2. CREATE & UPDATE: Form submit handle karne ke liye
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isEditing ? `${API_URL}/${currentProductId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProducts(); // List refresh karein
        resetForm(); // Form clear karein
      } else {
        alert("Operation failed. Please check backend.");
      }
    } catch (error) {
      console.error("Save karne me error aaya:", error);
    }
  };

  // 3. EDIT CLICK: Card ke edit button par click hone par (Fresh State Update)
  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id || product.id);
    
    // String content and direct mapping to input values
    setFormData({
      name: String(product.name || ''),
      price: String(product.price || ''),
      description: String(product.description || '')
    });

    // Page ko smoothly upar scroll karein taaki user ko form dikhe
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // 4. DELETE: Product remove karne ke liye
  const handleDeleteClick = async (id) => {
    if (window.confirm("Kya aap is product ko delete karna chahte hain?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProducts(); // List refresh karein
        } else {
          alert("Delete failed.");
        }
      } catch (error) {
        console.error("Delete karne me error aaya:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '' });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#0f172a', fontWeight: '700', fontSize: '2.5rem', letterSpacing: '-0.05em' }}>
        Product Management App
      </h1>

      {/* MODERN FORM CONTAINER WITH EXPLICIT COLOR FIXES */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '16px',
        maxWidth: '550px',
        margin: '0 auto 50px auto',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#334155', fontSize: '1.25rem', fontWeight: '600' }}>
          {isEditing ? '⚡ Update Product Details' : '✨ Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1', 
              fontSize: '0.95rem', 
              backgroundColor: '#ffffff', 
              color: '#000000', // Global styling override karne ke liye clear dark black text
              outline: 'none',
              display: 'block',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleInputChange}
            required
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1', 
              fontSize: '0.95rem', 
              backgroundColor: '#ffffff', 
              color: '#000000', // Clear dark black text for price
              outline: 'none',
              display: 'block',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="5"
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1', 
              fontSize: '0.95rem', 
              backgroundColor: '#ffffff', 
              color: '#000000', // Clear dark black text for text-area
              outline: 'none', 
              resize: 'vertical',
              display: 'block',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm} 
                style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
            >
              {isEditing ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>

      {/* DASHBOARD GRID FOR DISPLAYING 3-4 PRODUCTS PER LINE */}
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem' }}>No products found. Add some above!</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {products.map((product) => (
            <div key={product._id} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: '600' }}>{product.name}</h3>
                <div style={{ color: '#0284c7', fontWeight: '700', fontSize: '1.25rem', marginBottom: '14px' }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </div>
                <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '0.925rem', lineHeight: '1.5' }}>
                  {product.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button 
                  onClick={() => handleEditClick(product)}
                  style={{ flex: 1, backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(product._id)}
                  style={{ flex: 1, backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
