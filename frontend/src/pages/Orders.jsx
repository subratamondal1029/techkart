import React, { useEffect, useState } from "react";
import { Button, ButtonLoading, Image, OrderStatus } from "../components";
import OrderShimmer from "../components/shimmers/Order.shimmer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { useLoading } from "../hooks";
import fileService from "../services/file.service";
import orderService from "../services/order.service";
import { addOrder } from "../store/order.slice";

export default function Orders() {
  const { id } = useParams();
  const existingOrder = useSelector((state) =>
    state.orders.find((order) => order._id === id)
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  const formateDate = (date) => {
    date = new Date(date);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const calCartTotal = (cart) => {
    return cart?.products?.reduce(
      (acc, cur) => acc + cur.product.price * cur.quantity,
      0
    );
  };

  const [fetchOrder, isFetchingOrder, orderError] = useLoading(async () => {
    const { data: order } = await orderService.getOne(id);
    dispatch(addOrder(order));
  });

  const [cancelOrder, isCancelling] = useLoading(async () => {
    const cancelRequest = orderService.cancel(id);

    toast.promise(cancelRequest, {
      pending: "Cancelling...",
      success: "Order cancelled successfully",
      error: "Failed to cancel order",
    });

    const { data } = await cancelRequest;
    dispatch(
      addOrder({
        ...order,
        isCancelled: data?.isCancelled,
        isRefund: data?.isRefund,
        updatedAt: data?.updatedAt,
        statusUpdateDate: data?.statusUpdateDate,
        invoice: data?.invoice,
      })
    );
  });

  const downloadInvoice = async (order) => {
    try {
      const downloadLink = fileService.get(order.invoice);
      window.open(downloadLink, "_blank");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (existingOrder) {
      setOrder(existingOrder);
    } else {
      fetchOrder();
    }
  }, [existingOrder, id]);

  if (isFetchingOrder) return <OrderShimmer />;

  return (
    order && (
      <div className="mx-auto my-4 max-w-4xl md:my-6">
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product List */}
            <div className="px-5 py-6 md:border-r md:border-r-gray-200 md:px-8">
              <div className="flex flex-col justify-between w-full h-full">
                <ul className="-my-7 divide-y divide-gray-200">
                  {order.cart?.products.map(({ product, quantity }) => (
                    <li
                      key={product._id}
                      className="flex items-stretch justify-between space-x-5 py-7"
                    >
                      <div className="flex flex-1 items-stretch">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-shrink-0"
                        >
                          <Image
                            className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
                            src={fileService.get(product.image)}
                            alt={product.name}
                          />
                        </Link>

                        <div className="ml-5 flex flex-col justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">
                              {product.name}
                            </p>
                          </div>
                          <p className="mt-4 text-sm font-medium text-gray-500">
                            x {quantity}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto flex flex-col items-end justify-between">
                        <p className="text-right text-sm font-bold text-gray-900">
                          ₹ {product.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div>
                  <hr className="mt-6 border-gray-200" />
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center justify-between">
                      <p className="text-sm font-medium">Sub total</p>
                      <p className="text-sm font-medium">
                        ₹ {calCartTotal(order.cart)}
                      </p>
                    </li>
                    <li className="flex items-center justify-between">
                      <p className="text-sm font-medium ">Total</p>
                      <p className="text-sm font-bold ">
                        ₹ {order.totalAmount}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Contact Info */}
            <div className="px-5 py-6 md:px-8">
              <div className="flow-root">
                <div className="-my-6 divide-y divide-gray-200">
                  <div className="py-6">
                    <h2 className="text-base font-bold text-black">
                      Shipping Information
                    </h2>
                    <p className="fontmedium mt-3 text-xs text-gray-700">
                      Order Number: #{order._id}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {formateDate(order.orderDate)}
                    </p>
                    {order.isDelivered && !order.isCancelled && (
                      <Button
                        type="button"
                        classname="mt-3 flex justify-center items-center"
                        onClick={() => downloadInvoice(order)}
                      >
                        <Download className="mr-2 h-4 w-4" size={20} /> Download
                        Invoice
                      </Button>
                    )}
                  </div>
                  <div className="py-6">
                    <h2 className="mb-2 text-base font-bold text-black">
                      Contact Information
                    </h2>
                    <p className="mt-3 text-xs font-medium text-gray-700">
                      {order.customerName}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {order.address}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {order.customerPhone}
                    </p>
                  </div>
                  <div className="py-6">
                    <h2 className="text-base font-bold text-black">Status</h2>
                    <div className="flex items-center justify-between">
                      <OrderStatus order={order} />
                      <p className="text-gray-500">
                        Update on: {formateDate(order.statusUpdateDate)}
                      </p>
                      {!order.isShipped && (
                        <Button
                          type="button"
                          classname="flex justify-center items-center h-9"
                          disabled={isCancelling}
                          onClick={cancelOrder}
                        >
                          {isCancelling ? (
                            <ButtonLoading fillColor="fill-black" />
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
