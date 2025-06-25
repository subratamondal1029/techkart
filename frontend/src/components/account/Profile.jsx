import { useState } from "react";
import {
  Button,
  Input,
  UpdateForm,
  PasswordAndConfirm as PasswordInput,
} from "../";
import AccountInfoCard from "./AccountInfoCard";

import {
  Briefcase,
  EyeIcon,
  EyeOffIcon,
  Mail,
  PencilLine,
  User2Icon,
} from "lucide-react";

import { useFormContext } from "react-hook-form";
import { startTransition } from "react";
import authService from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../store/auth.slice";
import showToast from "../../utils/showToast";

const Profile = ({ userData, setOptimisticUserData }) => {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (data, methods) => {
    delete data.confirmPassword;

    const updatedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => userData[key] !== value && value !== ""
      )
    );

    if (Object.keys(updatedData).length === 0) {
      showToast("warning", "No changes detected");
      return;
    }

    startTransition(async () => {
      setIsLoading(true);
      const { password, ...others } = updatedData;
      setOptimisticUserData((prev) => ({
        ...prev,
        ...others,
      }));

      try {
        const { data } = await authService.updateUser({
          ...updatedData,
        });

        dispatch(updateUserData(data));
        showToast("success", "Profile updated successfully");
      } catch (error) {
        showToast("error", error.message || "Something went wrong");
      }

      setIsLoading(false);
    });
  };

  return (
    <div className="flex flex-col w-full md:w-3/4 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Account Information</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PencilLine size={20} className="mr-2" /> Update
        </Button>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-3 ">
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
            <Mail size={20} className="text-gray-500 absolute top-3 right-3" />
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

      {isFormOpen && (
        <UpdateForm setIsOpen={setIsFormOpen} onSubmit={submitHandler}>
          <Input
            label="Name"
            name="name"
            type="text"
            defaultValue={userData?.name}
            rules={{ minLength: 3 }}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={userData?.email}
            rules={{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
          />
          <PasswordInput />
        </UpdateForm>
      )}
    </div>
  );
};

export default Profile;
