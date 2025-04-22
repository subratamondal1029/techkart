import { useEffect } from "react";
import testService from "../services/test.service";
import showToast from "../utils/showToast";
import { useLoading } from "../hooks";
import { ButtonLoading, Button } from ".";

const Test = () => {
  const [run, isLoading, error] = useLoading(async () => {
    setTimeout(() => {
      throw new Error("Something went wrong");
    }, 5000);
  });

  return (
    <div className="bg-gray-700 text-white h-screen w-full">
      <h1 className="text-3xl ">Test</h1>
      <p>{error}</p>
      {/* {isLoading ? <ButtonLoading /> : <Button onClick={run}>run</Button>} */}
      <ButtonLoading />
    </div>
  );
};

export default Test;
