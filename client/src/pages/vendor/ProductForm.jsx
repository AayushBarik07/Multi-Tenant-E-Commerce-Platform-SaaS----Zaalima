import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const ProductForm = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // 'new' or product ID
  const isEditing = id && id !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [variants, setVariants] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'ACTIVE',
    image_url: '',
    brand_id: ''
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const token = await getToken();
        // Get store ID first
        const storeRes = await fetch(`${import.meta.env.VITE_API_URL}/stores/my/store`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const storeData = await storeRes.json();
        
        let foundStoreId = null;
        if (storeData.success && storeData.store) {
          foundStoreId = storeData.store.id;
          setStoreId(foundStoreId);
          
          // Fetch brands for this store
          const brandsRes = await fetch(`${import.meta.env.VITE_API_URL}/brands?store_id=${foundStoreId}`);
          const brandsData = await brandsRes.json();
          if (brandsData.success) {
            setBrands(brandsData.brands);
          }
        } else {
          setError('You must create a store before adding products.');
          setLoading(false);
          return;
        }

        // If editing, fetch product details
        if (isEditing) {
          const prodRes = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const prodData = await prodRes.json();
          if (prodData.success) {
            setFormData({
              name: prodData.product.name,
              description: prodData.product.description || '',
              price: prodData.product.price,
              stock: prodData.product.stock,
              status: prodData.product.status,
              image_url: prodData.product.image_url || '',
              brand_id: prodData.product.brand_id || ''
            });
            setVariants(prodData.product.variants || []);
          } else {
            setError('Product not found.');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEditing, getToken]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage('Uploading image...');
    setError('');
    
    try {
      const token = await getToken();
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
        setMessage('Image uploaded successfully!');
      } else {
        setError('Upload failed.');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      setError('Upload failed.');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = await getToken();
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/products/${id}`
        : `${import.meta.env.VITE_API_URL}/products`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          store_id: storeId
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
        if (!isEditing) {
          setTimeout(() => navigate('/vendor/products'), 1500);
        }
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const [newVariant, setNewVariant] = useState({ name: '', price: '', stock: 0 });
  const [addingVariant, setAddingVariant] = useState(false);

  const handleAddVariant = async (e) => {
    e.preventDefault();
    if (!newVariant.name) return;
    setAddingVariant(true);

    try {
      const token = await getToken();
      // If price is empty, default to base product price
      const variantPayload = {
        name: newVariant.name,
        price: newVariant.price !== '' ? parseFloat(newVariant.price) : parseFloat(formData.price),
        stock: parseInt(newVariant.stock) || 0
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}/variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(variantPayload)
      });
      const data = await res.json();
      if (data.success) {
        setVariants([...variants, data.variant]);
        setNewVariant({ name: '', price: '', stock: 0 });
      } else {
        alert(data.error || 'Failed to add variant');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding variant');
    } finally {
      setAddingVariant(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Delete this variant?')) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/variants/${variantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVariants(variants.filter(v => v.id !== variantId));
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting variant');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!storeId) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Link to="/vendor/products" className="text-gray-500 hover:text-gray-700 mr-4">
          &larr; Back
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>
      
      {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input 
              type="text" required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Brand Collection</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white"
              value={formData.brand_id || ''}
              onChange={e => setFormData({...formData, brand_id: e.target.value})}
            >
              <option value="">-- No Brand (Uncategorized) --</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
            <input 
              type="number" step="0.01" min="0" required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
            <input 
              type="number" min="0" required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-2 flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-md p-4">
              {formData.image_url ? (
                <div className="relative">
                  <img src={formData.image_url} alt="Product" className="w-24 h-24 object-cover rounded-md" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, image_url: ''})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload a PNG or JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium text-lg mb-8"
        >
          {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
        </button>
      </form>

      {/* VARIANTS SECTION - Only visible when editing an existing product */}
      {isEditing && (
        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Product Variants (Sizes, Colors, etc.)</h3>
          
          {/* List of existing variants */}
          {variants.length > 0 ? (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm border-b">
                    <th className="pb-2">Variant Details (e.g. Size M / Blue)</th>
                    <th className="pb-2">Exact Price ($)</th>
                    <th className="pb-2">Stock</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(v => (
                    <tr key={v.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{v.name}</td>
                      <td className="py-3">${parseFloat(v.price).toFixed(2)}</td>
                      <td className="py-3">{v.stock}</td>
                      <td className="py-3">
                        <button 
                          onClick={() => handleDeleteVariant(v.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mb-6 text-sm">No variants added yet. Add variants like "Small / Blue" below.</p>
          )}

          {/* Add Variant Form */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-4">Add New Variant</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Variant Name (e.g. Large / Red)</label>
                <input 
                  type="text" 
                  className="w-full rounded border p-2 text-sm" 
                  placeholder="Large / Red"
                  value={newVariant.name}
                  onChange={e => setNewVariant({...newVariant, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                <input 
                  type="number" step="0.01" 
                  className="w-full rounded border p-2 text-sm" 
                  placeholder={formData.price || "0.00"}
                  value={newVariant.price}
                  onChange={e => setNewVariant({...newVariant, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stock</label>
                <input 
                  type="number" 
                  className="w-full rounded border p-2 text-sm" 
                  placeholder="10"
                  value={newVariant.stock}
                  onChange={e => setNewVariant({...newVariant, stock: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={handleAddVariant}
              disabled={addingVariant || !newVariant.name}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded text-sm font-medium hover:bg-indigo-200 disabled:opacity-50"
            >
              {addingVariant ? 'Adding...' : '+ Add Variant'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
