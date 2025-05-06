import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Image, Input } from "../components";
import { CheckCircle, IndianRupee, InfoIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import razorpayImage from "../assets/razorpay.png";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../components/payment";
import { toast } from "react-toastify";
import { addOrder } from "../store/order.slice";
import fileService from "../services/file.service";
import orderService from "../services/order.service";
import { useRef } from "react";
import { useMemo } from "react";
import useLoading from "../hooks/useLoading";
import showToast from "../utils/showToast";
import { AlertTriangle } from "lucide-react";
import { storeCart } from "../store/cart.slice";

const countryCodes = [
  { code: "91", country: "India" },
  { code: "1", country: "United States" },
  { code: "86", country: "China" },
  { code: "81", country: "Japan" },
  { code: "55", country: "Brazil" },
  { code: "7", country: "Russia" },
  { code: "44", country: "United Kingdom" },
  { code: "33", country: "France" },
  { code: "49", country: "Germany" },
  { code: "39", country: "Italy" },
  { code: "34", country: "Spain" },
  { code: "27", country: "South Africa" },
  { code: "61", country: "Australia" },
  { code: "64", country: "New Zealand" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const products = cart?.products || [];
  const methods = useForm();
  const [countryCode, setCountryCode] = useState("91");
  const [error, setError] = useState({
    message: "Complete your shipping and payment details below.",
    error: true,
    icon: <InfoIcon className="h-6 w-6 text-yellow-400" />,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const totalAmount = useMemo(() => {
    return products.reduce(
      (acc, cur) => acc + cur.product.price * cur.quantity,
      0
    );
  }, [products]);

  const pincodeCache = useRef(new Map());
  const addAddress = async () => {
    const pincode = methods.getValues("pincode");
    if (pincode.length === 6) {
      const extra = methods.getValues("landmark") || "";
      let postOfficeData = pincodeCache.current.get(pincode);

      try {
        if (!postOfficeData) {
          const { postOffice } = (
            await (
              await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
            ).json()
          )[0];

          if (postOffice) {
            postOfficeData = postOffice[0];
            pincodeCache.current.set(pincode, postOfficeData);
          }
        }

        if (postOfficeData) {
          const address = [
            extra,
            postOfficeData.State,
            postOfficeData.District,
            postOfficeData.Pincode,
            postOfficeData.Country,
          ].join(", ");
          methods.setValue("address", address, {
            shouldValidate: true,
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const [checkout, isCheckoutLoading, checkoutError] = useLoading(
    async (data) =>
      new Promise(async (resolve, reject) => {
        if (!window.Razorpay) throw new Error("Something went wrong");

        const { data: razorpayOrder } = await orderService.getPaymentData({
          amount: totalAmount,
        });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Tech Kart",
          description: "Tech Kart - Place Order",
          order_id: razorpayOrder.id,
          handler,
          prefill: {
            name: methods.getValues("name"),
            email: userData?.email,
            contact: methods.getValues("phone"),
          },
          theme: {
            color: "#0f4fd1",
          },
          modal: {
            ondismiss: () => {
              console.warn("Payment popup closed.");
              reject(new Error("Payment cancelled"));
            },
          },
        };

        async function handler(res) {
          try {
            setError((prev) => ({ ...prev, error: false }));
            console.log("result", res, "data", data);
            const paymentVerificationResponse =
              await orderService.verifyPayment({
                paymentId: res.razorpay_payment_id,
                orderId: res.razorpay_order_id,
              });

            if (paymentVerificationResponse.data.status !== "paid") {
              reject(new Error("Payment Failed"));
              return;
            }

            const orderPromise = orderService.create({
              customerAddress: data.address,
              customerName: data.name,
              customerPhone: `+${countryCode}${data.phone}`,
              paymentId: res.razorpay_payment_id,
              cartId: cart._id,
            });

            toast.promise(orderPromise, {
              pending: "Placing Order",
              success: "Order Placed",
              error: (err) => err.message,
            });

            const { data: order } = await orderPromise;

            dispatch(addOrder({ ...order, cart }));
            dispatch(storeCart(null));
            navigate(`/placed?id=${order._id}`);
            resolve();
          } catch (error) {
            reject(error);
          }
        }

        const razorPopup = new window.Razorpay(options);
        razorPopup.open();
      })
  );

  useEffect(() => {
    if (!products.length) navigate("/");
  }, [products]);

  useEffect(() => {
    if (checkoutError) {
      setError({
        error: true,
        message: checkoutError || "Checkout failed",
        icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
      });

      showToast("error", checkoutError);
    } else if (Object.keys(methods.formState.errors).length !== 0) {
      setError({
        error: true,
        message: "Complete your shipping and payment details below.",
        icon: <InfoIcon className="h-6 w-6 text-yellow-400" />,
      });
    }
  }, [checkoutError, methods.formState.errors]);

  return (
    <>
      <div className="min-h-screen lg:grid grid-cols-3 mt-5 flex flex-col-reverse">
        <div className="lg:col-span-2 col-span-3 bg-white space-y-8 px-4 sm:px-12">
          {error.error && (
            <div className="mt-8 p-4 relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md">
              <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                {error.icon || <InfoIcon className="h-6 w-6 text-yellow-400" />}
                <div className="text-sm font-medium ml-3">Checkout</div>
              </div>
              <div className="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-4">
                {error.message ||
                  "Complete your shipping and payment details below."}
              </div>
            </div>
          )}
          <FormProvider {...methods}>
            <form
              className="rounded-md"
              onSubmit={methods.handleSubmit(checkout)}
            >
              <fieldset disabled={isCheckoutLoading} className="space-y-5">
                <Input
                  classname="w-full"
                  type="text"
                  placeholder="Full Name"
                  label="Full Name"
                  name="name"
                  rules={{ required: true, minLength: 3 }}
                />
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-3 ml-2 capitalize w-full text-left"
                  >
                    Country: <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    id="country"
                    value={countryCode}
                    className="w-full p-2 rounded-md border bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center relative">
                  <label
                    className="w-12 bg-black text-white py-2 px-3 rounded-l-md absolute top-10 z-10"
                    htmlFor="country"
                  >
                    +{countryCode}
                  </label>
                  <Input
                    classname="w-full pl-16"
                    name="phone"
                    type="number"
                    placeholder="Enter Phone"
                    label="Phone"
                    rules={{
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                    }}
                  />
                </div>
                <Input
                  type="number"
                  name="pincode"
                  placeholder="Postal Code"
                  label="Postal Code"
                  rules={{
                    required: true,
                    maxLength: 6,
                    minLength: 6,
                  }}
                  onKeyUp={addAddress}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                  }}
                />

                <Input
                  label="landmark"
                  placeholder="landmark"
                  name="landmark"
                  rules={{ required: false }}
                  onKeyUp={addAddress}
                />
                <Input
                  label="Address Line 1"
                  rules={{ required: true, minLength: 5 }}
                  name="address"
                  placeholder="Address Line 1"
                />
                <hr />
                <div className="w-full">
                  <div className="cursor-pointer hover:bg-gray-300 text-sm font-bold border p-4 w-40 rounded-md flex justify-end items-center gap-3 bg-gray-200">
                    <CheckCircle size={20} className="text-blue-500" />
                    <img src={razorpayImage} alt="razorpay" width={20} />{" "}
                    Razorpay
                  </div>
                </div>

                <Button
                  classname="w-full flex justify-center items-center mt-11"
                  // style={{ marginTop: "42px" }}
                  type="submit"
                  loader={isCheckoutLoading}
                  disabled={isCheckoutLoading}
                >
                  Place Order
                </Button>
              </fieldset>
            </form>
          </FormProvider>
        </div>
        <div className="col-span-1 bg-white w-screen lg:block lg:w-auto">
          <h1 className="py-6 border-b-2 text-xl text-gray-600 px-8">
            Order Summary
          </h1>
          <ul className="py-6 border-b space-y-6 px-8">
            {products.map(({ product, quantity }) => (
              <li
                className="grid grid-cols-6 gap-2 border-b-1"
                key={product._id}
              >
                <div className="col-span-1 self-center">
                  <Image
                    src={fileService.get(product.image)}
                    alt={product.name}
                    className="rounded w-full"
                  />
                </div>
                <div className="flex flex-col col-span-3 pt-2">
                  <span className="text-gray-600 text-md font-semi-bold truncate max-w-md">
                    {product.name}
                  </span>
                </div>
                <div className="col-span-2 pt-3">
                  <div className="flex items-center text-sm justify-end space-x-2">
                    <span className="text-gray-400">{quantity} x </span>
                    <span className="text-black font-semibold inline-block">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-8 border-b">
            <div className="flex justify-between py-4 text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-black">
                ₹{totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between py-4 text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
          </div>
          <div className="font-semibold text-xl px-8 flex justify-between py-8 text-gray-600">
            <span>Total</span>
            <span>₹{totalAmount?.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
