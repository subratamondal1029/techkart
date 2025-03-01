import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonLoading, Input } from "../components";
import { CheckCircle, IndianRupee, InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import razorpayImage from "../assets/razorpay.png";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../components/payment";
import { toast } from "react-toastify";
import appWriteDb from "../appwrite/DbServise";
import { login } from "../store/authSlice";
import { Query } from "appwrite";

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
  const { otherData, userData } = useSelector((state) => state.auth);
  const { products: allProducts } = useSelector((state) => state.products);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();
  const [countryCode, setCountryCode] = useState("91");
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (otherData.cart.length === 0) navigate("/");
  }, []);

  useEffect(() => {
    const products = otherData.cart.map((cartProduct) => {
      const productDetails = allProducts.find(
        (product) => product.$id === cartProduct.productId
      );

      return {
        id: productDetails.$id,
        name: productDetails.name,
        price: productDetails.price,
        imageSrc: productDetails.image,
        category: productDetails.category,
        quantity: cartProduct.quantity,
      };
    });
    setProducts(products);
    setTotalAmount(
      products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
    );
  }, [allProducts, otherData.cart]);

  const initAddress = () => {
    let pincodeCashe;
    let postOfficeCashe;
    return async () => {
      const pincode = getValues("pincode");
      if (pincode.length === 6) {
        const extra = getValues("landmark") || "";

        try {
          if (!pincodeCashe || pincodeCashe !== pincode) {
            pincodeCashe = pincode;
            const { PostOffice } = (
              await (
                await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
              ).json()
            )[0];
            postOfficeCashe = PostOffice;
          }
          const address = [
            extra,
            postOfficeCashe[0].State,
            postOfficeCashe[0].District,
            postOfficeCashe[0].Pincode,
            postOfficeCashe[0].Country,
          ].join(", ");
          setValue("address", address);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
  };

  const addAddress = initAddress();

  const checkout = async (data) => {
    setIsLoading(true);
    const order = await createOrder(totalAmount);
    if (order) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Tech Kart",
        description: "Tech Kart - Place Order",
        order_id: order.id,
        handler: (res) => addOrder(res, data),
        prefill: {
          name: "Subrata Mondal",
          email: "subratamondal@outlook.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0f4fd1",
        },
      };

      const razorPopup = new window.Razorpay(options);
      razorPopup.open();
    } else toast.error("Something went wrong");

    setIsLoading(false);
  };

  async function addOrder(res, data) {
    setIsLoading(true);
    const orderObj = {
      date: new Date().toLocaleDateString(),
      userId: userData.$id,
      name: data.name,
      phone: `${countryCode} ${data.phone}`,
      cart: otherData.cart.map((product) => JSON.stringify(product)),
      address: data.address,
    };
    const orderId = res.razorpay_order_id.split("_")[1];

    try {
    const order = await appWriteDb.createOrder(orderObj, orderId);
    if (order) {
      const oldOrders = otherData.orders.map((order) => order.$id);
        await appWriteDb.addOrder([...oldOrders, order.$id], userData.$id);
        await appWriteDb.addToCart([], userData.$id, "update");

        dispatch(login({ otherData: { cart: [], orders: await appWriteDb.getOrders([Query.equal("userId", userData.$id)]) } }));
        navigate("/placed", { state: orderId });
      } else toast.error("Something went wrong");
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen lg:grid grid-cols-3 mt-5 flex flex-col-reverse">
        <div className="lg:col-span-2 col-span-3 bg-white space-y-8 px-12">
          <div className="mt-8 p-4 relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md">
            <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
              <InfoIcon className="h-6 w-6 text-yellow-400" />
              <div className="text-sm font-medium ml-3">Checkout</div>
            </div>
            <div className="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-4">
              Complete your shipping and payment details below.
            </div>
          </div>
          <form
            className="rounded-md space-y-5"
            onSubmit={handleSubmit(checkout)}
          >
            <Input
              classname="w-full"
              type="text"
              placeholder="Full Name"
              label="Full Name"
              {...register("name", { required: true, minLength: 3 })}
              error={errors.name}
            />
            <div className="w-full">
              <label htmlFor="country" className="font-bold">
                Country
              </label>
              <select
                name="country"
                id="country"
                defaultValue="91"
                className={`w-full p-2 rounded-md border bg-transparent ${
                  errors.country ? "border-red-500" : ""
                }`}
                {...register("country", { required: true })}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.country}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                <span className="text-red-500">*</span> This field is required
              </p>
            </div>
            <div className="flex items-center relative">
              <label
                className="w-12 bg-black text-white py-2 mt-2 px-3 rounded-l-md absolute"
                htmlFor="country"
              >
                +{countryCode}
              </label>
              <Input
                classname="w-full "
                style={{ paddingLeft: "60px" }}
                type="number"
                placeholder="Enter Phone"
                label="Phone"
                {...register("phone", {
                  required: true,
                  maxLength: 10,
                  minLength: 10,
                })}
                error={errors.phone}
              />
            </div>
            <Input
              classname="w-full"
              type="number"
              placeholder="Postal Code"
              label="Postal Code"
              {...register("pincode", {
                required: true,
                maxLength: 6,
                minLength: 6,
              })}
              error={errors.pincode}
              onKeyUp={addAddress}
            />

            <Input
              label="landmark"
              placeholder="landmark"
              required={false}
              {...register("landmark")}
              onKeyUp={addAddress}
            />
            <Input
              label="Address Line 1"
              {...register("address", { required: true, minLength: 5 })}
              error={errors.address}
              placeholder="Address Line 1"
            />
            <hr />
            <div className="w-full">
              <div className="cursor-pointer hover:bg-gray-300 text-sm font-bold border p-4 w-40 rounded-md flex justify-end items-center gap-3 bg-gray-200">
                <CheckCircle size={20} className="text-blue-500" />
                <img src={razorpayImage} alt="razorpay" width={20} /> Razorpay
              </div>
            </div>

            <Button
              classname="w-full flex justify-center items-center"
              style={{ marginTop: "42px" }}
              type="submit"
            >
              {isLoading ? (
                <ButtonLoading fillColor="fill-black" />
              ) : (
                "Place Order"
              )}
            </Button>
          </form>
        </div>
        <div className="col-span-1 bg-white w-screen lg:block lg:w-auto">
          <h1 className="py-6 border-b-2 text-xl text-gray-600 px-8">
            Order Summary
          </h1>
          <ul className="py-6 border-b space-y-6 px-8">
            {products.map((product) => (
              <li
                className="grid grid-cols-6 gap-2 border-b-1"
                key={product.id}
              >
                <div className="col-span-1 self-center">
                  <img
                    src={product.imageSrc}
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
                    <span className="text-gray-400">{product.quantity} x </span>
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
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between py-4 text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
          </div>
          <div className="font-semibold text-xl px-8 flex justify-between py-8 text-gray-600">
            <span>Total</span>
            <span>₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
