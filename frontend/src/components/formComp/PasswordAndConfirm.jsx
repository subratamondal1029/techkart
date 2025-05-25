import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Input from "./Input";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";

const PasswordAndConfirm = ({ isRequired = false }) => {
  const { watch } = useFormContext();
  const [isPassword, setIsPassword] = useState(true);
  const password = watch("password");

  return (
    <>
      <div className="w-full relative flex items-center">
        <Input
          label="Password"
          name="password"
          type={isPassword ? "password" : "text"}
          placeholder="Enter new Password"
          rules={{
            required: isRequired,
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
              message:
                "Password must be 8-20 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
            },
          }}
        />
        <div className="absolute bottom-2 right-2 cursor-pointer">
          {isPassword ? (
            <EyeIcon onClick={() => setIsPassword(!isPassword)} />
          ) : (
            <EyeOffIcon onClick={() => setIsPassword(!isPassword)} />
          )}
        </div>
      </div>
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter new Password"
        rules={{
          required: isRequired,
          validate: (value) =>
            !password || value === password || "Passwords do not match",
        }}
      />
    </>
  );
};

export default PasswordAndConfirm;
