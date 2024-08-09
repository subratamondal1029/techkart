import { ArrowLeft, CreditCard, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const { cart } = useSelector((state) => state.auth.otherData);
  const { products: allProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const createProducts = cart.map((cartProduct) => {
      const productDetails = allProducts.find(
        (product) => product.$id === cartProduct.productId
      );

      return {
        id: productDetails.$id,
        name: productDetails.name,
        price: productDetails.price,
        image: productDetails.image,
        quantity: cartProduct.quantity,
      };
    });

    setProducts(createProducts.reverse());
  }, [cart, allProducts]);

  const handleDelete = (productId) => {
    const filteredProducts = cart
      .filter((product) => product.productId !== productId)

    dispatch(login({ otherData: { cart: filteredProducts } }));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      handleDelete(productId);
      return;
    }else{
    const updatedProducts = cart.map((product) =>
      product.productId === productId
        ? { ...product, quantity }
        : product
    );

    dispatch(login({ otherData: { cart: updatedProducts } }));
  }
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
              {products.map((product) => (
                <div key={product.id} className="">
                  <li className="flex py-6 sm:py-6 ">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                to={`/product/${product.id}`}
                                className="font-semibold text-black"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-3 flex items-end">
                            <p className="text-sm font-medium text-gray-900">
                              &nbsp;&nbsp;₹{" "}
                              {product.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <div className="mb-2 flex">
                    <div className="min-w-24 flex">
                      <button
                        type="button"
                        className="h-7 w-7"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="mx-1 h-7 w-9 rounded-md border text-center"
                        value={product.quantity}
                        disabled
                      />
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="ml-6 flex text-sm">
                      <button
                        type="button"
                        className="flex items-center space-x-1 px-2 py-1 pl-0"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash size={12} className="text-red-500" />
                        <span className="text-xs font-medium text-red-500">
                          Remove
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
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
                    Price ({products.length} item)
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹{" "}
                    {products
                      .reduce((acc, product) => acc + product.price, 0)
                      .toLocaleString("en-IN")}
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
                    ₹{" "}
                    {products
                      .reduce((acc, product) => acc + product.price, 0)
                      .toLocaleString("en-IN")}
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
                <Button classname="w-full flex items-center justify-center">
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
