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
        await delay(2000);
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
    <div className="w-full min-h-96 mt-5 px-5 md:px-28 py-10">
      <div className="flex gap-20 mt-5 items-start lg:flex-row flex-col">
        <div className="w-60 flex flex-col place-self-start">
          <div>
            <div
              onDrop={updateAvatar}
              onDragOver={(e) => {
                e.preventDefault(), e.stopPropagation();
              }}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              className="w-28 flex items-center justify-center relative rounded-full overflow-hidden cursor-pointer"
            >
              {optimisticData?.avatar ? (
                <Image
                  src={
                    optimisticData?.avatar.includes("blob:")
                      ? optimisticData?.avatar
                      : fileService.get(optimisticData?.avatar)
                  }
                  className="w-[500px] h-full max-h-[500px]"
                  alt="avatar"
                />
              ) : (
                <User2Icon className="text-gray-100 bg-black p-2 w-full h-full" />
              )}
              <label
                htmlFor="avatar"
                className={`absolute bottom-0 right-0 w-full h-full flex justify-center items-center bg-blue-500/50 cursor-pointer transition-opacity duration-300 opacity-0 hover:opacity-100 ${
                  isDragging ? "opacity-100" : "opacity-0"
                }`}
              >
                <Camera size={25} />
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
            <h1 className="font-bold text-xl mt-3">{optimisticData?.name}</h1>
            <h2 className="text-gray-500">{optimisticData?.email}</h2>
          </div>
          <ul className="mt-5 flex flex-col items-start justify-center gap-3">
            <li
              onClick={() => navigate("/account")}
              className={`cursor-pointer hover:text-gray-700 ${
                !isOrder && "text-gray-700"
              }`}
            >
              personal Information
            </li>
            <li
              onClick={() => navigate("/account/orders")}
              className={`cursor-pointer hover:text-gray-700 ${
                isOrder && "text-gray-700"
              }`}
            >
              Orders History
            </li>
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
