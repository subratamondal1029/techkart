import React from "react";

const OrderStatus = ({ order, classname = "" }) => {
  const statusData = {
    shipped: {
      status: "Shipped",
      bgColor: "bg-blue-200",
      textColor: "text-blue-700",
    },
    delivered: {
      status: "Delivered",
      bgColor: "bg-green-200",
      textColor: "text-green-700",
    },
    inProcess: {
      status: "In Process",
      bgColor: "bg-orange-200",
      textColor: "text-orange-700",
    },
    cancelled: {
      status: "Cancelled",
      bgColor: "bg-red-200",
      textColor: "text-red-700",
    },
    refund: {
      status: "Refunded",
      bgColor: "bg-purple-200",
      textColor: "text-purple-700",
    },
  };
  const getStatus = () => {
    if (order?.isRefund) return statusData.refund;
    if (order?.isCancelled) return statusData.cancelled;
    if (order?.isDelivered && !order?.cancelled) return statusData.delivered;
    if (order?.isShipped && !order?.isDelivered) return statusData.shipped;
    return statusData.inProcess;
  };

  const { status, bgColor, textColor } = getStatus();

  return (
    <span
      className={`mt-3 text-xs font-medium ${textColor} ${bgColor} p-2 rounded-full select-none ${classname}`}
    >
      {status}
    </span>
  );
};

export default OrderStatus;
