import React from "react";
import testService from "../services/test.service";
import { useEffect } from "react";
import Button from "./Button";
import fileService from "../services/file.service";
import { useRef } from "react";

const Input = (props) => {
  const { ref: externalRef, ...rest } = props;
  return <input ref={externalRef} {...rest} />;
};

const Test = () => {
  const inputRef = useRef(null);
  useEffect(() => {
    console.log(inputRef.current);
  }, []);
  return (
    <div className="bg-gray-700 text-white h-screen w-full">
      <h1 className="text-3xl ">Test</h1>
      <Input ref={inputRef} />
    </div>
  );
};

export default Test;
