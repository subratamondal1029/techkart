import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import razorpay from "../config/razorpay.js";
import mongoose from "mongoose";

const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) throw new ApiError(400, "Amount is required");

  const options = {
    amount: amount * 100,
    currency: "INR",
  };

  const order = await razorpay.orders.create(options);

  res.json(new ApiResponse(200, "Order generated successfully", order));
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    paymentId,
    totalAmount,
    cartId,
    customerName,
    customerPhone,
    customerAddress,
  } = req.body;

  const requiredFields = {
    paymentId,
    totalAmount,
    cartId,
    customerName,
    customerPhone,
    customerAddress,
  };

  // Validate required fields
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new ApiError(400, `${key} is required`);
    }
  }

  if (typeof totalAmount !== "number")
    throw new ApiError(400, "Invalid Amount", ["Amount must be a number"]);

  const cart = await Cart.findById(cartId);

  if (!cart) throw new ApiError(404, "Cart not found");
  if (req.user._id !== cart.userId) throw new ApiError(403, "Unauthorized");
  if (cart.isOrdered) throw new ApiError(400, "Cart is already ordered");

  cart.isOrdered = true;
  await cart.save();

  const order = await Order.create({
    customerName,
    customerPhone,
    address: customerAddress,
    cart: cartId,
    paymentId,
    totalAmount,
    userId: req.user._id,
  });

  if (!order) throw new ApiError(500, "Failed to create order");

  res
    .status(201)
    .json(new ApiResponse(201, "Order Placed successfully", order));
});

const getOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const [order] = await Order.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(orderId), userId: req.user._id } },
    {
      $lookup: {
        from: "carts",
        localField: "cart",
        foreignField: "_id",
        as: "cart",
      },
    },
    { $unwind: "$cart" },
    {
      $lookup: {
        from: "products",
        localField: "cart.products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $addFields: {
        "cart.products": {
          $map: {
            input: "$cart.products",
            as: "cartItem",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      as: "product",
                      cond: { $eq: ["$$product._id", "$$cartItem.productId"] },
                    },
                  },
                  0,
                ],
              },
              quantity: "$$cartItem.quantity",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        "cart._id": 1,
        "cart.products": 1,
        customerName: 1,
        customerPhone: 1,
        address: 1,
        paymentId: 1,
        totalAmount: 1,
        orderDate: 1,
        userId: 1,
        isCancelled: 1,
        isShipped: 1,
        isDelivered: 1,
      },
    },
  ]);

  if (!order) throw new ApiError(404, "Order not found");
  if (order.userId !== req.user._id) throw new ApiError(403, "Unauthorized");

  res.json(new ApiResponse(200, "Order Details Fetched", order));
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    { $match: { userId: req.user._id } },
    {
      $lookup: {
        from: "carts",
        localField: "cart",
        foreignField: "_id",
        as: "cart",
      },
    },
    {
      $unwind: "$cart",
    },
    {
      $lookup: {
        from: "products",
        localField: "cart.products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $addFields: {
        "cart.products": {
          $map: {
            input: "$cart.products",
            as: "cartItem",
            in: {
              product: {
                $first: {
                  $filter: {
                    input: "$productDetails",
                    as: "product",
                    cond: { $eq: ["$$product._id", "$$cartItem.productId"] },
                  },
                },
              },
              quantity: "$$cartItem.quantity",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        "cart._id": 1,
        "cart.products": 1,
        customerName: 1,
        customerPhone: 1,
        address: 1,
        paymentId: 1,
        totalAmount: 1,
        orderDate: 1,
        userId: 1,
        isCancelled: 1,
        isShipped: 1,
        isDelivered: 1,
      },
    },
  ]);

  res.json(new ApiResponse(200, "Orders Fetched", orders));
});

const updateContact = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { customerName, customerAddress, customerPhone } = req.body;

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");
  if (order.userId !== req.user._id) throw new ApiError(403, "Unauthorized");
  if (order.isShipped)
    throw new ApiError(400, "Order is already shipped", [
      "Can't process after shipping",
    ]);
  if (order.isCancelled) throw new ApiError(400, "Order is already cancelled");

  if (!customerName && !customerAddress && !customerPhone)
    throw new ApiError(400, "At least one field is required");

  if (customerName) order.customerName = customerName;
  if (customerAddress) order.address = customerAddress;
  if (customerPhone) order.customerPhone = customerPhone;

  await order.save();

  res.json(new ApiResponse(200, "Order updated successfully", order));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");
  if (order.userId !== req.user._id) throw new ApiError(403, "Unauthorized");
  if (order.isShipped)
    throw new ApiError(400, "Order is already shipped", [
      "order is already shipped",
      "Cannot cancel the order",
      "cannot cancel the order after shipping",
    ]);
  if (order.isCancelled) throw new ApiError(400, "Order is already cancelled");

  order.isCancelled = true;

  await razorpay.payments.refund(order.paymentId, {
    amount: order.totalAmount * 100,
  });

  order.isRefund = true;
  await order.save();

  res.json(new ApiResponse(200, "Order cancelled successfully", order));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { isShipped, isDelivered, invoice } = req.body;

  if (!isShipped && !isDelivered)
    throw new ApiError(400, "IsShipped or IsDelivered is required");
  if (!invoice) throw new ApiError(400, "Invoice is required");

  const order = await Order.findById(req.params.id);

  if (!order) throw new ApiError(404, "Order not found");
  if (order.isCancelled) throw new ApiError(400, "Order is already cancelled");

  const createdUser = await User.findById(order.userId);
  if (
    createdUser.label !== "shipment" &&
    createdUser.label !== "admin" &&
    createdUser.label !== "delivery"
  )
    throw new ApiError(403, "Unauthorized request");

  if (isShipped) {
    if (order.isShipped) throw new ApiError(400, "Order is already shipped");

    order.isShipped = true;
  }

  if (isDelivered) {
    if (order.isDelivered)
      throw new ApiError(400, "Order is already delivered");

    order.isDelivered = true;
  }

  if (invoice) order.invoice = invoice;

  await order.save();

  res.json(
    new ApiResponse(
      200,
      `${isDelivered} ? "Order is delivered" : "Order is Shipped`,
      order
    )
  );
});

export {
  generateRazorpayOrder,
  createOrder,
  getOrder,
  getOrders,
  updateContact,
  updateOrderStatus,
  cancelOrder,
};
