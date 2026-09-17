import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../../redux/slices/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          // Auto-select first variant if available
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500">{error || 'Product not found'}</div>;

  const displayPrice = selectedVariant 
    ? parseFloat(product.price) + parseFloat(selectedVariant.price_adjustment) 
    : parseFloat(product.price);
    
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, variant: selectedVariant, quantity: 1 }));
    dispatch(openCart());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to={`/store/${product.store_id}`} className="text-indigo-600 hover:underline font-medium">
          &larr; Back to Store
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col-reverse">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden relative">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-96 object-cover object-center sm:h-full" />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">No Image Available</div>
            )}
            
            {displayStock <= 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded shadow">
                OUT OF STOCK
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">${displayPrice.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm text-gray-900 font-medium">Options ({product.variants[0].name})</h3>
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock <= 0}
                    className={`
                      border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1
                      ${selectedVariant?.id === variant.id 
                        ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700' 
                        : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                      }
                      ${variant.stock <= 0 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
                    `}
                  >
                    {variant.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm text-gray-500">{displayStock} in stock</p>
          </div>

          <div className="mt-8 flex">
            <button
              onClick={handleAddToCart}
              disabled={displayStock <= 0}
              className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-50 sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
