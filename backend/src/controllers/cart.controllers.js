import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js";

const createCart = asyncHandler(async (req, res) => {
  const { product } = req.body;

  if (!product || Object.entries(product).length === 0)
    throw new ApiError(400, "Product is required");

  if (!product.productId || !product.quantity)
    throw new ApiError(400, "Product is required");

  const cart = await Cart.create({
    userId: req.user._id,
    products: [product],
  });

  if (!cart) throw new ApiError(500, "Failed to create cart");

  res.status(201).json(new ApiResponse(201, "Cart created successfully", cart));
});

const addProductToCart = asyncHandler(async (req, res) => {
  const { product } = req.body;
  const cartId = req.params.id;

  if (!product || Object.entries(product).length === 0)
    throw new ApiError(400, "Product is required");

  if (!product.productId || !product.quantity)
    throw new ApiError(400, "Product is required");

  const cart = await Cart.findById(cartId);
  if (!cart) throw new ApiError(404, "Cart not found");

  if (req.user._id !== cart.userId) throw new ApiError(403, "Unauthorized");

  const availableProductIndex = cart.products.findIndex(
    (p) => p.productId === product.productId
  );

  if (availableProductIndex !== -1) {
    cart.products[availableProductIndex].quantity = product.quantity;
  } else {
    cart.products.push(product);
  }

  await cart.save();

  res.json(new ApiResponse(200, "Product added to cart successfully", cart));
});

const getCart = asyncHandler(async (req, res) => {
  const cartId = req.params.id;

  const [cart] = await Cart.aggregate([
    { $match: { _id: cartId, userId: req.user._id, isOrdered: false } },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 0,
        product: "$product",
        quantity: "$products.quantity",
      },
    },
    {
      $group: {
        _id: "$_id",
        products: { $push: { product: "$product", quantity: "$quantity" } },
      },
    },
  ]);

  if (!cart) throw new ApiError(404, "Cart not found");

  res.json(new ApiResponse(200, "Cart fetched successfully", cart));
});

export { createCart, addProductToCart, getCart };
