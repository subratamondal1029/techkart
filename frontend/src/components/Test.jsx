import { useEffect } from "react";
import testService from "../services/test.service";
import Button from "./Button";
import Input from "./formComp/Input";
import showToast from "../utils/showToast";
import { toast } from "react-toastify";
import { useLoading } from "../hooks";

const Test = () => {
  const [run, isLoading, error] = useLoading(async () => {
    throw new Error("Something went wrong");
  });

  return (
    <div className="bg-gray-700 text-white h-screen w-full">
      <h1 className="text-3xl ">Test</h1>
      <p>{error}</p>
      <Button onClick={run}>run</Button>
    </div>
  );
};

export default Test;
