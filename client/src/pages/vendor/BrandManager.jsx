import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';

const BrandManager = () => {
  const { getToken } = useAuth();
  const dbUser = useSelector(state => state.auth.user);
  
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', logo_url: '' });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, logo_url: data.url }));
      } else {
        alert('Upload failed.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchStoreAndBrands = async () => {
      try {
        const token = await getToken();
        // First get the vendor's store
        const storeRes = await fetch(`${import.meta.env.VITE_API_URL}/stores/my/store`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const storeData = await storeRes.json();
        
        if (storeData.success && storeData.store) {
          setStoreId(storeData.store.id);
          
          // Then get brands for this store
          const brandRes = await fetch(`${import.meta.env.VITE_API_URL}/brands?store_id=${storeData.store.id}`);
          const brandData = await brandRes.json();
          if (brandData.success) {
            setBrands(brandData.brands);
          }
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndBrands();
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeId) return;

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          store_id: storeId,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        setBrands([data.brand, ...brands]);
        setIsAdding(false);
        setFormData({ name: '', description: '', logo_url: '' });
      }
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand? Products assigned to it will become uncategorized.')) return;

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/brands/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBrands(brands.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Brands</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {isAdding ? 'Cancel' : 'Add New Brand'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-bold mb-4">Add a New Brand Collection</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. Nike, Winter Collection..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Logo Image</label>
              
              {formData.logo_url && (
                <div className="mt-2 mb-4">
                  <img src={formData.logo_url} alt="Logo preview" className="h-32 w-32 object-cover rounded-md border border-gray-200" />
                </div>
              )}

              <div className="mt-1 flex items-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 cursor-pointer"
                  disabled={uploading}
                />
                {uploading && <span className="ml-3 text-sm text-gray-500">Uploading...</span>}
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                Save Brand
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        {brands.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't created any Brands yet. Click "Add New Brand" to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {brands.map(brand => (
              <li key={brand.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="h-16 w-16 object-cover rounded-md border border-gray-200 mr-4" />
                  ) : (
                    <div className="h-16 w-16 bg-indigo-50 text-indigo-500 flex items-center justify-center rounded-md border border-indigo-100 mr-4 font-bold text-xl">
                      {brand.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{brand.name}</h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">{brand.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(brand.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BrandManager;
