import { useSelector, useDispatch } from 'react-redux';
import { closeCart, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state) => state.cart);

  if (!isOpen) return null;

  const subtotal = items.reduce((total, item) => {
    const itemPrice = parseFloat(item.product.price) + 
      (item.variant ? parseFloat(item.variant.price_adjustment) : 0);
    return total + (itemPrice * item.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={() => dispatch(closeCart())}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-500 sm:duration-700 translate-x-0">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => dispatch(closeCart())}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {items.length === 0 ? (
                    <p className="text-center text-gray-500 my-10">Your cart is empty.</p>
                  ) : (
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => {
                        const price = parseFloat(item.product.price) + (item.variant ? parseFloat(item.variant.price_adjustment) : 0);
                        const maxStock = item.variant ? item.variant.stock : item.product.stock;

                        return (
                          <li key={item.cartItemId} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.product.image_url || 'https://via.placeholder.com/150'}
                                alt={item.product.name}
                                className="w-full h-full object-center object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.product.name}</h3>
                                  <p className="ml-4">${(price * item.quantity).toFixed(2)}</p>
                                </div>
                                {item.variant && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.variant.name}: {item.variant.value}
                                  </p>
                                )}
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border rounded">
                                  <button 
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    onClick={() => dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity - 1 }))}
                                  >-</button>
                                  <span className="px-2 py-1">{item.quantity}</span>
                                  <button 
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    onClick={() => {
                                      if (item.quantity < maxStock) {
                                        dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity + 1 }));
                                      }
                                    }}
                                  >+</button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() => dispatch(removeFromCart(item.cartItemId))}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => alert('Checkout flow coming in Day 18!')}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
