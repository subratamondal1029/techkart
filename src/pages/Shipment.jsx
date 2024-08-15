import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, ButtonLoading, OrderStatus } from "../components";
import appWriteDb from "../appwrite/DbServise";
import { toast } from "react-toastify";
import appWriteStorage from "../appwrite/storageService";
import { generatePdf } from "../../invoiceGen";

const Shipment = () => {
  const { userData } = useSelector((state) => state.auth);
  const [displayOrders, setDisplayOrders] = useState([]);
  const { products: allproduct } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);

  if (!userData?.labels.includes("shipment")) {
    return (
      <div className="text-center flex justify-center items-center flex-col">
        <h1 className="font-bold text-3xl pt-20 min-h-64">
          To access this page you need to be a Shipment master
        </h1>
        <Link
          to="/"
          type="button"
          className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go back
        </Link>
      </div>
    );
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const getedOrders = await appWriteDb.getOrders();
        if (getedOrders) {
          let orders = [];
          getedOrders.forEach((order) => {
            const createdOrder = {
              orderId: order.$id,
              customerName: order.name,
              date: order.date,
              address: order.address,
              contact: order.phone,
              cart: order.cart.map((product) => JSON.parse(product)),
              isShipped: order.isShipped,
              isDeliverd: order.isDeliverd,
            };

            order.isShipped
              ? orders.push(createdOrder)
              : orders.unshift(createdOrder);
          });

          setDisplayOrders(orders);
        } else console.warn("Something went wrong");
      } catch (error) {
        console.warn(error.message);
        toast.error("Somthing went wrong");
      }
    }

    fetchData();
  }, []);

  const handleUpdate = async (orderId) => {
    setIsLoading(orderId);
    const order = displayOrders.find((order) => order.orderId === orderId);
    const products = order.cart.map((cartProduct) => {
      const product = allproduct.find(
        (product) => product.$id === cartProduct.productId
      );
      return {
        quantity: cartProduct.quantity,
        name: product.name,
        price: product.price,
      };
    });

    try {
      const invoicePdf = await generatePdf("shipped", {
        orderId,
        date: order.date,
        customerName: order.customerName,
        address: order.address,
        contact: order.contact,
        products,
      });

      if (invoicePdf) {
        const ordersStatusChange = await appWriteDb.updateOrder(orderId, {
          isShipped: true,
        });

        if (ordersStatusChange) {
          const uploadInvoice = await appWriteStorage.uploadInvoice(
            "shipped",
            invoicePdf,
            orderId
          );
          if (uploadInvoice) {
            setDisplayOrders((prev) =>
              prev.map((order) =>
                order.orderId === orderId ? { ...order, isShipped: true } : order
              )
            );
          }
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.warn(error);
    }
    setIsLoading(null);
  };

  const downloadInvoice = async (orderId) => {
    try {
      const downloadLink = await appWriteStorage.getDownloadLink(orderId)
      if (downloadLink) {
        window.open(downloadLink, "_blank");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-[45vh]">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black text-white border border-gray-700">
          <thead className="bg-gray-800 hidden text-left md:table-header-group">
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Order ID</th>
              <th className="py-2 px-4 border-b border-gray-700">
                Customer Name
              </th>
              <th className="py-2 px-4 border-b border-gray-700">Date</th>
              <th className="py-2 px-4 border-b border-gray-700">Address</th>
              <th className="py-2 px-4 border-b border-gray-700">
                Total Products
              </th>
              <th className="py-2 px-4 border-b border-gray-700">Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-3 md:table-row-group">
            {displayOrders.map((shipment) => (
              <tr
                key={shipment.orderId}
                className={`even:bg-gray-100 odd:bg-gray-50 hover:bg-gray-200 text-black`}
              >
                <td className="py-2 px-4 border-b border-gray-700 flex justify-between items-center cursor-default md:table-cell">
                  <span className="block font-semibold md:hidden">
                    Order ID:
                  </span>
                  {shipment.orderId}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 flex justify-between items-center cursor-default md:table-cell">
                  <span className="block font-semibold md:hidden">
                    Customer Name:
                  </span>
                  {shipment.customerName}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 flex justify-between items-center cursor-default md:table-cell">
                  <span className="block font-semibold md:hidden">
                    Customer Name:
                  </span>
                  {shipment.date}
                </td>
                <td
                  className="py-2 px-4 border-b border-gray-700 flex justify-between items-center cursor-help md:table-cell"
                  title={shipment.address}
                >
                  <span className="block font-semibold md:hidden">
                    Address:
                  </span>
                  <p className="md:max-w-24 max-w-44 truncate ">
                    {shipment.address}
                  </p>
                </td>
                <td className="py-2 px-4 border-b border-gray-700 flex justify-between items-center cursor-default md:table-cell">
                  <span className="block font-semibold md:hidden">
                    Total Product:
                  </span>
                  {shipment.cart.length}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 flex justify-between items-center md:table-cell">
                  <span className="block font-semibold md:hidden">Status:</span>
                  <OrderStatus order={shipment} classname="mt-0" />
                </td>
                <td className="py-2 px-4 border-b border-gray-700 flex justify-between items-center md:table-cell">
                  <span className="block font-semibold md:hidden">Action:</span>
                  <Button
                    onClick={() =>
                      shipment.isShipped
                        ? downloadInvoice(shipment.orderId)
                        : handleUpdate(shipment.orderId)
                    }
                    classname="h-9 flex items-center min-w-20"
                    disabled={isLoading === shipment.orderId}
                  >
                    {isLoading === shipment.orderId ? (
                      <ButtonLoading
                        classname="w-full"
                        fillColor="fill-black"
                      />
                    ) : shipment.isShipped ? (
                      "Invoice"
                    ) : (
                      "Dispatch"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipment;