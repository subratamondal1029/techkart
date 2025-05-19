import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth.slice";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Menu, SearchIcon, ShoppingCartIcon, User, X } from "lucide-react";
import { Button, CartPop, DataList, Input, Logo } from "./index";
import authService from "../services/auth.service";
import { toast } from "react-toastify";
import useLoading from "../hooks/useLoading";
import { storeCart } from "../store/cart.slice";
import { storeOrders } from "../store/order.slice";

const Header = () => {
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products.data);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [allTags, setAllTags] = useState([
    "laptops",
    "smartphones",
    "headphones",
    "keyboards",
    "monitors",
    "gaming chairs",
    "graphic cards",
    "processors",
    "motherboards",
    "storage devices",
  ]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

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
  });

  const handleSearch = (value) => {
    const queryValue = encodeURIComponent(
      typeof value === "string" ? value : searchValue
    );
    navigate(`/search/?query=${queryValue}`);
  };

  useEffect(() => {
    const allTags = products
      .map((p) => p.tags)
      .flat(1)
      .map((t) => t.toLowerCase().trim());
    setAllTags((prev) => Array.from(new Set([...prev, ...allTags])));
  }, [products]);

  useEffect(() => {
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    setSearchValue(query);
  }, [searchParams]);

  return (
    <header className="z-10 relative bg-white">
      <div className="flex justify-between items-center shadow-md py-4 px-8">
        <Link to="/">
          <Logo classname="w-10" width="200px" />
        </Link>

        <div className="hidden justify-center items-center md:flex h-full min-h-10">
          <Input
            required={false}
            placeholder="Search"
            classname="min-w-80 rounded-r-none"
            value={searchValue}
            list="search"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
          />
          <DataList
            list={allTags}
            valueState={searchValue}
            id="search"
            limit={5}
          />

          <Button
            classname="h-full min-h-10 rounded-l-none"
            onClick={handleSearch}
          >
            <SearchIcon size={20} />
          </Button>
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
            className={`relative cursor-pointer ${
              pathname === "/cart" ? "text-blue-600" : ""
            } ${
              userData?.label === "user" ? "" : "pointer-events-none opacity-50"
            }`}
            onClick={() =>
              userData?.label === "user" && setIsCartOpen((prev) => !prev)
            }
          >
            {cart?.products?.length > 0 ? (
              <div className="absolute -top-2 -right-2 w-4 h-4 p-2 rounded-full bg-black text-white flex justify-center items-center">
                {cart?.products?.length}
              </div>
            ) : null}
            <ShoppingCartIcon
              size={20}
              color={isCartOpen ? "rgb(37 99 235)" : "black"}
            />
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

      {/* Mobile Menu */}
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

      {/* Cart popup for big screen */}
      {isCartOpen && <CartPop setIsCartOpen={setIsCartOpen} />}
    </header>
  );
};

export default Header;
