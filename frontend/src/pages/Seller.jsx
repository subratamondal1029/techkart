import { useState, useEffect, useMemo, useOptimistic } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import {
  Button,
  Image,
  ImageUpload,
  Input,
  LoadingError,
  ProductNotFound,
  TextArea,
  UpdateForm,
  DataList,
  TagInput,
  Pagination,
} from "../components";
import productService from "../services/product.service";
import useLoading from "../hooks/useLoading";
import SellerTable from "../components/shimmers/SellerTable.shimmer"; //TODO: change the name to shimmer
import { CATEGORIES } from "../../constants";
import { CloudUpload } from "lucide-react";
import { startTransition } from "react";
import showToast from "../utils/showToast";
import delay from "../utils/delay";
import fileService from "../services/file.service";

const Seller = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState({});
  const [optimisticProducts, setOptimisticProducts] = useOptimistic(products);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    query: "",
    sortBy: "price",
    sort: "d",
  });

  const parameterQuery = useMemo(() => {
    return `page=${params.page}&query=${params.query}&sortBy=${params.sortBy}&sort=${params.sort}`;
  }, [params]);

  const setPage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const [fetchProducts, isProductLoading, productError] = useLoading(
    async () => {
      if (products?.[parameterQuery]) return;

      const { data } = await productService.getMany({
        ...params,
        isSeller: true,
      });

      setProducts((prev) => ({
        ...prev,
        [parameterQuery]: data.products,
      }));
      setTotalPages(data.totalPages);
    }
  );

  useEffect(() => {
    fetchProducts();
  }, [params]);

  const editFormOpener = (id) => {
    const product = products?.[parameterQuery]?.find((p) => p._id === id);
    setEditProduct(product);
    setIsFormOpen(true);
  };

  const submitHandler = async (data, methods) => {
    startTransition(async () => {
      try {
        data.price = Number(data.price);

        let product = {
          ...data,
          _id: editProduct?._id || crypto.randomUUID(),
          image: data.file
            ? URL.createObjectURL(data?.file)
            : editProduct?.image,
        };

        const updateProductState = (prev) => {
          const existing = prev[parameterQuery] || [];

          const updatedList = existing.map((p) =>
            p._id === product._id ? product : p
          );
          return {
            ...prev,
            [parameterQuery]: updatedList,
          };
        };
        const addNewProductState = (prev) => {
          return {
            ...prev,
            [parameterQuery]: [product, ...prev[parameterQuery]],
          };
        };

        if (editProduct) {
          const uniqueData = Object.fromEntries(
            Object.entries(data).filter(
              ([key, value]) => editProduct?.[key] !== value
            )
          );

          if (Object.keys(uniqueData).length === 0) {
            showToast("warning", "No changes detected");
            return;
          }

          setOptimisticProducts(updateProductState);
          let image = editProduct?.image;
          if (uniqueData.file) {
            const formData = new FormData();
            formData.set("file", uniqueData.file);
            const { data } = await fileService.update({
              id: image,
              formData,
            });
            image = data.file;

            delete uniqueData.file;
          }

          if (Object.keys(uniqueData).length > 0) {
            const { data } = await productService.update({
              id: product._id,
              ...product,
            });

            product = data;
          }

          setProducts(updateProductState);
        } else {
          setOptimisticProducts(addNewProductState);

          const formData = new FormData();
          formData.set("file", data.file);
          formData.set("entityType", "product");
          const { data: imageResponse } = await fileService.upload({
            formData,
          });

          const { data: newProduct } = await productService.create({
            ...product,
            image: imageResponse.file,
          });

          product = newProduct;
          setProducts(addNewProductState);
        }
      } catch (error) {
        console.error(error);
        showToast("error", error.message || "Something went wrong");
      }
    });
  };

  const deleteHandler = (id) => {
    startTransition(async () => {
      try {
        const deleteProductState = (prev) => {
          const products = prev[parameterQuery].filter((p) => p._id !== id);
          return {
            ...prev,
            [parameterQuery]: products,
          };
        };
        setOptimisticProducts(deleteProductState);

        await productService.delete(id);
        setProducts(deleteProductState);
      } catch (error) {
        console.log(error);
        showToast("error", error.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4 text-center bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Total Products
            <br />
            <span className="italic">200</span>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Income
            <br />
            <span className="italic">NA</span>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            Other
            <br />
            <span className="italic">NA</span>
          </div>
        </div>
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-center mb-4 gap-2 md:max-w-96 ml-auto mt-10">
          <form
            className="w-full relative"
            onSubmit={(e) => {
              e.preventDefault();
              setParams((prev) => ({
                ...prev,
                page: 1,
                query: e.target[0].value,
              }));
            }}
          >
            <Input type="text" placeholder="Search" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              <Search
                size={17}
                className="transition-transform duration-300 hover:scale-110"
                color="#000"
              />
            </Button>
          </form>
          <Button
            classname="px-4 py-1 rounded flex items-center justify-center gap-2"
            onClick={() => {
              setEditProduct(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={16} /> Add
          </Button>
        </div>
        {isProductLoading ? (
          <SellerTable />
        ) : productError ? (
          <LoadingError error={productError} retry={fetchProducts} />
        ) : (
          <>
            <Pagination
              page={params.page}
              setPage={setPage}
              totalPages={totalPages}
            >
              {optimisticProducts?.[parameterQuery]?.length === 0 ? (
                <ProductNotFound />
              ) : (
                <div className="border-t border-gray-300 py-2 min-h-96">
                  <div className="hidden md:grid grid-cols-8 gap-4 px-2 text-sm font-semibold mb-2">
                    <div>Image</div>
                    <div>Id</div>
                    <div>Name</div>
                    <div>Category</div>
                    <div>Company</div>
                    <div className="flex items-center justify-start gap-2">
                      <p>Price</p>
                      <p
                        onClick={() => {
                          setParams((prev) => ({
                            ...prev,
                            sort: prev.sort === "a" ? "d" : "a",
                          }));
                        }}
                        className="cursor-pointer transition-transform duration-300 hover:text-blue-600 hover:rotate-180"
                      >
                        ↑↓
                      </p>
                    </div>
                    <div>Stock</div>
                    <div className="text-center">Actions</div>
                  </div>

                  {/* Responsive Table Rows */}
                  {optimisticProducts?.[parameterQuery]?.map((item) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-2 md:grid-cols-8 gap-4 px-2 py-2 items-center border-t border-gray-200 hover:bg-blue-100 rounded text-xs sm:text-sm"
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${item._id}`}
                        className="w-12 h-12 col-span-1"
                      >
                        <Image
                          className="rounded"
                          key={item.image}
                          src={item.image}
                        />
                      </Link>
                      {/* Id */}
                      <div
                        className="hidden md:block max-w-24 truncate"
                        title={item._id}
                      >
                        {item._id}
                      </div>
                      {/* Name */}
                      <div className="truncate max-w-xs" title={item.name}>
                        {item.name}
                      </div>
                      {/* Category */}
                      <div className="hidden md:block">{item.category}</div>
                      {/* Company */}
                      <div className="hidden md:block">{item.company}</div>
                      {/* Price */}
                      <div>
                        <span className="hidden md:inline">
                          {Math.round(Number(item.price)).toLocaleString(
                            "en-In"
                          )}
                        </span>
                        <span className="block md:hidden text-gray-700">
                          ₹
                          {Math.round(Number(item.price)).toLocaleString(
                            "en-In"
                          )}
                          <span className="mx-1">×</span>
                          <span>{item.stock || "∞"}</span>
                        </span>
                      </div>
                      {/* Stock */}
                      <div className="hidden md:block">{item.stock || "∞"}</div>
                      {/* Actions */}
                      <div className="flex gap-2 justify-evenly col-span-1">
                        <button
                          onClick={() => editFormOpener(item._id)}
                          className="hover:bg-blue-200 p-1 rounded"
                        >
                          <Pencil size={16} className="text-blue-700" />
                        </button>
                        <button
                          className="hover:bg-red-200 p-1 rounded"
                          onClick={() => setDeleteId(item._id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Pagination>
          </>
        )}
      </div>

      {/* Update and Add product form */}
      {isFormOpen && (
        <UpdateForm setIsOpen={setIsFormOpen} onSubmit={submitHandler}>
          <ImageUpload
            classname="relative max-h-96 h-screen mt-5 rounded-md"
            src={editProduct?.image}
            placeholder={<CloudUpload size={50} />}
            rules={{ required: editProduct ? false : "Image is required" }}
            name="file"
          />
          <Input
            name="name"
            label="Product Name"
            placeholder="Product Name"
            defaultValue={editProduct?.name}
          />
          <Input
            name="company"
            label="Company"
            placeholder="Company"
            defaultValue={editProduct?.company}
          />
          <Input
            name="price"
            label="Price"
            type="number"
            placeholder="Price"
            defaultValue={editProduct?.price}
          />
          <div>
            <Input
              name="category"
              label="Category"
              placeholder="Category"
              defaultValue={editProduct?.category}
              list="category-list"
            />
            <DataList
              list={CATEGORIES}
              id="category-list"
              limit={5}
              inputName="category"
            />
          </div>
          <TagInput
            name="tags"
            label="Tags"
            defaultValue={editProduct?.tags}
            rules={{ required: false, minLength: 2 }}
          />
          <TextArea
            name="description"
            label="Description"
            defaultValue={editProduct?.description}
            placeholder="Description"
          />
        </UpdateForm>
      )}
      {deleteId && (
        <ConfirmDelete
          id={deleteId}
          setIsOpen={setDeleteId}
          handleDelete={deleteHandler}
        />
      )}
    </div>
  );
};

const ConfirmDelete = ({ id, setIsOpen, handleDelete }) => {
  useEffect(() => {
    document.body.classList.add("portal-open");
    return () => {
      document.body.classList.remove("portal-open");
    };
  }, []);

  return createPortal(
    <div
      className="fixed top-0 left-0 z-20 w-screen h-screen bg-black/50 flex justify-center items-center"
      onClick={() => setIsOpen(null)}
    >
      <div
        className="bg-white p-5 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">
          Are you sure you want to delete this product?
        </h3>
        <div className="flex justify-end gap-2 mt-5">
          <Button
            classname="bg-gray-400 hover:bg-gray-500 text-black px-3 py-1 rounded"
            onClick={() => setIsOpen(null)}
          >
            Cancel
          </Button>
          <Button
            classname="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white flex items-center gap-1 justify-center"
            onClick={() => {
              handleDelete(id);
              setIsOpen(null);
            }}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default Seller;
