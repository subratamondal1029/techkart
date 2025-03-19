import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadFile, deleteFile } from "../utils/fileUploader.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, tags = [], category, company } = req.body;

  const requiredFields = { name, description, price, category, company };

  // Validate required fields
  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new ApiError(400, `${field} is required`);
    }
  }

  const fileUrl = req.file?.path;
  if (!fileUrl) throw new ApiError(500, "File Upload failed");

  const image = await File.create({
    fileUrl,
  });

  if (!image) throw new ApiError(500, "File Upload failed");

  // Proceed with product creation if validation passes
  const product = Product.create({
    name,
    description,
    price,
    tags,
    category,
    company,
    sellerId: req.user._id,
    image: image._id,
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
  // default values taken from body
  const {
    page = 1,
    category,
    company,
    tags = [],
    sort = "d",
    sortBy = "$createdAt",
  } = req.body;

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

  if (category) filter.category = category;
  if (company) filter.company = company;
  if (tags.length > 0) filter.tags = { $in: tags };

  if (req.path.includes("seller")) {
    if (req.user.label !== "seller") throw new ApiError(403, "Unauthorized");

    filter.sellerId = req.user._id;
  } else {
    const { query } = req.body;
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [query] } },
      ];
    }
  }

  const products = await Product.find(filter)
    .limit(15)
    .skip(15 * (page - 1))
    .sort({ [sortBy]: sortFilter });

  res.json(new ApiResponse(200, "Product fetched Successfully", products));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  if (req.user._id !== product.sellerId)
    throw new ApiError(403, "Unauthorized");

  const image = await File.findById(product.image);

  const deleteResponse = await deleteFile(image.publicId);

  if (!deleteResponse.success) throw new ApiError(500, "File Deletion failed");

  await image.remove();

  await product.remove();

  res.json(new ApiResponse(200, "Product deleted successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  if (req.user._id !== product.sellerId)
    throw new ApiError(403, "Unauthorized");

  const { name, description, category, company, price, tags = [] } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (company) product.company = company;
  if (price) product.price = price;
  if (tags.length > 0) product.tags = tags;
  if (req.file?.path) {
    const uploadResponse = await uploadFile(
      req.file.path,
      `products/${req.user._id}`
    );

    if (!uploadResponse.success) throw new ApiError(500, "File Upload failed");

    const image = await File.findById(product.image);

    const deleteResponse = await deleteFile(image.publicId);

    if (!deleteResponse.success)
      throw new ApiError(500, "File Deletion failed");

    image.publicId = uploadResponse.public_id;
    image.fileUrl = uploadResponse.url;
    await image.save();

    product.image = image._id;
    await product.save();

    res.json(new ApiResponse(200, "Product updated successfully", product));
  }
});

export { createProduct, getProduct, getProducts, updateProduct, deleteProduct };
