
import { Smartphone, Laptop, Computer, Headset } from "lucide-react";
import landingImage from "../assets/landingImage.png";
import { ProductCard } from "../components";
import { useSelector } from "react-redux";
import {Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);

  return (
    <main>
      <div className="w-full">
        <img src={landingImage} alt="landing image" className="w-full" />
      </div>
      <div className="w-full p-2 flex justify-center items-center space-x-20 mt-10">
        <Link to="/search/mobile" className=" border p-3 bg-gray-50 rounded-full">
          <Smartphone size={40} className="text-black" />
        </Link>
        <Link to="/search/laptop" className=" border p-3 bg-gray-50 rounded-full">
          <Laptop size={40} className="text-black" />
        </Link>
        <Link to="/search/computer" className=" border p-3 bg-gray-50 rounded-full">
          <Computer size={40} className="text-black" />
        </Link>
        <Link to="/search/audio" className=" border p-3 bg-gray-50 rounded-full">
          <Headset size={40} className="text-black" />
        </Link>
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
