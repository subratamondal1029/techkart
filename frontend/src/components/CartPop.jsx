import { useOptimistic, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { Button, Image } from "./index";
import useLoading from "../hooks/useLoading";
import { removeFromCart } from "../store/cart.slice";
import cartService from "../services/cart.service";
import fileService from "../services/file.service";
import showToast from "../utils/showToast";

const CartPop = ({ setIsCartOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.cart?.products);
  const [optimisticProducts, updateOptimisticProducts] =
    useOptimistic(products);

  const [handleDeleteProduct, isLoading] = useLoading(
    async (productId) =>
      new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            updateOptimisticProducts((prev) =>
              prev.filter((p) => p.product._id !== productId)
            );
            await cartService.update({ id: productId, quantity: 0 });
            dispatch(removeFromCart(productId));
            resolve();
          } catch (error) {
            showToast("error", error.message || "Failed to remove product");
            reject(error);
          }
        });
      })
  );

  return (
    <div
      className="z-30 m-auto absolute top-10 right-0 bg-custom-gradient my-6 w-screen max-w-sm rounded-lg border border-gray-200 p-4 pt-4 shadow-sm sm:p-6 lg:p-8"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <button className="relative ml-auto block text-gray-600 transition hover:scale-110">
        <span className="sr-only">Close cart</span>
        <X size={24} onClick={() => setIsCartOpen(false)} />
      </button>
      <div className="mt-6 space-y-6">
        <ul className="space-y-4 overflow-y-auto max-h-72 hide-scroll">
          {optimisticProducts &&
            optimisticProducts.map(({ product, quantity }) => (
              <li key={product._id}>
                <Link
                  to={`/product/${product._id}`}
                  className="flex items-center gap-4 relative"
                >
                  <Image
                    src={fileService.get(product.image)}
                    alt={product.name}
                    className="h-16 w-16 rounded object-contain"
                  />
                  <div>
                    <h3 className="text-sm text-gray-900 truncate max-w-40">
                      {product.name}
                    </h3>
                    <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                      <div>
                        <dd className="inline font-bold">₹{product.price}</dd>
                        <dd className="inline"> x {quantity}</dd>
                      </div>
                    </dl>
                  </div>
                  <div
                    className={`absolute right-0 top-1/4 text-white hover:text-gray-300 bg-black p-1 rounded-md ${
                      isLoading ? "cursor-wait" : ""
                    }`}
                  >
                    <X
                      size={24}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProduct(product._id);
                      }}
                    />
                  </div>
                </Link>
              </li>
            ))}
        </ul>
        <div className="space-y-4 text-center">
          <button
            type="button"
            className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={() => {
              navigate("/cart");
              setIsCartOpen(false);
            }}
          >
            View Cart ({optimisticProducts?.length || 0})
          </button>
          {optimisticProducts?.length > 0 && (
            <Button
              classname="w-full"
              type="button"
              onClick={() => {
                navigate("/checkout");
                setIsCartOpen(false);
              }}
            >
              Checkout
            </Button>
          )}
          <Link
            to="/"
            onClick={() => setIsCartOpen(false)}
            className="inline-block text-sm text-gray-600 transition hover:text-gray-700 hover:underline hover:underline-offset-4"
          >
            Continue shopping &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPop;
