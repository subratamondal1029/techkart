import React from "react";
import { Button, Input, UpdateForm } from ".";
import { useState } from "react";
import { useRef } from "react";
import { startTransition } from "react";
import delay from "../utils/delay";

const Test = () => {
  const [data, setData] = useState("This is Testing Data");
  const [optimisticData, setOptimisticData] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const submitHandler = (data, methods) => {
    console.log(data.data);
    setOptimisticData(data.data);

    startTransition(async () => {
      await delay(2000);
      setData(data.data);
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-800 text-white">
      <p className="text-3xl text-center pt-4">Test</p>
      <p>{optimisticData}</p>
      <Button type="button" classname="" onClick={() => setIsOpen(true)}>
        Open
      </Button>
      {isOpen && (
        <UpdateForm
          setIsOpen={setIsOpen}
          onSubmit={submitHandler}
          autoComplete="off"
        >
          <Input
            label="Data"
            name="data"
            defaultValue={data}
            rules={{ required: true, minLength: 3 }}
          />
        </UpdateForm>
      )}
    </div>
  );
};

export default Test;
