import { useEffect } from "react";
import testService from "../services/test.service";
import Button from "./Button";
import Input from "./formComp/Input";
import showToast from "../utils/showToast";

const Test = () => {
  return (
    <div className="bg-gray-700 text-white h-screen w-full">
      <h1 className="text-3xl ">Test</h1>
      <Button onClick={() => showToast("error", "Error message")}>
        Show Toast
      </Button>
    </div>
  );
};

export default Test;
