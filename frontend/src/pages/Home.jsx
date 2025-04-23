import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Laptop,
  Computer,
  Headset,
  LoaderCircleIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Image, ProductCard } from "../components";
import { useLoading } from "../hooks";
import landingImage from "../assets/landingImage.png";
import productService from "../services/product.service";
import { storeProducts } from "../store/product.slice";
import { useRef } from "react";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Info } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  const [fetchProduct, isLoading, error] = useLoading(async (page) => {
    const { data } = await productService.getMany({
      page,
      sortBy: "createdAt",
      sort: "d",
    });

    setTotalPages(data.totalPages);
    const products = data.products;
    console.log(`Total product response: ${products.length}`);

    dispatch(storeProducts(products));
  });

  useEffect(() => {
    if (!page) return;
    console.log(`fetching page: ${page} at time: ${Date.now()}`);
    fetchProduct(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entries]) => {
        if (!isLoading && entries.isIntersecting && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1,
      }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => loader && observer.unobserve(loader);
  }, [isLoading, page, totalPages]);

  return (
    <main>
      <div className="w-full">
        <Image src={landingImage} alt="landing image" className="w-full" />
      </div>
      <div className="w-full p-2 flex justify-center items-center space-x-20 mt-10">
        <Link
          to="/search/mobile"
          className=" border p-3 bg-gray-50 rounded-full"
        >
          <Smartphone size={40} className="text-black" />
        </Link>
        <Link
          to="/search/laptop"
          className=" border p-3 bg-gray-50 rounded-full"
        >
          <Laptop size={40} className="text-black" />
        </Link>
        <Link
          to="/search/computer"
          className=" border p-3 bg-gray-50 rounded-full"
        >
          <Computer size={40} className="text-black" />
        </Link>
        <Link
          to="/search/audio"
          className=" border p-3 bg-gray-50 rounded-full"
        >
          <Headset size={40} className="text-black" />
        </Link>
      </div>
      <div className="w-full px-10 pb-5">
        <h1
          className="text-center font-bold text-3xl my-10 uppercase"
          id="products"
        >
          What's New
        </h1>
        {error && (
          <div
            id="alert-additional-content-2"
            className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <Info size={20} />
              <h3 className="text-lg font-medium">An error occurred</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">{error}</div>
            <div className="flex">
              <Button
                classname="w-24 justify-between"
                onClick={() => fetchProduct(page)}
              >
                <RotateCcw />
                Retry
              </Button>
            </div>
          </div>
        )}
        <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
          {(page !== totalPages || isLoading) && (
            <div className="w-full flex justify-center items-center">
              <LoaderCircleIcon
                size={40}
                className="animate-spin"
                ref={loaderRef}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
