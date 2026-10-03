import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const [discountCode, setDiscountCode] = useState('');
  
  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.variant ? parseFloat(item.variant.price_adjustment || 0) + parseFloat(item.product.price) : parseFloat(item.product.price);
    return total + (itemPrice * item.quantity);
  }, 0);

  // Placeholder logic for layout completeness
  const discount = 0; // e.g. 0.1 * subtotal if valid discount
  const deliveryFee = items.length > 0 ? 50 : 0;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-medium text-gray-500 mb-4">Your cart is empty.</h2>
          <Link to="/" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Product List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Header Row */}
              <div className="hidden sm:flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-600">
                <div className="flex-1">Product Details</div>
                <div className="w-32 text-center">Quantity</div>
                <div className="w-24 text-center">Total</div>
                <div className="w-16 text-center">Action</div>
              </div>

              {/* Items */}
              <ul className="divide-y divide-gray-100">
                {items.map((item) => {
                  const price = parseFloat(item.product.price) + (item.variant ? parseFloat(item.variant.price_adjustment || 0) : 0);
                  const maxStock = item.variant ? item.variant.stock : item.product.stock;

                  return (
                    <li key={item.cartItemId} className="flex items-center px-6 py-6 transition-colors hover:bg-gray-50/50">
                      
                      {/* Product Details */}
                      <div className="flex flex-1 items-center gap-4">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                          <img
                            src={item.product.image_url || 'https://via.placeholder.com/150'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                            <Link to={`/product/${item.product.id}`} className="hover:text-black">
                              {item.product.name}
                            </Link>
                          </h3>
                          {item.variant ? (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.variant.name}: {item.variant.value}
                            </p>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">Category: {item.product.category || 'Standard'}</p>
                          )}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="w-32 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden">
                          <button 
                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors font-medium text-lg"
                            onClick={() => dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity - 1 }))}
                          >
                            −
                          </button>
                          <span className="px-3 py-1.5 text-sm font-semibold w-10 text-center">{item.quantity}</span>
                          <button 
                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors font-medium text-lg"
                            onClick={() => {
                              if (item.quantity < maxStock) {
                                dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity + 1 }));
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="w-24 text-center font-bold text-gray-900 text-lg">
                        ₹{(price * item.quantity).toFixed(2)}
                      </div>

                      {/* Action */}
                      <div className="w-16 flex justify-center">
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          onClick={() => dispatch(removeFromCart(item.cartItemId))}
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Discount Input */}
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Discount voucher" 
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className="font-medium text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Warranty / Guarantee info */}
              <div className="flex gap-3 mb-6 bg-gray-50 p-4 rounded-xl items-start">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-gray-500 leading-relaxed">
                  90 Day Limited Warranty against manufacturer's defects. <span className="font-semibold text-gray-700 cursor-pointer hover:underline">Details</span>
                </p>
              </div>

              <button 
                className="w-full bg-black text-white rounded-full py-4 font-bold text-base hover:bg-gray-800 transition-colors"
                onClick={() => navigate('/checkout')}
              >
                Checkout Now
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;
