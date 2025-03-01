import { ArrowLeft, LucideCheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const OrderConfirm = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const { state: orderId } = useLocation();

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }else{   
      const interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
  
      if (count === 0) {
        clearInterval(interval);
        navigate(`/orders/${orderId}`);
      }
      return () => clearInterval(interval);
    }
  }, [count]);

  return (
    <div className="w-full h-[45vh] flex justify-center items-center flex-col space-y-5">
      <div className="flex justify-center items-center bg-green-700 rounded-full p-5">
        <LucideCheckCircle2 size={100} className="text-white animate-pulse" />
      </div>

      <h1 className="text-3xl font-bold text-center">Order Confirmed</h1>

      <p className="text-center">
        Thank you for your order. We&apos;ll ship your goods as soon as
        possible.
      </p>

      <Link
        to={`/orders/${orderId}`}
        className="outline outline-2 text-black rounded-full py-2 px-4 flex items-center hover:bg-black hover:text-white transition"
      >
        <ArrowLeft size={16} className="mr-2" /> Track Status ({count})
      </Link>
    </div>
  );
};

export default OrderConfirm;
