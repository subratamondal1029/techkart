import nodemailer from "nodemailer";
import Order from "../models/order.model.js";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import User from "../models/user.model.js";

const getOrderDetails = async (orderId) => {
  const [order] = await Order.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "carts",
        localField: "cart",
        foreignField: "_id",
        as: "cart",
        pipeline: [
          {
            $project: {
              products: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$cart",
    },
    {
      $unwind: "$cart.products",
    },
    {
      $lookup: {
        from: "products",
        localField: "cart.products.productId",
        foreignField: "_id",
        as: "cart.product",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$cart.product",
    },
    {
      $group: {
        _id: "$_id",
        products: {
          $push: {
            name: "$cart.product.name",
          },
        },
        user: { $first: "$user" },
        orderDate: { $first: "$orderDate" },
        totalAmount: { $first: "$totalAmount" },
        customerName: { $first: "$customerName" },
        address: { $first: "$address" },
        statusUpdateDate: { $first: "$statusUpdateDate" },
        paymentId: { $first: "$paymentId" },
      },
    },
  ]);

  return order;
};

const formateAddress = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    const first = arr[i];
    const second = arr[i + 1] || "";
    result.push(first + second);
  }

  return result.join("<br />");
};

const formateDate = (ISODate) => {
  const date = new Date(ISODate);

  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
};

const getConfirmationMailInfo = async (orderId, baseUrl, orderRoute) => {
  const order = await getOrderDetails(orderId);

  const orderConfirmBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
  <div style="text-align: center;">
    <img src="${baseUrl}/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="Logo" style="max-width: 120px; margin-bottom: 20px;" />
  </div>
  <h2 style="color: #2b2b2b;">Order Confirmed! 🎉</h2>
  <p style="color: #555;">Hello, ${order.user.name}</p>
  <p style="color: #555;">
    Thank you for your order. We have received your order and it is being processed.
  </p>

  <h3 style="color: #2b2b2b;">Order Details:</h3>
  <ul style="color: #555;">
  ${order.products.map((product) => `<li>${product.name}</li>`).join("")}
  </ul>

  <p style="color: #555;">
    Order Number: <strong><a href="${orderRoute}">#${
    order._id
  }</a></strong><br />
    Order Date: <strong>${formateDate(order.orderDate)}</strong>
  </p>

  <p style="color: #555;">
    We will notify you once your order has been shipped.
  </p>

  <p style="color: #555;">
    Thanks for shopping with us!
  </p>

  <hr />
  <p style="font-size: 12px; color: #aaa;">
    This is an automated email. Please do not reply.
  </p>
</div>
`;

  return { body: orderConfirmBody, subject: "Order Confirmed!" };
};

const getShippedMailInfo = async (orderId, baseUrl, orderRoute) => {
  const order = await getOrderDetails(orderId);

  const shippedMailBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
  <div style="text-align: center;">
    <img src="${baseUrl}/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="Logo" style="max-width: 120px; margin-bottom: 20px;" />
  </div>
  <h2 style="color: #2b2b2b;">Your Order Has Shipped! 🚚</h2>
  <p style="color: #555;">Hello, ${order.user.name}</p>
  <p style="color: #555;">We’re happy to inform you that your order has been shipped.</p>

  <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <strong>Shipping Status:</strong> <span style="color: green;">Shipped</span><br />
    <strong>Shipped Date:</strong> ${formateDate(order.statusUpdateDate)}<br />
    <strong>Tracking Number:</strong>
    <a href="${orderRoute}" style="color: #1a73e8;">${order._id}</a><br />
    <strong>Carrier:</strong> <i>N/A</i>
  </div>

  <h3 style="color: #2b2b2b;">Shipping Address:</h3>
  <p style="color: #555; line-height: 1.5; margin-left: 10px;">
    ${order.customerName}<br />
    ${formateAddress(order.address.split(","))}
  </p>

  <h3 style="color: #2b2b2b; margin-top: 20px;">Order Details:</h3>
  <ul style="color: #555;">
  ${order.products.map((product) => `<li>${product.name}</li>`).join("")}
  </ul>

  <p style="color: #555;">You can click the tracking number above to see your shipment’s status.</p>
  <p style="color: #555;">Thank you for shopping with us!</p>
  <hr />
  <p style="font-size: 12px; color: #aaa;">This is an automated email. Please do not reply.</p>
</div>
`;

  return { body: shippedMailBody, subject: "Your Order Has Shipped!" };
};

const getDeliveredMailInfo = async (orderId, baseUrl, orderRoute) => {
  const order = await getOrderDetails(orderId);

  const deliveryMailBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
  <div style="text-align: center;">
    <img src="${baseUrl}/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="Logo" style="max-width: 120px; margin-bottom: 20px;" />
  </div>
  <h2 style="color: #2b2b2b;">Your Order Was Delivered! 📦</h2>
  <p style="color: #555;">Hello, ${order.user.name}</p>
  <p style="color: #555;">We’re glad to let you know that your order has been successfully delivered.</p>

  <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <strong>Delivery Status:</strong> <span style="color: green;">Delivered</span><br />
    <strong>Delivered On:</strong> May 23, 2025<br />
    <strong>Tracking Number:</strong> <a href="${orderRoute}" style="color: #1a73e8;">#${
    order._id
  }</a><br />
    <strong>Carrier:</strong> <i>N/A</i>
  </div>

  <h3 style="color: #2b2b2b;">Delivery Address:</h3>
  <p style="color: #555; line-height: 1.5; margin-left: 10px;">
    ${order.customerName}<br />
    ${formateAddress(order.address.split(","))}
  </p>

  <h3 style="color: #2b2b2b;">Order Summary:</h3>
  <ul style="color: #555;">
  ${order.products.map((product) => `<li>${product.name}</li>`).join("")}
  </ul>

  <p style="color: #555;">We hope you enjoy your purchase! If you have any questions or feedback, feel free to contact us.</p>
  <p style="color: #555;">Thanks for choosing us!</p>

  <hr />
  <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply.</p>
</div>
`;

  return { body: deliveryMailBody, subject: "Your Order Has Delivered!" };
};

const getRefundMailInfo = async (orderId, baseUrl, orderRoute) => {
  const order = await getOrderDetails(orderId);
  const paymentDetails = await razorpay.payments.fetch(order.paymentId);

  const refundMailBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
  <div style="text-align: center;">
    <img src="${baseUrl}/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="Logo" style="max-width: 120px; margin-bottom: 20px;" />
  </div>
  <h2 style="color: #2b2b2b;">Refund Processed 💸</h2>
  <p style="color: #555;">Hello, ${order.user.name}</p>
  <p style="color: #555;">
    We have processed a refund for your order.
  </p>

  <p style="color: #555;">
    <strong>Refund Amount:</strong> ₹${
      paymentDetails.amount / 100
    } <br /> <br />
    <strong>Order ID:</strong> 
    <a href="${orderRoute}" style="color: #1a73e8;">#${order._id}</a>
  </p>

  <p style="color: #555;">
    The amount should reflect in your account within 5-7 business days.
  </p>

  <p style="color: #555;">
    If you have any questions, feel free to contact our support team.
  </p>

  <hr />
  <p style="font-size: 12px; color: #aaa;">
    This is an automated email. Please do not reply.
  </p>
</div>
`;

  return { body: refundMailBody, subject: "Refund Processed" };
};

/**
 * Sends an email using the configured SMTP transporter.
 *
 * @async
 * @function sendMail
 * @param {Object} params - The parameters for sending the email.
 * @param {string} params.receivers - The recipient email address(es) separated by commas.
 * @param {string} params.subject - The subject of the email.
 * @param {string} params.body - The HTML body content of the email.
 */
const sendMail = async ({ receivers, subject, body }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const response = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: receivers,
      subject,
      html: body,
    });

    console.log(`Email sent to ${receivers}: ${response.messageId}`);
  } catch (error) {
    console.error(
      `Error while sending mail "${subject} to ${receivers}": ${error}`
    );
  }
};

/**
 * Sends an order status update email to the user.
 * @async
 * @function sendOrderStatusUpdateMail
 * @param {Object} params
 * @param {string} params.orderId - The ID of the order.
 * @param {string} params.orderRoute - The frontend route for the order.
 * @param {string} params.receiver - The recipient's email address.
 * @param {string} params.userId - The recipient user ID of database.
 * @param {string} params.baseUrl - The base URL for assets.
 * @param {"confirmed" | "shipped" | "delivered" | "refunded"} params.status - The status of the order.
 */

const sendOrderStatusUpdateMail = async ({
  orderId,
  orderRoute,
  status,
  userId,
  receiver,
  baseUrl,
}) => {
  try {
    if (!receiver) {
      const user = await User.findById(userId);
      receiver = user.email;
    }

    const route = `${process.env.FRONTEND_BASE_URL}/${orderRoute}`;

    let method;
    if (status === "confirmed") {
      method = getConfirmationMailInfo;
    } else if (status === "shipped") {
      method = getShippedMailInfo;
    } else if (status === "delivered") {
      method = getDeliveredMailInfo;
    } else if (status === "refunded") {
      method = getRefundMailInfo;
    }

    const { body, subject } = await method(orderId, baseUrl, route);

    sendMail({
      receivers: receiver,
      subject,
      body,
    });
  } catch (error) {
    console.log(
      `Error while sending order status update mail to ${receiver}": ${error}`
    );
  }
};

export { sendOrderStatusUpdateMail };
export default sendMail;
