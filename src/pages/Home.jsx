import React, { useEffect, useState } from "react";
import landingImage from "../assets/landingImage.png";
import { ProductCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import appWriteDb from "../appwrite/DbServise";
import { storeProducts } from "../store/productSlice";
import appWriteStorage from "../appwrite/storageService";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);

  return (
    <main>
      <div className="w-full">
        <img src={landingImage} alt="landing image" className="w-full" />
      </div>
      <div className="w-full px-10 pb-5">
        <h1 className="text-center font-bold text-3xl my-10 uppercase" id="products">
          What's New
        </h1>

        <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10">
          {products.map((product) => (
            <ProductCard
              key={product.$id}
              name={product.name}
              price={product.price}
              image={product.image}
              openProduct={() => navigate(`/product/${product.$id}`)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
