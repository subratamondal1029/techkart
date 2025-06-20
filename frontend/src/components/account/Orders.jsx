import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircle, ViewIcon } from "lucide-react";
import { Button, Image, LoadingError, OrderStatus } from "../";
import { useInfiniteScroll } from "../../hooks";
import { storeOrders } from "../../store/order.slice";
import orderService from "../../services/order.service";
import fileService from "../../services/file.service";

const Orders = () => {
  const dispatch = useDispatch();
  const { page: initialPage, data: orders } = useSelector(
    (state) => state.orders
  );
  const totalPages = useRef(initialPage + 1 || 2);

  const fetchOrders = async ({ page }) => {
    const { data } = await orderService.getMany({ page });
    const pages = Number(data?.totalPages);

    totalPages.current = isNaN(pages) ? 1 : pages;
    if (data?.orders?.length === 0) return;
    dispatch(storeOrders({ data: data.orders, page }));
  };

  const {
    sentinelRef: loaderRef,
    page,
    isLoading,
    error,
    retry,
  } = useInfiniteScroll(fetchOrders, {}, initialPage + 1);

  return (
    <div className="w-full md:w-3/4 space-y-5">
      <div className="w-full px-5 py-3 min-h-5 rounded-md">
        <h3 className="font-bold text-2xl">Order List</h3>
        <hr className="mt-3" />
      </div>
      {orders.map((order) => (
        <div className="w-full shadow-sm rounded-md px-5 py-2" key={order._id}>
          <div className="w-full">
            <div className="flex justify-between items-center pb-3 flex-wrap sm:flex-nowrap">
              <h3 className="font-bold text-lg md:text-xl">
                Order #{order._id}
              </h3>
              <OrderStatus order={order} />
            </div>
            <hr />
          </div>
          {order?.cart?.products?.map(({ product, quantity }) => (
            <div
              className="w-full flex flex-col justify-start sm:justify-between sm:flex-row items-center"
              key={product?._id}
            >
              <div className="w-full space-y-5  mt-2 sm:mt-5">
                <Image
                  src={fileService.get(product?.image)}
                  alt={product?.name}
                  className="w-40 h-auto rounded-lg"
                />
                <p className="text-gray-500 font-semibold max-w-72 truncate">
                  {product?.name}
                </p>
              </div>
              <div className="w-full text-right sm:pt-10">
                <p className="font-semibold">
                  ₹ {product?.price?.toLocaleString("en-IN")}
                </p>
                <p className="font-semibold">Quantity: {quantity}</p>
              </div>
              <hr />
            </div>
          ))}

          <Link to={`/orders/${order._id}`} className="flex justify-end">
            <Button type="button">
              <ViewIcon size={20} className="mr-2" />
              View
            </Button>
          </Link>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="flex justify-center items-center flex-col space-y-2">
          <p className="text-gray-500 mt-2">No orders found</p>
          <Link
            className="inline-block text-sm text-gray-600 transition hover:text-gray-700 hover:underline hover:underline-offset-4"
            to="/"
          >
            Continue shopping →
          </Link>
        </div>
      )}

      {error ? (
        <LoadingError error={error} retry={retry} />
      ) : (
        (page - 1 < totalPages.current || isLoading) && (
          <div className="w-full flex justify-center items-center">
            <LoaderCircle size={40} className="animate-spin" ref={loaderRef} />
          </div>
        )
      )}
    </div>
  );
};

export default Orders;
