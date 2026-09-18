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
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div className="text-center text-sm font-medium mt-4 text-gray-700">{message}</div>}
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
  };
  const options = {
    clientSecret,
    appearance,
  };

  const subtotal = items.reduce((total, item) => {
    const itemPrice = parseFloat(item.product.price) + 
      (item.variant ? parseFloat(item.variant.price_adjustment) : 0);
    return total + (itemPrice * item.quantity);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-200 mb-6">
          {items.map((item) => {
            const price = parseFloat(item.product.price) + (item.variant ? parseFloat(item.variant.price_adjustment) : 0);
            return (
              <li key={item.cartItemId} className="py-4 flex">
                <img src={item.product.image_url} alt="" className="w-16 h-16 rounded object-cover border" />
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                  {item.variant && <p className="text-sm text-gray-500">{item.variant.name}: {item.variant.value}</p>}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${(price * item.quantity).toFixed(2)}</p>
              </li>
            )
          })}
        </ul>
        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
          <p>Total</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Stripe Payment Form */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
        {clientSecret ? (
          <Elements key={clientSecret} options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500 animate-pulse">Securely loading payment gateway...</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Checkout;
