import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';

// Make sure to call loadStripe outside of a component's render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // We handle the redirect manually for a smoother SPA experience
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const token = await getToken();
        await fetch(`${import.meta.env.VITE_API_URL}/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        });
      } catch (err) {
        console.error('Error confirming with backend:', err);
      }

      // Payment successful!
      setMessage('Payment successful! Your order has been placed.');
      dispatch(clearCart());
      setTimeout(() => {
        navigate('/'); // Redirect to home or an order success page
      }, 3000);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <PaymentElement />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full flex justify-center items-center px-6 py-4 mt-8 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : "Complete Payment"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div className={`text-center text-sm font-medium mt-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { items } = useSelector(state => state.cart);
  const { getToken } = useAuth();

  useEffect(() => {
    if (items.length === 0) return;

    const createPaymentIntent = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-intent`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret returned", data.error);
        }
      } catch (err) {
        console.error("Error fetching payment intent:", err);
      }
    };

    createPaymentIntent();
  }, [items, getToken]);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty!</h2>
        <p className="text-gray-500">Add some items before proceeding to checkout.</p>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      spacingUnit: '5px',
      borderRadius: '12px',
      colorSuccess: '#10b981',
      spacingGridRow: '18px'
    },
    rules: {
      '.Input': {
        border: '1px solid #e5e7eb',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      },
      '.Input:focus': {
        border: '1px solid #4f46e5',
        boxShadow: '0px 0px 0px 2px rgba(79, 70, 229, 0.2)',
      },
      '.Label': {
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px'
      }
    }
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.variant ? parseFloat(item.variant.price) : parseFloat(item.product.price);
    return total + (itemPrice * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Complete your order
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            You're almost there! Review your items and complete checkout securely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
          
          {/* Order Summary (Left/Top) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-8">
              <div className="px-6 py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <h2 className="text-xl font-bold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  Order Summary
                </h2>
              </div>
              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const price = item.variant ? parseFloat(item.variant.price) : parseFloat(item.product.price);
                    return (
                      <li key={item.cartItemId} className="py-5 flex items-center group">
                        <div className="relative shrink-0 overflow-hidden rounded-xl bg-gray-100 w-20 h-20">
                          {item.product.image_url ? (
                            <img src={item.product.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.product.name}</h3>
                          {item.variant && <p className="mt-1 text-xs text-gray-500 font-medium">Variant: {item.variant.name}</p>}
                        </div>
                        <p className="text-base font-bold text-gray-900 ml-4">${(price * item.quantity).toFixed(2)}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between text-base font-medium text-gray-500 mb-2">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-500 mb-4">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 border-t border-gray-200 pt-4">
                  <p>Total Due</p>
                  <p className="text-indigo-600">${subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Payment Form (Right/Bottom) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <div className="flex space-x-2">
                  <svg className="h-6" viewBox="0 0 38 24" fill="none"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.3 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z" fill="#000" fillOpacity=".1"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#1434CB"/><path d="M17.4 17.6l2.1-10.7h-2.7l-2.1 10.7h2.7zM11.6 6.9L8.7 14.5l-.3-1.6L7.2 7.7C7 7.2 6.5 6.9 6 6.9H1.4l-.1.4c1 .3 2.1.8 2.7 1.1l2.3 9.2h2.8l4.4-10.7h-1.9zM24 7.1c-.8-.3-2.1-.5-3.3-.5-3.5 0-6 1.8-6.1 4.5-.1 1.9 1.7 3 3 3.7 1.4.7 1.9 1.2 1.9 1.8 0 1-.1 1.5-1.9 1.5-1.5 0-2.3-.2-3.1-.6l-.4-.2-.4 2.8c.8.4 2.2.7 3.8.7 3.8 0 6.3-1.9 6.4-4.7 0-1.5-.9-2.6-2.9-3.6-1.3-.6-2.1-1-2.1-1.7 0-.6.7-1.4 2-1.4 1.2 0 2 .2 2.6.5l.3.1.4-2.8zM31.2 6.9H29c-.6 0-1.1.3-1.4.9l-4 9.8h2.8l.6-1.6h3.4l.3 1.6h2.5L31.2 6.9zm-2.4 6.7l1.3-3.6 1 3.6h-2.3z" fill="#fff"/></svg>
                  <svg className="h-6" viewBox="0 0 38 24" fill="none"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.3 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z" fill="#000" fillOpacity=".1"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#FF5F00"/><path d="M22.8 12a7.1 7.1 0 110-10.2 7.1 7.1 0 000 10.2z" fill="#EB001B"/><path d="M22.8 12a7.1 7.1 0 100-10.2 7.1 7.1 0 010 10.2z" fill="#F79E1B"/></svg>
                </div>
              </div>
              
              {clientSecret ? (
                <Elements key={clientSecret} options={options} stripe={stripePromise}>
                  <CheckoutForm clientSecret={clientSecret} />
                </Elements>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500 font-medium">Securing connection to Stripe...</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Payments are encrypted and PCI compliant
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
