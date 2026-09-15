import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const StoreSettings = () => {
  const { getToken } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: ''
  });
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/my/store`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.store) {
        setStore(data.store);
        setFormData({
          name: data.store.name,
          description: data.store.description || '',
          logo_url: data.store.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch store', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage('Uploading image...');
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, logo_url: data.url }));
        setMessage('Image uploaded successfully!');
      } else {
        setMessage('Upload failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = await getToken();
      const method = store ? 'PATCH' : 'POST';
      const url = store 
        ? `${import.meta.env.VITE_API_URL}/stores/${store.id}`
        : `${import.meta.env.VITE_API_URL}/stores`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setMessage(store ? 'Store updated successfully!' : 'Store created successfully!');
        if (!store) {
          setStore(data.store);
        }
      } else {
        setMessage(data.error || 'Failed to save store');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to save store');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading store...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {store ? 'Store Settings' : 'Create Your Store'}
      </h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Name</label>
          <input 
            type="text" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Store Logo</label>
          <div className="mt-2 flex items-center gap-4">
            {formData.logo_url && (
              <img src={formData.logo_url} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : (store ? 'Update Store' : 'Create Store')}
        </button>
      </form>
    </div>
  );
};

export default StoreSettings;
