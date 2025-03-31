import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Cart from "../models/cart.model.js";

const addProductToCart = asyncHandler(async (req, res) => {
  const { product } = req.body;

  if (!product || Object.entries(product).length === 0)
    throw new ApiError(400, "Product is required");

  if (!product.productId) throw new ApiError(400, "ProductId is required");

  let cart = await Cart.findOne({ userId: req.user._id, isOrdered: false });

  if (!cart) {
    cart = new Cart({
      userId: req.user._id,
    });
  }

  const availableProductIndex = cart.products.findIndex(
    (p) => p.productId.toString() === product.productId.toString()
  );

  if (availableProductIndex !== -1) {
    const existingProduct = cart.products[availableProductIndex];

    if (typeof product.quantity === "number") {
      if (existingProduct.quantity === product.quantity) {
        throw new ApiError(400, "Quantity must be more or less than current");
      } else if (product.quantity === 0) {
        cart.products.splice(availableProductIndex, 1);
      } else {
        existingProduct.quantity = product.quantity;
      }
    }
  } else {
    if (product.quantity === 0)
      throw new ApiError(400, "Quantity must be more than 0");
    cart.products.push(product);
  }

  await cart.save();

  res.json(new ApiResponse(200, "Cart updated successfully", cart));
});

const getCart = asyncHandler(async (req, res) => {
  const [cart] = await Cart.aggregate([
    { $match: { userId: req.user._id, isOrdered: false } },
    { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: { path: "$product", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: "$_id",
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
    {
      $addFields: {
        products: {
          $cond: {
            if: { $eq: ["$products", [{}]] },
            then: [],
            else: "$products",
          },
        },
      },
    },
  ]);

  if (!cart) throw new ApiError(404, "Cart not found");

  res.json(new ApiResponse(200, "Cart fetched successfully", cart));
});

export { addProductToCart, getCart };
