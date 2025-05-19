import React, { useEffect, useState, useOptimistic } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../store/auth.slice";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, User2Icon } from "lucide-react";
import { Button, Image, ImageUpload } from "../components";
import { Profile, Orders } from "../components/account/";
import fileService from "../services/file.service";
import showToast from "../utils/showToast";
import authService from "../services/auth.service";
import delay from "../utils/delay";

const Account = () => {
  const { userData } = useSelector((state) => state.auth);
  const [optimisticData, setOptimisticData] = useOptimistic(userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isOrder, setIsOrder] = useState(false);

  useEffect(() => {
    setIsOrder(params?.page === "orders" || false);
  }, [params]);

  const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      let response;
      if (userData?.avatar) {
        const { data } = await fileService.update({
          id: userData.avatar,
          formData,
        });

        response = data;
      } else {
        formData.set("entityType", "avatar");
        const { data } = await fileService.upload({
          formData,
        });

        const { data: userData } = await authService.updateUser({
          avatar: data.file,
        });

        response = userData.avatar;
      }

      dispatch(
        updateUserData({
          ...userData,
          avatar: response.file,
        })
      );
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="w-full min-h-96 mt-5 px-2 sm:px-5 md:px-10 md:py-10">
      <div className="flex gap-20 mt-5 items-center md:items-start md:flex-row flex-col">
        <div className="w-full md:max-w-64 flex flex-col place-self-start bg-white rounded-xl shadow p-6 border border-gray-200">
          <div>
            <ImageUpload
              src={optimisticData?.avatar}
              alt="avatar"
              onUpdate={updateAvatar}
              placeholder={
                <User2Icon className="text-gray-100 bg-black p-4 w-full h-full" />
              }
              classname="max-w-32"
            />
            <h1 className="font-bold text-xl mt-5 text-center text-gray-900">
              {optimisticData?.name}
            </h1>
            <h2 className="text-gray-500 text-center text-base">
              {optimisticData?.email}
            </h2>
          </div>
          <ul className="mt-8 flex flex-col items-stretch gap-3">
            <li
              onClick={() => navigate("/account")}
              className={`py-2 px-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:font-semibold ${
                !isOrder && "bg-blue-50 text-blue-700 font-semibold"
              }`}
            >
              Personal Information
            </li>
            {userData?.label === "user" && (
              <li
                onClick={() => navigate("/account/orders")}
                className={`py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 ${
                  isOrder && "bg-blue-50 text-blue-700 font-semibold"
                }`}
              >
                Orders History
              </li>
            )}
          </ul>
        </div>

        {!isOrder ? (
          <Profile
            userData={optimisticData}
            setOptimisticUserData={setOptimisticData}
          />
        ) : (
          <Orders />
        )}
      </div>
    </div>
  );
};

export default Account;
