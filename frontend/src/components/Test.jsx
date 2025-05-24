import { Button, Pagination, TagInput, UpdateForm } from ".";
import { useState } from "react";
import showToast from "../utils/showToast";

const Test = () => {
  const [captchaVAlue, setCaptchaValue] = useState("");

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    if (!captchaVAlue) {
      showToast("error", "Please solve the captcha");
    }
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full bg-gray-800 text-white">
      <p className="text-3xl text-center pt-4 mb-10">Test</p>
      <form onSubmit={handleSubmit}>
        {/* your inputs */}

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Test;
