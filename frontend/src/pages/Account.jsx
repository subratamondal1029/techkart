import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Camera, User2Icon } from "lucide-react";
import { Button, Image } from "../components";
import { Profile, Orders } from "../components/account/";
import authService from "../services/auth.service";
import { logout } from "../store/auth.slice";
import useLoading from "../hooks/useLoading";
import fileService from "../services/file.service";
import { storeCart } from "../store/cart.slice";
import { storeOrders } from "../store/order.slice";

const Account = () => {
  const { userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isOrder, setIsOrder] = useState(false);

  useEffect(() => {
    setIsOrder(params?.page === "orders" || false);
  }, [params]);

  const [handleLogout, isLogoutLoading] = useLoading(async () => {
    const logoutReq = authService.logout();

    toast.promise(logoutReq, {
      pending: "Logging out",
      success: "Logged out successfully",
      error: "Failed to Logout",
    });
    await logoutReq;
    dispatch(logout());
    dispatch(storeCart(null));
    dispatch(storeOrders([]));
    navigate("/", { state: { redirect: "/account" } });
  });

  // TODO: change ui for update user details with optimestic update

  return (
    <div className="w-full min-h-96 mt-5 px-5 md:px-28">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">TechKart Account</h1>
        <Button onClick={handleLogout} type="button" disabled={isLogoutLoading}>
          Signout
        </Button>
      </div>
      <hr className="mt-5" />

      <div className="flex gap-20 mt-5 items-start lg:flex-row flex-col">
        <div className="w-60 flex flex-col place-self-start">
          <div>
            {/* TODO: add avatar update */}
            <div className="w-28 flex items-center justify-center relative rounded-full overflow-hidden cursor-pointer">
              {userData?.avatar ? (
                <Image
                  src={fileService.get(userData?.avatar)}
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
                // TODO: change to update avatar
              />
            </div>
            <h1 className="font-bold text-xl mt-3">{userData?.name}</h1>
            <h2 className="text-gray-500">{userData?.email}</h2>
          </div>
          <ul className="mt-5 flex flex-col items-start justify-center gap-3">
            <li
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

        {!isOrder ? <Profile userData={userData} /> : <Orders />}
      </div>
    </div>
  );
};

export default Account;
