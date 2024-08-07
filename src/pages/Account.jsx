import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccountInfoCard, Button } from "../components";
import { Briefcase, Languages, Mail, User2Icon, ViewIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import appwriteAuth from "../appwrite/authService";
import { logout } from "../store/authSlice";

const Account = () => {
  const userData = useSelector((state) => state.auth.userData);
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

            <div className="w-full shadow-sm rounded-md px-5 py-2">
              <div className="w-full">
                <div className="flex justify-between items-center pb-3 flex-wrap sm:flex-nowrap">
                  <h3 className="font-bold text-2xl">Order #123456789</h3>
                  <p className="text-orange-500 bg-orange-100 px-2 py-1 border rounded-full cursor-default select-none">
                    in process
                  </p>
                </div>
                <hr />
              </div>

              <div className="w-full flex justify-between">
                <div className="w-full">
                  <img
                    src="https://media.croma.com/image/upload/v1690293464/Croma%20Assets/Computers%20Peripherals/Laptop/Images/273880_g6cpks.png"
                    alt="laptop Image"
                    className="w-40 h-auto rounded-lg"
                  />
                  <p className="text-gray-500 font-semibold">Apple Macbook Air</p>
                </div>
                <div className="w-full text-right pt-10">
                  <p className="font-semibold">₹ 2,00,000</p>
                  <p className="font-semibold">Quantity: 1</p>
                </div>
                <hr />
              </div> 
              {/* TODO: make this dynamic */}

            
              <Link to="/orders/10" className="flex justify-end">
              <Button
                type="button"
                classname="w-2/4 md:w-1/6 flex items-center justify-center py-2.5"
              >
                <ViewIcon size={20} className="mr-2" />
                View
              </Button>
              </Link>
           
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
