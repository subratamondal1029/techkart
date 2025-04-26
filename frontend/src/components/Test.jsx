import testService from "../services/test.service";
import fileService from "../services/file.service";
import showToast from "../utils/showToast";
import { useLoading } from "../hooks";
import { ButtonLoading, Button, Image, OrderStatus } from ".";
import { useOptimistic, useState, startTransition } from "react";
import delay from "../utils/delay";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { useEffect } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

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

  const loaderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const totalPages = useRef(2);
  const [filter, setFilter] = useState({
    sort: "a",
    sortBy: "price",
    query: "",
  });

  const [page, isLoading, error, retry, setPage] = useInfiniteScroll(
    async (page, filter) => {
      console.log("filter", filter);

      console.log(`fetching page: ${page} with query ${filter.query}`);
      await apiCall();
      console.log(`fetched page: ${page}`);
      if (page === 1) {
        setProducts(Array.from({ length: 10 }));
      } else {
        setProducts((prev) => [...prev, ...Array.from({ length: 10 })]);
      }
    },
    loaderRef,
    filter
  );

  useEffect(() => {
    if (!page) return;
    setPage(0);
    setProducts([]);
  }, [filter]);

  return (
    <div className="bg-gray-700 text-white w-full min-h-screen flex  items-center flex-col">
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
      <div className="w-full min-h-screen bg-gray-900 flex flex-col justify-start items-center space-y-5 flex-wrap py-2 mt-3">
        <div className="fixed bottom-10 right-0">
          <input
            type="text"
            defaultValue={filter.query}
            onBlur={(e) =>
              setFilter((prev) => {
                const query = e.target.value?.trim();
                if (query === prev.query || !query) return prev;

                return { ...prev, query };
              })
            }
            placeholder="Search"
            className="focus:outline-none text-black p-2"
          />
        </div>
        {products.map((_, index) => (
          <div
            className="bg-gray-400 w-32 h-32 rounded flex justify-center items-center text-2xl"
            key={index}
          >
            product {index + 1}
          </div>
        ))}
        {error ? (
          <>
            <h1 className="text-2xl text-red-500">{error}</h1>
            <Button onClick={retry}>retry</Button>
          </>
        ) : (
          (isLoading || page < totalPages.current) && (
            <LoaderCircle className="animate-spin " size={30} ref={loaderRef} />
          )
        )}
      </div>
    </div>
  );
};

export default Test;
