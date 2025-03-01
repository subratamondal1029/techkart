import React, { useCallback, useEffect, useState } from "react";
import { ProductCard } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Search = () => {
  const navigate = useNavigate();
  let { searchValue } = useParams();
  if(searchValue === "all") searchValue = ""
  const allProducts = useSelector((state) => state.products.products);
  const [searchProducts, setSearchProducts] = useState([]);
    const filterProducts = useCallback(() => {
      const products = allProducts.filter((product) => {
        if (
          product.name.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue) ||
          product.company.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchValue))
        ) {
          return product;
        }
      });
      setSearchProducts(products);
    }, [searchValue, searchProducts]);

    useEffect(() => {
      if (!searchValue || allProducts.length === 0) {
        navigate("/");
      }else filterProducts()
    }, [searchValue]);

    if (searchProducts.length === 0) {
      return <div className="w-full text-center mt-10 font-bold text-2xl min-h-72">No Products Found</div>;
    }

  return (
    <div className="w-full flex flex-wrap items-start justify-evenly gap-3 gap-y-10 mt-10">
      {searchProducts.map((product) => (
        <ProductCard
          key={product.$id}
          name={product.name}
          price={product.price}
          image={product.image}
          openProduct={() => navigate(`/product/${product.$id}`)}
        />
      ))}
    </div>
  );
};

export default Search;
