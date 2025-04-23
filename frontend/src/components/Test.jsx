import { useEffect } from "react";
import testService from "../services/test.service";
import fileService from "../services/file.service";
import showToast from "../utils/showToast";
import { useLoading } from "../hooks";
import { ButtonLoading, Button, Image } from ".";

const Test = () => {
  const [run, isLoading, error] = useLoading(async () => {
    setTimeout(() => {
      throw new Error("Something went wrong");
    }, 5000);
  });

  return (
    <div className="bg-gray-700 text-white w-full">
      <h1 className="text-3xl ">Test</h1>
      <p>{error}</p>
      <div className="w-full h-screen bg-gray-500"></div>
      <Image
        src={fileService.get("67eeb1fcfaf070cbfb48da8c")}
        className="rounded-xl w-48 h-48"
      />
      <div className="w-full h-screen bg-blue-300"></div>
      <Image
        src={fileService.get("67eesb1fcfaf070cbfb48da8c")}
        className="rounded-xl w-48 h-48"
      />
    </div>
  );
};

export default Test;
