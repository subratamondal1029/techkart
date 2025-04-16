import React from "react";
import testService from "../services/test.service";
import { useEffect } from "react";
import Button from "./Button";
import fileService from "../services/file.service";

const Test = () => {
  async function test() {
    try {
      const response = fileService.get({ id: "63d5b9b7b9b9b9b9b9b9" });
      console.log(response);
    } catch (error) {
      //   console.log(error);
    }
  }

  return (
    <div className="bg-gray-700 text-white h-screen w-full">
      <h1 className="text-3xl ">Test</h1>
      <Button type="button" onClick={test}>
        make a request
      </Button>
    </div>
  );
};

export default Test;
