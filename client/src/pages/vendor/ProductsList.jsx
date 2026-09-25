import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const ProductsList = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    fetchVendorStoreAndProducts();
  }, []);

  const fetchVendorStoreAndProducts = async () => {
    try {
      const token = await getToken();
      
      // 1. Get current vendor's store
      const storeRes = await fetch(`${import.meta.env.VITE_API_URL}/stores/my/store`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const storeData = await storeRes.json();
      
      if (storeData.success && storeData.store) {
        setStoreId(storeData.store.id);
        
        // 2. Fetch products for this store
        const productsRes = await fetch(`${import.meta.env.VITE_API_URL}/products?store_id=${storeData.store.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const productsData = await productsRes.json();
        
        if (productsData.success) {
          setProducts(productsData.products);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error', error);
      alert('Failed to delete product');
    }
  };

  if (loading) return <div>Loading products...</div>;

  if (!storeId) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-yellow-800 border border-yellow-200">
        <h3 className="text-lg font-semibold mb-2">Store Required</h3>
        <p>You need to setup your Store Settings first before you can manage products.</p>
        <Link to="/vendor/store" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">
          Go to Store Settings &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Link 
          to="/vendor/products/new" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found. Click "Add Product" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-t">
                <th className="p-4 font-medium text-gray-600">Image</th>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Category</th>
                <th className="p-4 font-medium text-gray-600">Price</th>
                <th className="p-4 font-medium text-gray-600">Stock</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-800">{product.name}</td>
                  <td className="p-4 text-gray-600 text-sm">
                    {product.category ? (
                      <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="p-4">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link to={`/vendor/products/${product.id}`} className="text-indigo-600 hover:underline mr-4">Edit</Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
