import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, OrderStatus } from "../components";
import formateDate from "../utils/formateDate";
import { Truck } from "lucide-react";
import TruckAnimation from "../assets/truck-delivery.gif";
import useLoading from "../hooks/useLoading";
import orderService from "../services/order.service";
import { useDispatch } from "react-redux";
import { updateOrder } from "../store/order.slice";
import showToast from "../utils/showToast";
import fileService from "../services/file.service";

const Shipment = () => {
  const [orders, setOrders] = useState([]);
  const [dispatchId, setDispatchId] = useState(null);

  const [handleShipment, isDispatching, dispatchError] = useLoading(
    async (id) => {
      setDispatchId(id);
      const { data } = await orderService.changeStatus({
        id,
        isShipped: true,
      });

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...data, cart: o.cart } : o))
      );
    }
  );

  useEffect(() => {
    if (dispatchError) {
      showToast("error", dispatchError || "Something went wrong");
    }
  }, [dispatchError]);

  const downloadInvoice = async (id) => {
    const order = orders.find((order) => order._id === id);
    window.open(fileService.get(order.invoice), "_blank");
  };

  // TODO: implement pagination
  useEffect(() => {
    (async () => {
      const { data } = await orderService.getMany({ isShipment: true });
      setOrders(data.orders);
    })();
  }, []);

  return (
    <div className="mx-auto p-2 sm:p-4 min-h-[45vh]">
      <div className="overflow-x-auto lg:rounded-tl-lg lg:rounded-tr-lg">
        <table className="min-w-full text-white border border-none text-xs sm:text-sm">
          <thead className="bg-gray-800 hidden text-left lg:table-header-group">
            <tr>
              <th className="py-2 pl-2 border-b border-gray-700">Order ID</th>
              <th className="py-2 pl-2 border-b border-gray-700">
                Customer Name
              </th>
              <th className="py-2 pl-2 border-b border-gray-700">Date</th>
              <th className="py-2 pl-2 border-b border-gray-700">Address</th>
              <th className="py-2 pl-2 border-b border-gray-700">
                Total Products
              </th>
              <th className="py-2 pl-2 border-b border-gray-700">Status</th>
              <th className="py-2 px-2 lg:pl-2 border-b border-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-3 lg:table-row-group">
            {orders?.map((shipment) => (
              <tr
                key={shipment._id}
                className="even:bg-gray-100 odd:bg-gray-50 hover:bg-gray-200 text-black rounded-lg lg:rounded-none flex flex-col lg:table-row mb-2 lg:mb-0 shadow lg:shadow-none"
              >
                <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-700 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
                  <span className="block font-semibold lg:hidden mb-1">
                    Order ID:
                  </span>
                  <span
                    className="max-w-28 truncate w-full inline-block cursor-help"
                    title={shipment._id}
                  >
                    {shipment._id}
                  </span>
                </td>
                <td className="min-w-32 py-2  px-2 lg:pl-2 border-b border-gray-700 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
                  <span className="block font-semibold lg:hidden mb-1">
                    Customer Name:
                  </span>
                  {shipment.customerName}
                </td>
                <td className="min-w-32 py-2  px-2 lg:pl-2 border-b border-gray-700 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
                  <span className="block font-semibold lg:hidden mb-1">
                    Date:
                  </span>
                  {formateDate(shipment.orderDate)}
                </td>
                <td
                  className="min-w-32 py-2  px-2 lg:pl-2 border-b border-gray-700 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-help lg:table-cell"
                  title={shipment.address}
                >
                  <span className="block font-semibold lg:hidden mb-1">
                    Address:
                  </span>
                  <p className="truncate overflow-hidden whitespace-nowrap text-ellipsis w-full lg:max-w-24 max-w-44">
                    {shipment.address}
                  </p>
                </td>
                <td className="min-w-32 py-2  px-2 lg:pl-2 border-b border-gray-700 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
                  <span className="block font-semibold lg:hidden mb-1">
                    Total Products:
                  </span>
                  {shipment.cart.products.length}
                </td>
                <td className="min-w-32 py-2  px-2 lg:pl-2 border-b border-gray-700 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:table-cell">
                  <span className="block font-semibold lg:hidden mb-1">
                    Status:
                  </span>
                  <OrderStatus order={shipment} classname="mt-0" />
                </td>
                <td className="min-w-32 py-2 px-2 lg:pl-2 lg:border-b border-gray-800 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:table-cell">
                  <span className="block font-semibold lg:hidden mb-1">
                    Action:
                  </span>
                  <Button
                    onClick={() =>
                      shipment?.isShipped
                        ? downloadInvoice(shipment._id)
                        : handleShipment(shipment._id)
                    }
                    classname="h-9 flex items-center gap-2 min-w-28 mt-2 lg:mt-0 "
                    disabled={isDispatching}
                  >
                    {isDispatching && dispatchId === shipment._id ? (
                      <img
                        src={TruckAnimation}
                        alt="truck animation"
                        className="w-7 drop-shadow-md"
                      />
                    ) : !shipment?.isShipped ? (
                      <>
                        <Truck />
                        <span>Dispatch</span>
                      </>
                    ) : (
                      <>
                        <Download />
                        <span>Download</span>
                      </>
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
