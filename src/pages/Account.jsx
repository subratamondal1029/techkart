import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccountInfoCard, Button, OrderStatus } from "../components";
import { Briefcase, Languages, Mail, User2Icon, ViewIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import appwriteAuth from "../appwrite/authService";
import { logout } from "../store/authSlice";

const Account = () => {
  const { userData, otherData } = useSelector((state) => state.auth);
  const { products: allProducts } = useSelector((state) => state.products);
  const [orders, setOrders] = useState([]);
  const [section, setSection] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await appwriteAuth.logout();
      if (res) {
        dispatch(logout());
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Failed to Logout");
      console.log("handleLogout :: error", error);
    }
  };

  useEffect(() => {
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

    const orders = otherData.orders.map((order) => ({
      date: order.date,
      id: order.$id,
      products: getProducts(order.cart),
      isShipped: order.isShipped,
      isDelivered: order.isDeliverd,
    }));

    setOrders(orders.reverse());
  }, []);

  return (
    <div className="w-full min-h-96 mt-5 px-5 md:px-28">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">TechKart Account</h1>
        <Button onClick={handleLogout} type="button">
          Signout
        </Button>
      </div>
      <hr className="mt-5" />

      <div className="flex gap-20 mt-5 items-center lg:flex-row flex-col">
        <div className="w-60 flex flex-col place-self-start">
          <div>
            <User2Icon
              size={90}
              className="text-gray-100 bg-black rounded-full p-2"
            />
            <h1 className="font-bold text-2xl mt-3">{userData?.name}</h1>
            <h2 className="text-gray-500">{userData?.email}</h2>
          </div>
          <ul className="mt-5 flex flex-col items-start justify-center gap-3">
            <li
              onClick={() => setSection(0)}
              className="cursor-pointer hover:text-gray-700"
            >
              personal Information
            </li>
            <li
              onClick={() => setSection(1)}
              className="cursor-pointer hover:text-gray-700"
            >
              Orders History
            </li>
          </ul>
        </div>

        {section === 0 ? (
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
                value={userData?.labels[0] ? userData?.labels[0] : "User"}
              />
              <AccountInfoCard
                label="Language"
                logo={
                  <Languages
                    size={20}
                    className="text-gray-500 absolute top-3 right-3"
                  />
                }
                value="English"
              />
            </div>
          </div>
        ) : (
          <div className="w-full md:w-3/4 space-y-5">
            <div className="w-full px-5 py-3 shadow-sm min-h-5 rounded-md">
              <h3 className="font-bold text-2xl">Order List</h3>
              <hr className="mt-3" />
            </div>

            {orders.map((order) => (
              <div className="w-full shadow-sm rounded-md px-5 py-2" key={order.id}>
                <div className="w-full">
                  <div className="flex justify-between items-center pb-3 flex-wrap sm:flex-nowrap">
                    <h3 className="font-bold text-2xl">Order #{order.id}</h3>
                    <OrderStatus order={order} />
                  </div>
                  <hr />
                </div>
              {
                order.products.map((product) => (
                  <div className="w-full flex flex-col justify-start sm:justify-between sm:flex-row items-center" key={product.id}>
                  <div className="w-full space-y-5  mt-2 sm:mt-5">
                    <img
                      src={product.imageSrc}
                      alt={product.name}
                      className="w-40 h-auto rounded-lg"
                    />
                    <p className="text-gray-500 font-semibold max-w-72 truncate">
                     {product.name}
                    </p>
                  </div>
                  <div className="w-full text-right sm:pt-10">
                    <p className="font-semibold">₹ {product.price.toLocaleString("en-IN")}</p>
                    <p className="font-semibold">Quantity: {product.quantity}</p>
                  </div>
                  <hr />
                </div>
                ))
              }

                <Link to={`/orders/${order.id}`} className="flex justify-end">
                  <Button
                    type="button"
                    classname="w-2/4 md:w-2/6 flex items-center justify-center py-2.5 mt-2 sm:mt-0"
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
