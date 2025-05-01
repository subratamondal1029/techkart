import React, {
  useEffect,
  useState,
  useCallback,
  useOptimistic,
  startTransition,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, CreditCard, Trash } from "lucide-react";
import { Button, Image } from "../components";
import CartShimmer from "../components/shimmers/Cart.shimmer";
import { changeQuantity, removeFromCart } from "../store/cart.slice";
import fileService from "../services/file.service";
import cartService from "../services/cart.service";
import useLoading from "../hooks/useLoading";
import showToast from "../utils/showToast";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const [optimisticCart, setOptimisticCart] = useOptimistic(cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calCartPrice = (cart) => {
    return cart?.products?.reduce(
      (acc, cur) => acc + cur.product.price * cur.quantity,
      0
    );
  };

  const [handleDelete, isDeleteLoading, deleteError] = useLoading(
    async (productId) =>
      new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            setOptimisticCart((prev) => ({
              ...prev,
              products: prev.products.filter(
                (p) => p.product._id !== productId
              ),
            }));
            await cartService.update({ id: productId, quantity: 0 });
            dispatch(removeFromCart(productId));
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      })
  );

  const [handleQuantityChange, isQuantityLoading, quantityError] = useLoading(
    async (productId, quantity) => {
      const product = cart.products.find((p) => p.product._id === productId);
      if (quantity === product.quantity) return;

      if (quantity <= 0) {
        handleDelete();
        return;
      }

      return new Promise((resolve, reject) => {
        startTransition(async () => {
          setOptimisticCart((prev) => ({
            ...prev,
            products: prev.products.map((p) =>
              p.product._id === productId ? { ...p, quantity } : p
            ),
          }));

          try {
            await cartService.update({ id: productId, quantity });
            dispatch(changeQuantity({ productId, quantity }));
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  );

  useEffect(() => {
    if (quantityError || deleteError) {
      showToast(
        "error",
        quantityError || deleteError || "Something went wrong"
      );
    }
  }, [quantityError, deleteError]);

  const handleQuantityChangeCall = useCallback(
    (e) => {
      const target = e.target;
      target.readOnly = true;
      const productId = target.id;
      const value = Number(target.value);

      const product = cart.products.find((p) => p.product._id === productId);
      if (value === product.quantity) return;

      handleQuantityChange(productId, value);
    },
    [handleQuantityChange]
  );

  if (!cart) return <CartShimmer />;

  // onetime use Component
  const CartProduct = ({ product, quantity }) => {
    const [localQuantity, setLocalQuantity] = useState(quantity);

    useEffect(() => {
      setLocalQuantity(quantity);
    }, [quantity]);

    return (
      <div className="">
        <li className="flex py-6 sm:py-6 ">
          <Link to={`/product/${product._id}`} className="flex-shrink-0">
            <Image
              src={fileService.get(product.image)}
              alt={product.name}
              className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
            />
          </Link>

          <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm">
                    <Link
                      to={`/product/${product._id}`}
                      className="font-semibold text-black"
                    >
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <div className="mt-3 flex items-end">
                  <p className="text-sm font-medium text-gray-900">
                    &nbsp;&nbsp;₹ {product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
        <div className="mb-2 flex">
          {/* quantity update */}
          <div className="min-w-24 flex">
            <button
              type="button"
              className={`h-7 w-7`}
              onClick={() => handleQuantityChange(product._id, quantity - 1)}
            >
              -
            </button>
            <input
              type="number"
              className={`mx-1 h-7 w-9 rounded-md border text-center cursor-text focus:outline-none read-only:bg-gray-200 disabled:animate-pulse disabled:cursor-wait disabled:bg-gray-400`}
              disabled={isQuantityLoading}
              value={localQuantity}
              id={product._id}
              onDoubleClick={(e) => (e.target.readOnly = false)}
              onBlur={handleQuantityChangeCall}
              onChange={(e) =>
                setLocalQuantity(Math.max(0, Number(e.target.value)))
              }
              onKeyUp={(e) => e.key === "Enter" && handleQuantityChangeCall(e)}
              readOnly
            />
            <button
              type="button"
              className={`flex h-7 w-7 items-center justify-center`}
              onClick={() => handleQuantityChange(product._id, quantity + 1)}
            >
              +
            </button>
          </div>
          {/* remove */}
          <div className="ml-6 flex text-sm">
            <button
              type="button"
              className={`flex items-center space-x-1 px-2 py-1 pl-0 disabled:cursor-wait`}
              onClick={() => handleDelete(product._id)}
              disabled={isDeleteLoading}
            >
              <Trash size={12} className="text-red-500" />
              <span className="text-xs font-medium text-red-500">Remove</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-2 lg:px-8">
      <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section
            aria-labelledby="cart-heading"
            className="rounded-lg bg-white lg:col-span-8"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul role="list" className="divide-y divide-gray-200">
              {cart &&
                optimisticCart?.products?.map(({ product, quantity }) => (
                  <CartProduct
                    product={product}
                    quantity={quantity}
                    key={product._id}
                  />
                ))}
            </ul>
          </section>
          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
          >
            <h2
              id="summary-heading"
              className=" border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
            >
              Price Details
            </h2>
            <div>
              <dl className=" space-y-1 px-2 py-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-800">
                    Price ({optimisticCart?.products?.length} item)
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹ {calCartPrice(optimisticCart)?.toLocaleString("en-In")}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-4">
                  <dt className="flex text-sm text-gray-800">
                    <span>Delivery Charges</span>
                  </dt>
                  <dd className="text-sm font-medium text-green-700">Free</dd>
                </div>
                <div className="flex items-center justify-between border-y border-dashed py-4 ">
                  <dt className="text-base font-medium text-gray-900">
                    Total Amount
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    ₹ {calCartPrice(optimisticCart)?.toLocaleString("en-In")}
                  </dd>
                </div>
              </dl>
              <div className="flex justify-between items-center gap-5">
                <Link
                  to="/"
                  className="w-full inline-flex items-center justify-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <ArrowLeft size={16} className="mr-2" /> continue shopping
                </Link>
                <Button
                  classname="w-full flex items-center justify-center"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout <CreditCard size={16} className="ml-2" />{" "}
                </Button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
