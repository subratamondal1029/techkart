import wkhtmltopdf from "wkhtmltopdf";
import fs from "fs";
import path from "path";
import ApiError from "../../src/utils/apiError.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFile,
} from "../../src/utils/fileHandler.js";

const orderSample = {
  baseUrl: "http://localhost:8000",
  frontendRoute:
    "order/67eccbd95be609023c4e03bd" || "order?id=67eccbd95be609023c4e03bd",
  _id: "67eccbd95be609023c4e03bd",
  userId: "67e77e445c4f4364fe2825d0",
  cart: {
    products: [
      {
        product: {
          name: "RGB Gaming Mechanical Keyboard",
          price: 12999,
        },
        quantity: 2,
      },
    ],
  },
  totalAmount: 23998,
  customerName: "Rahul Sharma",
  customerPhone: "+919876543210",
  address: "123, MG Road, Kolkata, West Bengal, India - 700001",
  isShipped: true,
  isDelivered: false,
  isCancelled: false,
  statusUpdateDate: "2025-04-02T05:32:09.466Z",
  orderDate: "2025-04-02T05:32:09.466Z",
};

const formateDate = (date) => {
  date = new Date(date);
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
};

const calculateDiscount = (order) => {
  const { cart, totalAmount: paidAmount } = order;
  const totalAmount = cart.products.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  const discountAmount = totalAmount - paidAmount;
  const discountPercentage = Math.floor((discountAmount / totalAmount) * 100);
  return { totalAmount, discountPercentage };
};

const getProductTable = (order) => {
  const { discountPercentage, totalAmount: totalProductAmount } =
    calculateDiscount(order);

  return `<table class="productDetails">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
      ${order.cart.products
        .map(
          (product) => `
         <tr>
          <td class="product">
        ${product.product.name}
          </td>
          <td>${product.quantity}</td>
          <td>₹${product.product.price}</td>
        </tr>
        `
        )
        .join("")}
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          <td colspan="2" class="total">
            <div><span class="approxAmount">₹${totalProductAmount}</span> (${discountPercentage}%)</div>
            <span class="finalAmount">₹${order.totalAmount}</span>
          </td>
        </tr>
      </tfoot>
    </table>`;
};

const getShipmentHtml = (order) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shipment</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: sans-serif, serif, monospace;
      }

      #qrcode {
        width: 100%;
        max-width: 210px;
      }

      .shipmentDetails {
      width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .details {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .details p{
        font-size: 17px;
      }
      
      .details p strong {
      font-size: 13px;}

      .comLogo {
        width: 100px;
      }

      .customerDetails,
      .productDetails {
        margin-top: 25px;
      }

      .customerDetails {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .customerDetails p {
        margin-top: 5px;
      }

      .productDetails {
        width: 100%;
        border-collapse: collapse;
      }

      .productDetails th,
      .productDetails td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }

      .productDetails .product {
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Limit to 2 lines */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%; /* Adjust width if needed */
        height: 4em; /* Approx. height for 2 lines */
        line-height: 1.5em; /* Adjust for better spacing */
        word-wrap: break-word;
      }

      .productDetails tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      .productDetails tfoot,
      .productDetails thead {
        background-color: #1f1f1f;
        color: #f1f1f1;
        font-weight: bold;
      }

      .productDetails tfoot tr :first-child {
        border-right: none;
      }
      .productDetails tfoot tr :last-child {
        border-left: none;
      }

      tfoot .total .approxAmount {
        text-decoration: line-through;
        color: #adadad;
      }
      tfoot .total {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="shipmentDetails">
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?&data=${order._id}"
        alt="qrcode"
        id="qrcode"
      />
      <div class="details">
        <h1>Shipment</h1>
        <p>Order ID: <strong>${order._id}</strong></p>
        <p>Order Date: ${formateDate(order.orderDate)}</p>
        <p>Shipment Date: ${formateDate(
          order.statusUpdateDate || new Date().toISOString()
        )}</p>
        <p>Payment Method: online</p>
      </div>
      </div>
      <div class="customerDetails">
      <div>
      <h2>${order.customerName}</h2>
      <p>${order.address}</p>
      <p>${order.customerPhone}</p>
      </div>
      <!--- TODO: add company logo -->
      <img class="comLogo" src="${
        order.baseUrl
      }/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="techkart" /> 
    </div>
    ${getProductTable(order)}
  </body>
</html>
`;
};

const getDeliveryHtml = (order) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: sans-serif, serif, monospace;
        padding: 20px;
      }

      header {
        padding-block: 20px;
        margin-bottom: 15px;
        border-bottom: 3px solid rgb(24 38 51);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      header a {
        text-decoration: none;
        color: black;
      }

      .comLogo {
        width: 50px;
      }

      .orderDetails {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .shipmentDetails {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .customerDetails,
      .productDetails,
      .shipmentDetails {
        margin-top: 25px;
      }

      .customerDetails p {
        margin-top: 5px;
      }

      #qrcode {
        width: 100%;
        max-width: 190px;
      }

      .productDetails {
        width: 100%;
        border-collapse: collapse;
      }

      .productDetails th,
      .productDetails td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }

      .productDetails .product {
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Limit to 2 lines */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%; /* Adjust width if needed */
        height: 4em; /* Approx. height for 2 lines */
        line-height: 1.5em; /* Adjust for better spacing */
        word-wrap: break-word;
      }

      .productDetails tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      .productDetails tfoot,
      .productDetails thead {
        background-color: #1f1f1f;
        color: #f1f1f1;
        font-weight: bold;
      }

      .productDetails tfoot tr :first-child {
        border-right: none;
      }
      .productDetails tfoot tr :last-child {
        border-left: none;
      }

      tfoot .total .approxAmount {
        text-decoration: line-through;
        color: #adadad;
      }
      tfoot .total {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <header>
      <a href="${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}">
        <img class="comLogo" src="${
          order.baseUrl
        }/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="techkart" />
      </a>
      <p>
        Invoice
        <strong>
          <a href="${
            process.env.FRONTEND_BASE_URL || "http://localhost:5173"
          }/${order.frontendRoute}"
            >#${order._id}</a
          ></strong
        >
      </p>
    </header>

    <div class="orderDetails">
      <div>
        <div class="customerDetails">
          <h2>${order.customerName}</h2>
          <p>${order.address}</p>
          <p>${order.customerPhone}</p>
        </div>

        <div class="shipmentDetails">
          <p>Order ID: ${order._id}</p>
          <p>Order Date: ${formateDate(order.orderDate)}</p>
          <p>Delivered Date: ${formateDate(
            order.statusUpdateDate || new Date().toISOString()
          )}</p>
          <p>Payment Method: online</p>
        </div>
      </div>

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?&data=${
          process.env.FRONTEND_BASE_URL || "http://localhost:5173"
        }/${order.frontendRoute}"
        alt="qrcode"
        id="qrcode"
      />
    </div>
      ${getProductTable(order)}
  </body>
</html>
`;
};

const createPdf = (html, pageSize, outputFile) => {
  return new Promise(async (res, rej) => {
    try {
      wkhtmltopdf(html, { pageSize })
        .on("error", async (err) => {
          deleteLocalFile(outputFile.path);
          rej(err);
          console.log("wkhtmltopdf error:", err);
        })
        .on("finish", () => {
          res(outputFile.path);
        })
        .pipe(outputFile);
    } catch (error) {
      deleteLocalFile(outputFile.path);
      rej(error);
    }
  });
};

/**
 * @typedef {Object} Order
 * @property {string} baseUrl - The base frontend URL, e.g., "http://localhost:8000"
 * @property {string} frontendRoute - The route to view order, e.g., "order/67eccbd95be609023c4e03bd" or "order?id=67eccbd95be609023c4e03bd"
 * @property {string} _id - Unique order ID
 * @property {string} userId - ID of the user who placed the order
 * @property {{
 *   products: Array<{
 *     product: {
 *       name: string,
 *       price: number
 *     },
 *     quantity: number
 *   }>
 * }} cart - Cart details with product and quantity
 * @property {number} totalAmount - Final payable amount after discount
 * @property {string} customerName - Full name of the customer
 * @property {string} customerPhone - Customer's contact number
 * @property {string} address - Full shipping address
 * @property {boolean} isShipped - Shipment status
 * @property {boolean} isDelivered - Delivery status
 * @property {boolean} isCancelled - Cancellation status
 * @property {string} statusUpdateDate - Last status update timestamp (ISO string)
 * @property {string} orderDate - Order placement timestamp (ISO string)
 * @property {ObjectId} invoiceId - ID of the shipment invoice
 *
 * @example
 * const order = {
 *   baseUrl: "http://localhost:8000",
 *   frontendRoute: "order/67eccbd95be609023c4e03bd", // or "order?id=67eccbd95be609023c4e03bd"
 *   _id: "67eccbd95be609023c4e03bd",
 *   userId: "67e77e445c4f4364fe2825d0",
 *   cart: {
 *     products: [
 *       {
 *         product: { name: "RGB Gaming Mechanical Keyboard", price: 12999 },
 *         quantity: 2
 *       }
 *     ]
 *   },
 *   totalAmount: 23998,
 *   customerName: "Rahul Sharma",
 *   customerPhone: "+919876543210",
 *   address: "123, MG Road, Kolkata, West Bengal, India - 700001",
 *   isShipped: true,
 *   isDelivered: false,
 *   isCancelled: false,
 *   statusUpdateDate: "2025-04-02T05:32:09.466Z",
 *   invoice: "67eccbd95be609023c4e03bd",
 *   orderDate: "2025-04-02T05:32:09.466Z"
 * };
 * @returns {Promise<ObjectId>} Promise resolving to the File ID of the uploaded generated invoice
 */

const genInvoice = async (order = orderSample) => {
  try {
    let type;
    if (order.isShipped && !order.isDelivered) {
      type = "shipment";
    } else if (order.isShipped && order.isDelivered) {
      type = "delivery";
    } else {
      throw new ApiError(403, "Order is not shipped or delivered");
    }

    const pageSize = type === "delivery" ? "A4" : "A6";
    const outputFile = fs.createWriteStream(
      path.resolve(`storage/invoices/${order._id}_${type}.pdf`)
    );
    const html =
      type === "delivery" ? getDeliveryHtml(order) : getShipmentHtml(order);

    await createPdf(html, pageSize, outputFile);
    console.log(`PDF is successfully generated at ${outputFile.path}`);

    const file = await uploadFile(
      outputFile.path,
      "invoices",
      "invoice",
      order.userId
    );

    deleteLocalFile(outputFile.path);

    if (file && type === "delivery") {
      deleteFile(order.invoice);
    }

    return file._id;
  } catch (error) {
    console.log("Error while generating invoice:", error);
    throw error;
  }
};

export default genInvoice;
