import testService from "../services/test.service";
import fileService from "../services/file.service";
import showToast from "../utils/showToast";
import { useLoading } from "../hooks";
import { ButtonLoading, Button, Image, OrderStatus } from ".";
import { useOptimistic, useState, startTransition } from "react";
import delay from "../utils/delay";

const sampleStatus = {
  isShipped: true,
  isDelivered: true,
  isCancelled: true,
  isRefund: true,
};

const Test = () => {
  const [data, setData] = useState([
    { title: "name", value: "Subrata Mondal", id: crypto.randomUUID() },
    {
      title: "email",
      value: "subratamondal@tutanota.com",
      id: crypto.randomUUID(),
    },
    { title: "phone", value: "9999999999", id: crypto.randomUUID() },
    { title: "role", value: "admin", id: crypto.randomUUID() },
  ]);
  const [optimisticData, updateOptimisticData] = useOptimistic(data);

  const apiCall = async () => {
    await delay(2000);
    // throw new Error("Something went wrong");
  };

  const handleChange = async (value, id) => {
    // validation
    if (!value) return;
    const item = data.find((item) => item.id === id);
    if (value === item.value) return;

    startTransition(async () => {
      updateOptimisticData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, value, pending: true } : item
        )
      );

      try {
        console.log("Making api call");
        await apiCall();
        console.log("Api call success");

        setData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, value } : item))
        );
        // success so need to change the name
      } catch (error) {
        // Fails so need to change the name to previous
        console.log("Api call failed");
      }
    });
  };

  return (
    <div className="bg-gray-700 text-white w-full h-screen flex  items-center flex-col">
      <h1 className="text-3xl ">Test</h1>
      <div className="flex justify-center items-center w-full space-x-5">
        {optimisticData.map((item) => (
          <div
            className="flex flex-col justify-center items-start space-y-2"
            key={item.id}
          >
            {item.title}:{" "}
            <p className={`text-white ${item?.pending && "animate-pulse"}`}>
              {item.value}
            </p>
            <input
              className="text-black px-2 py-1 rounded-md mt-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              disabled={item?.pending}
              defaultValue={item.value}
              name={item.title}
              onBlur={(e) => handleChange(e.target.value?.trim(), item.id)}
              placeholder={`Enter ${item.title}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-10">
        status: <OrderStatus order={sampleStatus} />
      </div>
    </div>
  );
};

export default Test;
