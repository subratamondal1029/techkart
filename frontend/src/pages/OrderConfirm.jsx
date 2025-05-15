import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeCart } from "../store/cart.slice";
import { Check, ArrowRight } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [count, setCount] = useState(5);

  useEffect(() => {
    dispatch(storeCart(null));
    const interval = setInterval(() => {
      if (count === 0) {
        clearInterval(interval);
        return;
      }
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigateToOrder();
    }
  }, [count]);

  const navigateToOrder = useCallback(() => {
    if (orderId) {
      navigate(`/orders/${orderId}`);
    } else {
      navigate("/account/orders");
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-emerald-100 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 transition-all duration-500 animate-card-in">
        {/* Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="animate-checkmark">
            <Check className="w-20 h-20 text-emerald-500 stroke-[4px] transform translate-y-2" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-text-rise">
            Order Placed!
            <span className="block mt-2 text-emerald-500">Thank You</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed animate-text-rise delay-100">
            Your order has been successfully processed. We've sent a
            confirmation email to your address.
          </p>

          {/* Continue button */}
          <button
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 animate-button-in"
            onClick={navigateToOrder}
          >
            <span className="mr-3">Order Details ({count})</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
