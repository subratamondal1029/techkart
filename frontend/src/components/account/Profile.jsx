import React from "react";
import { User2Icon, Mail, Briefcase } from "lucide-react";
import AccountInfoCard from "./AccountInfoCard";

const Profile = ({ userData }) => {
  return (
    <div className="flex flex-col w-3/4 space-y-5">
      <h1 className="font-bold text-2xl">Account Information</h1>
      <p className="text-gray-500">Update your account information here.</p>

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
    </div>
  );
};

export default Profile;
