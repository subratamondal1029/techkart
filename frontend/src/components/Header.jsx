import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth.slice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  SearchIcon,
  ShoppingCartIcon,
  User,
  X,
} from "lucide-react";
import { Button, CartPop, Input, Logo } from "./index";
import authService from "../services/auth.service";
import { toast } from "react-toastify";
import useLoading from "../hooks/useLoading";
import { storeCart } from "../store/cart.slice";
import { storeOrders } from "../store/order.slice";

const Header = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [handleLogout] = useLoading(async () => {
    const logoutReq = authService.logout();

    toast.promise(logoutReq, {
      pending: "Logging out",
      success: "Logged out successfully",
      error: "Failed to Logout",
    });

    await logoutReq;
    dispatch(logout());
    dispatch(storeCart(null));
    dispatch(storeOrders([]));
    navigate("/");
  });

  const handleSearch = (value) => {
    if (value === "") {
      value = "all";
    }
    navigate(`/search/${value}`);
  };

  return (
    <header className="z-10 relative bg-white">
      <div className="flex justify-between items-center shadow-md py-4 px-8">
        <Link to="/">
          <Logo classname="w-10" width="200px" />
        </Link>

        <div className="hidden justify-center items-center md:flex">
          <Input
            required={false}
            placeholder="Search"
            classname="min-w-80 rounded-r-none mt-1"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch(searchValue)}
          />
          <div className="relative flex items-start justify-center">
            <select
              className="bg-transparent mt-1 appearance-none border border-gray-300 py-[9px] pl-3 pr-10 text-sm  focus:outline-none select-none rounded-r-lg"
              id="category"
              name="category"
              onChange={(e) => handleSearch(e.target.value)}
            >
              <option value="">All Category</option>
              <option value="mobile">Mobile</option>
              <option value="laptop">Laptop</option>
              <option value="audio">Audio</option>
              <option value="computer">Computer</option>
            </select>
            <span className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center text-center text-gray-600">
              <ChevronDown size={16} />
            </span>
          </div>
        </div>

        <div className="hidden justify-center items-center space-x-7 md:flex">
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex justify-center items-center ${
                isActive ? "text-blue-600" : ""
              }`
            }
          >
            <User size={20} />
            Account
          </NavLink>

          <span
            className="relative cursor-pointer"
            onClick={() => setIsCartOpen((prev) => !prev)}
          >
            {cart?.products?.length > 0 ? (
              <div className="absolute -top-2 -right-2 w-4 h-4 p-2 rounded-full bg-black text-white flex justify-center items-center">
                {cart?.products?.length}
              </div>
            ) : null}
            {isCartOpen ? (
              <ShoppingCartIcon size={20} color="rgb(37 99 235)" />
            ) : (
              <ShoppingCartIcon size={20} />
            )}
          </span>

          <Button
            type="button"
            onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>

        <div className="md:hidden">
          <Menu size={20} onClick={() => setIsMenuOpen((prev) => !prev)} />
        </div>
      </div>
      {isMenuOpen && (
        <div className="z-20 absolute top-2 w-full min-h-10">
          <div className="relative w-11/12 flex flex-col justify-center items-start bg-gray-100 mx-auto shadow-lg rounded-md p-3">
            <Link to="/" className="w-full">
              <Logo classname="w-[50px] mx-auto" />
            </Link>

            <X
              size={20}
              className="absolute right-12 top-4"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />

            <div className="w-full mt-5 px-10">
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `w-full flex ${isActive ? "text-blue-600" : ""}`
                }
              >
                <User size={20} />
                Account
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `relative cursor-pointer flex mt-4 gap-2 ${
                    isActive ? "text-blue-600" : ""
                  }`
                }
                to="/cart"
              >
                {cart?.products?.length > 0 ? (
                  <div className="absolute -top-2 -right-2 w-4 h-4 p-2 rounded-full bg-black text-white flex justify-center items-center">
                    {cart?.products?.length}
                  </div>
                ) : null}
                <ShoppingCartIcon size={20} /> Open cart
              </NavLink>

              <form
                className="w-full flex items-center justify-center mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchValue.trim());
                }}
              >
                <Input
                  required={false}
                  placeholder="Search"
                  classname="rounded-r-none w-full mt-1"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                  type="submit"
                  classname="w-1/4 flex items-center justify-center py-[10px] mt-1 rounded-l-none"
                >
                  <SearchIcon size={20} />
                </Button>
              </form>

              <Button
                type="button"
                classname="w-full mt-10"
                onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && <CartPop setIsCartOpen={setIsCartOpen} />}
    </header>
  );
};

export default Header;
