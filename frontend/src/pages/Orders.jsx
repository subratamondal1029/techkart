import React, { useEffect, useState } from "react";
import { Button, ButtonLoading, OrderStatus } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import appWriteDb from "../appwrite/DbServise";
import appWriteStorage from "../appwrite/storageService";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { login } from "../store/authSlice";
import { Query } from "appwrite";

export default function Orders() {
  const orders = useSelector((state) => state.auth.otherData.orders);
  const cart = useSelector((state) => state.auth.otherData.cart);
  const { products: allProducts } = useSelector((state) => state.products);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState({
    date: "",
    id: "",
    products: [],
    userId: "",
    name: "",
    phone: "",
    address: "",
    isShipped: false,
    isDelivered: false,
  });

  useEffect(() => {
    if (!orderId) navigate("/account");
    const getProducts = (cart) => {
      return cart
        .map((product) => JSON.parse(product))
        .map((cartProduct) => {
          const productDetails = allProducts.find(
            (product) => product.$id === cartProduct.productId
          );
          return {
            id: productDetails.$id,
            quantity: cartProduct.quantity,
            name: productDetails.name,
            price: productDetails.price,
            imageSrc: productDetails.image,
          };
        });
    };

    const order = orders
      .filter((order) => order.$id === orderId)
      .map((order) => ({
        date: order.date,
        id: order.$id,
        products: getProducts(order.cart),
        userId: order.userId,
        name: order.name,
        phone: order.phone,
        address: order.address,
        isShipped: order.isShipped,
        isDelivered: order.isDeliverd,
      }));
    if (order.length === 0) {
      navigate("/account");
    }
    setOrder(order[0]);
  }, []);

  const calTotal = () => {
    let total = 0;
    order?.products.forEach((product) => {
      total += Number(product.price) * product.quantity;
    });
    return total.toLocaleString("en-IN");
  };

  const downloadInvoice = async () => {
    try {
      const downloadLink = await appWriteStorage.getDownloadLink(
        `${order.id}_invoice`
      );
      if (downloadLink) {
        window.open(downloadLink, "_blank");
      } else throw new Error("Something went wrong");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteOrder = async () => {
    setIsLoading(true);
    try {
      const deleteOrder = await appWriteDb.deleteOrder(orderId);
      if (deleteOrder) {
        const newOrders = orders.map((order) => {
          if (order.$id !== orderId) return order.$id;
        });
        const res = await appWriteDb.addOrder(newOrders, order.userId);
        if (res) {
          const allorders = await appWriteDb.getOrders([
            Query.equal("userId", order.userId),
          ]);
          dispatch(
            login({
              otherData: {
                orders: allorders,
                cart: [...cart],
                isCartCreated: true,
              },
            })
          );
          toast.success("Order deleted successfully");
          navigate("/account");
        } else throw new Error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto my-4 max-w-4xl md:my-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product List */}
          <div className="px-5 py-6 md:border-r md:border-r-gray-200 md:px-8">
            <div className="flow-root">
              <ul className="-my-7 divide-y divide-gray-200">
                {order?.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-stretch justify-between space-x-5 py-7"
                  >
                    <div className="flex flex-1 items-stretch">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
                          src={product.imageSrc}
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
                          x {product.quantity}
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
              <hr className="mt-6 border-gray-200" />
              <ul className="mt-6 space-y-3">
                <li className="flex items-center justify-between">
                  <p className="text-sm font-medium">Sub total</p>
                  <p className="text-sm font-medium">₹ {calTotal()}</p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="text-sm font-medium ">Total</p>
                  <p className="text-sm font-bold ">₹ {calTotal()}</p>
                </li>
              </ul>
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
                    Order Number: #{order?.id}
                  </p>
                  <p className="text-xs font-medium text-gray-700">
                    Date: {order?.date}
                  </p>
                  {order?.isDelivered && (
                    <Button
                      type="button"
                      classname="mt-3 flex justify-center items-center"
                      onClick={downloadInvoice}
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
                    {order?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-700">
                    {order?.address}
                  </p>
                  <p className="text-xs font-medium text-gray-700">
                    {order?.phone}
                  </p>
                </div>
                <div className="py-6">
                  <h2 className="text-base font-bold text-black">Status</h2>
                  <div className="flex items-center justify-between">
                    <OrderStatus order={order} />
                    {order.isDelivered || (
                      <Button
                        type="button"
                        classname="flex justify-center items-center h-9 disabled:cursor-not-allowed disabled:bg-black/50"
                        disabled={isLoading}
                        onClick={deleteOrder}
                      >
                        {isLoading ? (
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
  );
}
