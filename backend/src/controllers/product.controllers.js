import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { deleteFile } from "../utils/fileHandler.js";

const createProduct = asyncHandler(async (req, res) => {
  let {
    name,
    description,
    price,
    tags = [],
    category,
    company,
    image,
  } = req.body;

  if (req.user.label !== "seller" && req.user.label !== "admin")
    throw new ApiError(403, "Unauthorized");

  const requiredFields = { name, description, price, category, company, image };

  // Validate required fields
  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new ApiError(400, `${field} is required`);
    }
  }

  tags = tags.map((tag) => tag.trim()?.toLowerCase());

  const isImageAvailable = File.findOne(image);
  if (!isImageAvailable) throw new ApiError(404, "Image not found");

  // Proceed with product creation if validation passes
  const product = await Product.create({
    name,
    description,
    price,
    tags,
    category,
    company,
    sellerId: req.user._id,
    image,
  });

  if (!product) throw new ApiError(500, "Product creation failed");

  res
    .status(201)
    .json(new ApiResponse(201, "Product created successfully", product));
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  res.json(new ApiResponse(200, "Product Details Fetched", product));
});

const getProducts = asyncHandler(async (req, res) => {
  let {
    page = 1,
    category,
    company,
    sort = "d",
    sortBy = "$createdAt",
    query,
  } = req.query;

  let sortFilter;

  if (sort === "d") {
    //newest first
    sortFilter = -1;
  } else if (sort === "a") {
    //oldest first
    sortFilter = 1;
  } else {
    throw new ApiError(400, "Invalid sort value");
  }

  const filter = {};

  if (category?.trim())
    filter.category = { $regex: category?.trim?.(), $options: "i" };
  if (company?.trim())
    filter.company = { $regex: company?.trim?.(), $options: "i" };

  if (req.path.includes("seller")) {
    if (req.user.label !== "seller" && req.user.label !== "admin")
      throw new ApiError(403, "Unauthorized");

    filter.sellerId = req.user._id;
  }

  if (query?.trim()) {
    query = query?.trim()?.toLowerCase();
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { company: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { tags: { $in: query } },
    ];
  }

  page = Number(page);
  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(15)
    .skip(15 * (page - 1))
    .sort({ [sortBy]: sortFilter });

  let response = {
    products,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / 15),
  };

  if (page === 1 && req.path.includes("seller")) {
    response.totalProducts = totalProducts;
  }

  res.json(new ApiResponse(200, "Product fetched Successfully", response));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  if (req.user._id.toString() !== product.sellerId.toString())
    throw new ApiError(403, "Unauthorized");

  await deleteFile(product.image);

  await product.deleteOne();

  res.json(new ApiResponse(200, "Product deleted successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  if (req.user._id.toString() !== product.sellerId.toString())
    throw new ApiError(403, "Unauthorized");

  const {
    name,
    description,
    category,
    company,
    image,
    price,
    tags = [],
  } = req.body;

  if (image)
    throw new ApiError(400, "Image is not allowed", [
      "update image with /files endpoint",
    ]);
  if (name?.trim()) product.name = name?.trim();
  if (description?.trim()) product.description = description?.trim();
  if (category?.trim()) product.category = category?.trim();
  if (company?.trim()) product.company = company?.trim();
  if (price) product.price = price;
  if (tags.length > 0) product.tags = tags;

  await product.save();
  res.json(new ApiResponse(200, "Product updated successfully", product));
});

export { createProduct, getProduct, getProducts, updateProduct, deleteProduct };
