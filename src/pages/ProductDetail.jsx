import React, { useEffect, useState } from "react";
import { json, Link, useNavigate, useParams } from "react-router-dom";
import { Button, ButtonLoading } from "../components";
import {
  ArrowLeft,
  Check,
  Contact,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import appWriteDb from "../appwrite/DbServise";
import appWriteStorage from "../appwrite/storageService";
import { addProduct } from "../store/productSlice";
import { login } from "../store/authSlice";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { isLogin, otherData, userData } = useSelector((state) => state.auth);
  const product = useSelector((state) =>
    state.products.products.find((product) => product.$id === productId)
  );
  const [isInCart, setIsInCart] = useState(
    otherData.cart.some((item) => item.productId === productId)
  );

  useEffect(() => {
    if (!product) {
      setIsLoading(true);
      appWriteDb
        .getProduct(productId)
        .then((res) => {
          if (res) {
            const imageData = appWriteStorage.getImage(res.image);
            if (imageData) {
              res.image = imageData.href;
              dispatch(addProduct(res));
              setIsLoading(false);
            } else console.log("image not found");
          } else console.log("product not found");
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else setIsLoading(false);
  }, []);

  const handleAddToCart = async () => {
    if (!isLogin) {
      navigate("/login", { state: { redirect: `product/${productId}` } });
    } else {
      setAddingToCart(true);
      const newData = { productId, quantity };
      const createdCart = [...otherData.cart, newData];
      try {
        let type = otherData.cart.length === 0 ? "create" : "update";

        // const cart = await appWriteDb.addToCart(
        //   createdCart,
        //   userData.$id,
        //   type
        // ); //TODO: complete cart ui and come back
        const cart = true;
        if (cart) {
          dispatch(login({ otherData: { ...otherData, cart: createdCart } }));
          console.log(`Cart ${type}d successfully`, cart);
          setIsInCart(true);
          setAddingToCart(false);
        }
      } catch (error) {
        console.error(error.message);
        setAddingToCart(false);
      }
    }
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center gap-20 p-5 px-5 sm:px-20 mt-5 xl:flex-row flex-col lg:items-center">
      <Button
        type="button"
        classname="flex items-center justify-start absolute top-20 left-4"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={20} />
        Go back
      </Button>
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-w-[600px] h-auto rounded-lg"
      />
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
                to="/"
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
              className="cursor-pointer hover:text-gray-700"
              onClick={() => setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))}
            />
            <p className="select-none">{quantity}</p>
            <Plus
              size={30}
              className="cursor-pointer hover:text-gray-700"
              onClick={() => setQuantity((prev) => prev + 1)}
            />
          </div>
          <Button
            classname="w-3/4 max-h-11 flex items-center justify-between py-3 px-3 select-none xl:px-5"
            onClick={() =>
              isInCart ? console.log("Already in cart") : handleAddToCart()
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
