import React from "react";
import landingImage from "../assets/landingImage.png";
import { ProductCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.auth);

  const handleProductView = (productId) => {
    if (isLogin) {
      navigate(`/product/${productId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <main>
      <div className="w-full">
        <img src={landingImage} alt="landing image" className="w-full" />
      </div>
      <div className="w-full px-10 pb-5">
        <h1 className="text-center font-bold text-3xl my-10 uppercase">
          What's New
        </h1>

        <div className="w-full flex flex-wrap items-center justify-start">
          <ProductCard
            name="macbook Air m1"
            price={200000}
            image="https://media.croma.com/image/upload/v1690293464/Croma%20Assets/Computers%20Peripherals/Laptop/Images/273880_g6cpks.png"
            openProduct={() => navigate(`/product/${1}`)}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
