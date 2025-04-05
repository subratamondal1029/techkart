import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import razorpay from "../config/razorpay.js";
import mongoose from "mongoose";
import genInvoice from "../../storage/invoices/index.js";

function formatPhoneNumber(phone) {
  if (!phone) throw new ApiError(400, "Phone number is required");

  // Remove all non-numeric characters except +
  phone = phone.replace(/[^\d+]/g, "");

  // If phone starts with multiple +, remove extras
  phone = phone.replace(/^\++/, "+");

  // If phone doesn't start with +, assume it's missing and add it
  if (!phone.startsWith("+")) {
    phone = `+${phone}`;
  }

  // Remove leading zeros after country code (+000123456789 → +123456789)
  phone = phone.replace(/\+0+/, "+");

  // Validate final format: + followed by 10-15 digits
  if (!/^\+\d{10,15}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number format");
  }

  return phone;
}

// get order data for user and for invoice generation
const getOrderData = async (id) => {
  try {
    const [order] = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
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
                        cond: {
                          $eq: ["$$product._id", "$$cartItem.productId"],
                        },
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
          statusUpdateDate: 1,
          invoice: 1,
        },
      },
    ]);

    if (!order) throw new ApiError(404, "Order not found");

    return order;
  } catch (error) {
    throw error;
  }
};

const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (amount === undefined) throw new ApiError(400, "Amount is required");
  if (Number(amount) <= 0)
    throw new ApiError(400, "Amount must be greater than 0");

  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
  };

  const order = await razorpay.orders.create(options);

  res.json(new ApiResponse(200, "Order generated successfully", order));
});

const paymentStatus = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;

  if (!orderId) throw new ApiError(400, "Order Is are required");

  let response = await razorpay.orders.fetch(orderId);

  const responseText = {
    created: "Payment Created Successfully But Not Paid",
    attempted: `Payment Attempted for ${response?.attempts} times but not Successful`,
    authorized: "Unauthorized Payment",
    paid: "Payment Successful",
    captured: "Payment Successful",
    refunded: "Payment Refunded Successfully",
    failed: "Payment Failed",
  };

  let responseData = {
    status: response.status,
    message: responseText[response.status],
  };

  if (response.status === "paid" && paymentId) {
    try {
      response = await razorpay.payments.fetch(paymentId);
    } catch (error) {
      throw new ApiError(error?.statusCode, error?.error?.description);
    }

    if (response.order_id !== orderId)
      throw new ApiError(400, "Payment Id and Order Id does not match");

    responseData = {
      ...responseData,
      amount: response.amount / 100,
      currency: response.currency,
      method: response.method,
      bank: response?.bank,
      wallet: response?.wallet,
      upi: response?.vpa,
      card: response?.card_id,
      paymentId: response.id,
      orderId: response.order_id,
    };
  }

  res.json(new ApiResponse(200, "Payment verified successfully", responseData));
});

const createOrder = asyncHandler(async (req, res) => {
  let { paymentId, cartId, customerName, customerPhone, customerAddress } =
    req.body;

  const requiredFields = {
    paymentId,
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

  customerPhone = formatPhoneNumber(customerPhone);

  let payment;
  try {
    payment = await razorpay.payments.fetch(paymentId);
  } catch (error) {
    throw new ApiError(error?.statusCode, error?.error?.description);
  }

  const cart = await Cart.findById(cartId);

  if (!cart) throw new ApiError(404, "Cart not found");
  if (req.user._id.toString() !== cart?.userId?.toString())
    throw new ApiError(403, "Unauthorized");
  if (cart.isOrdered) throw new ApiError(400, "Cart is already ordered");

  cart.isOrdered = true;
  await cart.save();

  const order = await Order.create({
    customerName,
    customerPhone,
    address: customerAddress,
    cart: cartId,
    paymentId,
    totalAmount: payment.amount / 100,
    userId: req.user._id,
  });

  if (!order) throw new ApiError(500, "Failed to create order");

  res
    .status(201)
    .json(new ApiResponse(201, "Order Placed successfully", order));
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderData(req.params.id);

  if (order.userId?.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  res.json(new ApiResponse(200, "Order Details Fetched", order));
});

const getOrders = asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;

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
  ])
    .limit(10)
    .skip((page - 1) * 10);

  res.json(new ApiResponse(200, "Orders Fetched", orders));
});

const updateContact = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { customerName, customerAddress, customerPhone } = req.body;

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");

  if (order.userId.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");
  if (order.isShipped)
    throw new ApiError(400, "Order is already shipped", [
      "Can't process after shipping",
    ]);
  if (order.isCancelled) throw new ApiError(400, "Order is already cancelled");

  if (!customerName && !customerAddress && !customerPhone)
    throw new ApiError(400, "At least one field is required");

  if (customerName) order.customerName = customerName;
  if (customerAddress) order.address = customerAddress;
  if (customerPhone) order.customerPhone = formatPhoneNumber(customerPhone);

  await order.save();

  res.json(new ApiResponse(200, "Order updated successfully", order));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");
  if (order.userId.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  if (order.isDelivered)
    throw new ApiError(400, "Order is already delivered", [
      "Order is already delivered",
      "Cannot cancel the order",
      "cannot cancel the order after delivery",
    ]);
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
  order.statusUpdateDate = new Date();
  await order.save();

  res.json(new ApiResponse(200, "Order cancelled successfully", order));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  let { isShipped, isDelivered, route } = req.body;

  if (!isShipped && !isDelivered)
    throw new ApiError(400, "isShipped or isDelivered is required");
  if (isDelivered && !route) throw new ApiError(400, "Route is required");

  const order = await getOrderData(req.params.id);

  if (!order) throw new ApiError(404, "Order not found");
  if (order.isCancelled) throw new ApiError(400, "Order is already cancelled");
  if (order.isDelivered) throw new ApiError(400, "Order is already delivered");

  const userLabel = req.user.label;
  const isAllowed =
    (isShipped && (userLabel === "shipment" || userLabel === "admin")) ||
    (isDelivered && (userLabel === "delivery" || userLabel === "admin"));
  if (!isAllowed) throw new ApiError(403, "Unauthorized request");

  if (isShipped) {
    if (order.isShipped) throw new ApiError(400, "Order is already shipped");
    order.isShipped = true;
  }

  if (isDelivered) {
    if (!order.isShipped) throw new ApiError(400, "Order is not shipped yet");
    order.isDelivered = true;
  }

  order.statusUpdateDate = new Date();

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const frontendRoute = route?.replace(":id", "");
  const invoice = await genInvoice({ ...order, baseUrl, frontendRoute });

  if (!invoice) throw new ApiError(500, "Failed to generate invoice");

  const updatedOrder = await Order.findByIdAndUpdate(
    order._id,
    {
      $set: {
        invoice,
        isShipped: order.isShipped,
        isDelivered: order.isDelivered,
        statusUpdateDate: order.statusUpdateDate,
      },
    },
    { new: true }
  );

  res.json(
    new ApiResponse(
      200,
      `${isDelivered ? "Order is delivered" : "Order is Shipped"} successfully`,
      updatedOrder
    )
  );
});

export {
  generateRazorpayOrder,
  paymentStatus,
  createOrder,
  getOrder,
  getOrders,
  updateContact,
  updateOrderStatus,
  cancelOrder,
};
