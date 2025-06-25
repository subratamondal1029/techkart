import Image from "./Image";

const ProductNotFound = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-60 py-10">
      <Image
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="No products"
        className="w-24 h-24 mb-4 opacity-70"
      />
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        No Products Found
      </h2>
      <p className="text-gray-500 mb-4 text-center">
        {message ||
          "We couldn't find any products matching your search or filter."}
      </p>
    </div>
  );
};

export default ProductNotFound;
