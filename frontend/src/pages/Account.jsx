import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import showToast from "../utils/showToast";
import { Briefcase, Camera, Mail, User2Icon, ViewIcon } from "lucide-react";

import { AccountInfoCard, Button, Image, OrderStatus } from "../components";
import authService from "../services/auth.service";
import fileService from "../services/file.service";
import orderService from "../services/order.service";
import { logout } from "../store/auth.slice";
import { storeOrders } from "../store/order.slice";
import { useLoading } from "../hooks";
import delay from "../utils/delay";

const Account = () => {
  const { userData } = useSelector((state) => state.auth);
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isOrder, setIsOrder] = useState(false);
  const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);

  // TODO: change ui for update user details with optimestic update
  const [handleLogout, isLogoutLoading] = useLoading(async () => {
    const logoutReq = authService.logout();

    dispatch(logout());
    navigate("/");
    toast.promise(logoutReq, {
      pending: "Logging out",
      success: "Logged out successfully",
      error: "Failed to Logout",
    });
  });

  const [fetchOrders, isOrdersLoading, ordersError] = useLoading(async () => {
    const { data: orders } = await orderService.getMany({ page: 1 });
    dispatch(storeOrders(orders));
    setIsOrdersLoaded(true);
  });

  // TODO: fetch order from server cart already polulated
  // TODO: fetch order with scroll page by page
  useEffect(() => {
    setIsOrder(params?.page === "orders" || false);
  }, [params]);

  useEffect(() => {
    if (isOrder && !isOrdersLoaded) {
      fetchOrders();
    }
  }, [isOrder]);

  return (
    <div className="w-full min-h-96 mt-5 px-5 md:px-28">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">TechKart Account</h1>
        <Button
          onClick={handleLogout}
          type="button"
          disabled={isLogoutLoading}
          classname="disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          Signout
        </Button>
      </div>
      <hr className="mt-5" />

      <div className="flex gap-20 mt-5 items-start lg:flex-row flex-col">
        <div className="w-60 flex flex-col place-self-start">
          <div>
            {/* TODO: add avatar update */}
            <div className="w-28 flex items-center justify-center relative rounded-full overflow-hidden cursor-pointer mx-auto">
              {userData?.avatar ? (
                <Image
                  src={userData?.avatar}
                  className=" w-full h-full"
                  alt="avatar"
                />
              ) : (
                <User2Icon className="text-gray-100 bg-black p-2 w-full h-full" />
              )}
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 w-full h-full flex justify-center items-center bg-blue-500/50 cursor-pointer transition-opacity duration-300 opacity-0 hover:opacity-100"
              >
                <Camera size={25} />
              </label>
              <input
                type="file"
                id="avatar"
                name="file"
                accept=".jpeg, .png, .jpg, .webp"
                className="hidden"
                onChange={() => {}}
              />
            </div>
            <h1 className="font-bold text-xl mt-3">{userData?.name}</h1>
            <h2 className="text-gray-500">{userData?.email}</h2>
          </div>
          <ul className="mt-5 flex flex-col items-start justify-center gap-3">
            <li
              // TODO: change section with url
              onClick={() => navigate("/account")}
              className="cursor-pointer hover:text-gray-700"
            >
              personal Information
            </li>
            <li
              onClick={() => navigate("/account/orders")}
              className="cursor-pointer hover:text-gray-700"
            >
              Orders History
            </li>
          </ul>
        </div>

        {!isOrder ? (
          <div className="flex flex-col w-3/4 space-y-5">
            <h1 className="font-bold text-2xl">Account Information</h1>
            <p className="text-gray-500">
              Update your account information here.
            </p>

            <div className="flex flex-wrap justify-start gap-3">
              <AccountInfoCard
                label="Name"
                logo={
                  <User2Icon
                    size={20}
                    className="text-gray-500 absolute top-3 right-3"
                  />
                }
                value={userData?.name}
              />
              <AccountInfoCard
                label="Email"
                logo={
                  <Mail
                    size={20}
                    className="text-gray-500 absolute top-3 right-3"
                  />
                }
                value={userData?.email}
              />
              <AccountInfoCard
                label="Role"
                logo={
                  <Briefcase
                    size={20}
                    className="text-gray-500 absolute top-3 right-3"
                  />
                }
                value={userData?.label || "user"}
              />
            </div>
          </div>
        ) : (
          <div className="w-full md:w-3/4 space-y-5">
            <div className="w-full px-5 py-3 shadow-sm min-h-5 rounded-md">
              <h3 className="font-bold text-2xl">Order List</h3>
              <hr className="mt-3" />

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
            </div>

            {orders.map((order) => (
              <div
                className="w-full shadow-sm rounded-md px-5 py-2"
                key={order._id}
              >
                <div className="w-full">
                  <div className="flex justify-between items-center pb-3 flex-wrap sm:flex-nowrap">
                    <h3 className="font-bold text-2xl">Order #{order._id}</h3>
                    <OrderStatus order={order} />
                  </div>
                  <hr />
                </div>
                {order?.cart?.products?.map(({ product, quantity }) => (
                  <div
                    className="w-full flex flex-col justify-start sm:justify-between sm:flex-row items-center"
                    key={product._id}
                  >
                    <div className="w-full space-y-5  mt-2 sm:mt-5">
                      <Image
                        src={fileService.get(product?.image)}
                        alt={product.name}
                        className="w-40 h-auto rounded-lg"
                      />
                      <p className="text-gray-500 font-semibold max-w-72 truncate">
                        {product.name}
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
                  <Button
                    type="button"
                    // classname="w-2/4 md:w-2/6 flex items-center justify-center py-2.5 mt-2 sm:mt-0"
                  >
                    <ViewIcon size={20} className="mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
