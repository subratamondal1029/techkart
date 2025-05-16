import React, { useEffect, useState, useOptimistic } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../store/auth.slice";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, User2Icon } from "lucide-react";
import { Button, Image } from "../components";
import { Profile, Orders } from "../components/account/";
import fileService from "../services/file.service";
import { startTransition } from "react";
import delay from "../utils/delay";
import showToast from "../utils/showToast";
import authService from "../services/auth.service";

const Account = () => {
  const { userData } = useSelector((state) => state.auth);
  const [optimisticData, setOptimisticData] = useOptimistic(userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isOrder, setIsOrder] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsOrder(params?.page === "orders" || false);
  }, [params]);

  const updateAvatar = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const formData = new FormData();
    const file = e.target.files?.[0] || e.dataTransfer.files?.[0];
    formData.append("file", file);

    startTransition(async () => {
      try {
        const imageUrl = URL.createObjectURL(file);
        console.log(imageUrl);
        setOptimisticData((prev) => ({ ...prev, avatar: imageUrl }));

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
      }
    });
  };

  return (
    <div className="w-full min-h-96 mt-5 px-2 sm:px-5 md:px-10 md:py-10">
      <div className="flex gap-20 mt-5 items-center md:items-start md:flex-row flex-col">
        <div className="w-full md:max-w-64 flex flex-col place-self-start bg-white rounded-xl shadow p-6 border border-gray-200">
          <div>
            <div
              onDrop={updateAvatar}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              className="w-32 h-32 flex items-center justify-center relative rounded-full overflow-hidden cursor-pointer border-4 border-blue-200 shadow-md mx-auto transition-all duration-300 hover:border-blue-400"
            >
              {optimisticData?.avatar ? (
                <Image
                  src={
                    optimisticData?.avatar.includes("blob:")
                      ? optimisticData?.avatar
                      : fileService.get(optimisticData?.avatar)
                  }
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                <User2Icon className="text-gray-100 bg-black p-4 w-full h-full" />
              )}
              <label
                htmlFor="avatar"
                className={`absolute bottom-0 right-0 w-full h-full flex justify-center items-center bg-blue-500/60 cursor-pointer transition-opacity duration-300 opacity-0 hover:opacity-100 ${
                  isDragging ? "opacity-100" : "opacity-0"
                }`}
              >
                <Camera size={28} className="text-white drop-shadow" />
              </label>
              <input
                type="file"
                id="avatar"
                name="file"
                accept=".jpeg, .png, .jpg, .webp"
                className="hidden"
                onChange={updateAvatar}
              />
            </div>
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
