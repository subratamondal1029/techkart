import React, { useEffect, useState } from "react";
import {  Link, useNavigate, useParams } from "react-router-dom";
import { Button, ButtonLoading } from "../components";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import appWriteDb from "../appwrite/DbServise";
import { login } from "../store/authSlice";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const { isLogin, isCartCreated, otherData, userData } = useSelector((state) => state.auth);
  const product = useSelector((state) =>
    state.products.products.find((product) => product.$id === productId)
  );
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() =>{
    setIsInCart(otherData.cart.some((item) => item.productId === productId))
    setQuantity(otherData.cart.find((item) => item.productId === productId)?.quantity || 1)
  },[otherData.cart, productId])

  const handleAddToCart = async () => {
    if (!isLogin) {
      navigate("/login", { state: { redirect: `product/${productId}` } });
    } else {
      setAddingToCart(true);
      const newData = { productId, quantity };
      const createdCart = [...otherData.cart, newData];
      try {
        
        let type = !isCartCreated ? "create" : "update";

        const cart = await appWriteDb.addToCart(
          createdCart,
          userData.$id,
          type
        ); 
        if (cart) {
          if(!isCartCreated) dispatch(login({ isCartCreated: true }));
          dispatch(login({ otherData: { ...otherData, cart: createdCart } }));
          setAddingToCart(false);
        }
      } catch (error) {
        console.error(error.message);
        setAddingToCart(false);
      }
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center gap-20 p-5 px-5 sm:px-20 mt-5 xl:flex-row flex-col lg:items-center">
      <Button
        type="button"
        classname="flex items-center justify-start absolute top-20 left-4"
      onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} />
        Go back
      </Button>
      <div className="w-full max-w-[400px] h-auto rounded-lg flex items-center justify-center">
      <img
        src={product.image}
        alt={product.name}
        className="min-w-52"
        />
      </div>
      <div className="w-full h-full flex justify-start flex-col items-start gap-3">
        <h3 className="text-2xl uppercase text-gray-500">{product.company}</h3>
        <h1 className="text-3xl font-bold ">{product.name}</h1>

        <p className="mt-2">{product.description}</p>

        <h3 className="font-extrabold text-3xl mt-2">
          ₹ {product.price.toLocaleString("en-IN")}
        </h3>
        <hr className="w-full " />

        <div className="py-6 ">
          <ul className="space-y-5 pb-1 text-sm">
            <li>
              <span className="text-heading inline-block pr-2 font-semibold">
                SKU:
              </span>
              N/A
            </li>
            <li>
              <span className="text-heading inline-block pr-2 font-semibold">
                Category:
              </span>
              <Link
                className="hover:text-heading transition hover:underline capitalize"
                to={`/search/${product.category}`}
              >
                {product.category}
              </Link>
            </li>
            <li className="productTags">
              <span className="text-heading inline-block pr-2 font-semibold">
                Tags:
              </span>
              <p className="hover:text-headingpr-1.5 transition last:pr-0 flex flex-wrap justify-start gap-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="py-2 px-4 border rounded-full cursor-pointer hover:bg-gray-50"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            </li>
          </ul>
        </div>

        <hr className="w-full " />
        <div className="flex gap-3 items-center xl:w-3/4 mt-3 md:w-2/4 w-full sm:w-3/4 ">
          <div className="w-full bg-gray-200 flex justify-between items-center text-2xl py-1 rounded-lg px-2">
            <Minus
              size={30}
              className={`${isInCart? "cursor-not-allowed" : "cursor-pointer"} hover:text-gray-700`}
              onClick={() => !isInCart ? setQuantity((prev) => (prev !== 1 ? prev - 1 : 1)) : null}
            />
            <p className="select-none">{quantity}</p>
            <Plus
              size={30}
              className={`${isInCart? "cursor-not-allowed" : "cursor-pointer"} hover:text-gray-700`}
              onClick={() => !isInCart ? setQuantity((prev) => prev + 1) : null}
            />
          </div>
          <Button
            classname="w-3/4 max-h-11 flex items-center justify-between py-3 px-3 select-none xl:px-5"
            onClick={() =>
              isInCart ? navigate("/cart") : handleAddToCart()
            }
          >
            {addingToCart ? (
              <ButtonLoading fillColor="fill-black" classname="w-full" />
            ) : isInCart ? (
              <>
                <Check size={25} className="ml-2" /> Go to cart
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Add to cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
