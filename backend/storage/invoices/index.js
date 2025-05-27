import fs from "fs";
import path from "path";
import ApiError from "../../src/utils/apiError.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFile,
} from "../../src/utils/fileHandler.js";
import QrCode from "qrcode";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
// Assign VFS (font file system) correctly
pdfMake.vfs = pdfFonts.vfs;

const orderSample = {
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

async function getImageBase64(filePath) {
  let mimeType = "image/png";
  let base64 = fs.readFileSync(filePath).toString("base64");

  return `data:${mimeType};base64,${base64}`;
}
const logo = await getImageBase64("./public/logo.png");

const getShipmentDefinition = async (order) => ({
  pageSize: "A6",
  pageMargins: [10, 10, 10, 10],
  defaultStyle: { font: "Roboto" },
  watermark: {
    text: "TechKart",
    color: "#A7A7A7",
    opacity: 0.2,
    bold: true,
    italics: false,
    fontSize: 40,
  },
  content: [
    {
      image: "qrcode",
      width: 120,
      alignment: "center",
      margin: [0, 0, 0, 10],
    },
    {
      stack: [
        {
          text: "Subrata Mondal",
          style: "address",
          bold: true,
          fontSize: 12,
        },
        {
          text: "paschim alichak pakar pull, West Bengal, East Midnapore, 721430, India",
          style: "address",
        },
        { text: "+91 9832674420", style: "address" },
      ],
      margin: [0, 10, 0, 20],
    },
    {
      stack: [
        { text: "Shipment Details", bold: true, fontSize: 12, style: "info" },
        { text: order._id, style: "info" },
        {
          text: `Order Date: ${formateDate(order.orderDate)}`,
          style: "info",
        },
        { text: "Payment Method: online", style: "info" }, //TODO: add payment mode in database
      ],
      margin: [0, 0, 0, 10],
    },
    {
      image: "logo",
      width: 40,
      alignment: "right",
      margin: [0, 50, 0, 0],
    },
  ],
  styles: {
    info: { fontSize: 10, lineHeight: 1.3 },
    address: {
      fontSize: 10,
      lineHeight: 1.5,
    },
  },
  images: {
    qrcode: await QrCode.toDataURL(order._id),
    logo,
  },
});

const getDeliveryDefinition = async (order) => {
  const { discountPercentage, totalAmount } = calculateDiscount(order);

  const docDefinition = {
    pageSize: "A4",
    watermark: {
      text: "TechKart",
      color: "#A7A7A7",
      opacity: 0.2,
      bold: true,
      italics: false,
      fontSize: 40,
    },
    pageMargins: [40, 60, 40, 60],
    content: [
      {
        columns: [
          {
            image: "logo",
            width: 50,
          },
          {
            text: [
              "Invoice ",
              {
                text: `#${order._id}`,
                bold: true,
                link: `${
                  process.env.FRONTEND_BASE_URL || "http://localhost:5173"
                }/${order.frontendRoute}`,
                color: "blue",
              },
            ],
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        columns: [
          [
            { text: order.customerName, style: "header" },
            { text: order.address },
            { text: order.customerPhone },
            { text: `Order Date: ${formateDate(order.orderDate)}` },
            {
              text: `Delivered Date: ${formateDate(
                order.statusUpdateDate || new Date().toISOString()
              )}`,
            },
            { text: "Payment Method: online" }, //TODO: add payment mode in database
          ],
          {
            image: "qrcode",
            width: 120,
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto"],
          body: [
            [
              { text: "Product", style: "tableHeader" },
              { text: "Quantity", style: "tableHeader" },
              { text: "Price", style: "tableHeader" },
            ],
            ...order.cart.products.map((p) => [
              String(p.product.name),
              String(p.quantity),
              `₹${p.product.price}`,
            ]),
            [
              { text: "Total", colSpan: 1 },
              { text: "", border: [false, false, false, false] },
              {
                stack: [
                  {
                    text: `₹${totalAmount} (${discountPercentage}%)`,
                    decoration: "lineThrough",
                    color: "gray",
                  },
                  { text: `₹${order.totalAmount}`, bold: true },
                ],
                alignment: "right",
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      tableHeader: {
        bold: true,
        fillColor: "#1f1f1f",
        color: "#f1f1f1",
      },
    },
    images: {
      // fill with base64 later
      qrcode: await QrCode.toDataURL(
        `${process.env.FRONTEND_BASE_URL || "http://localhost:5173"}/${
          order.frontendRoute
        }`
      ),
      logo: logo,
    },
  };

  return docDefinition;
};

const createPdf = (docDefinition, outputFile) => {
  return new Promise(async (res, rej) => {
    try {
      pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
        fs.writeFileSync(outputFile, buffer);
        res(outputFile);
      });
    } catch (error) {
      deleteLocalFile(outputFile);
      rej(error);
    }
  });
};

/**
 * @typedef {Object} Order
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

const genInvoice = async (order) => {
  try {
    let type;
    if (order.isShipped && !order.isDelivered) {
      type = "shipment";
    } else if (order.isShipped && order.isDelivered) {
      type = "delivery";
    } else {
      throw new ApiError(403, "Order is not shipped or delivered");
    }

    const outputFile = path.resolve(
      `storage/invoices/${order._id}_${type}.pdf`
    );

    const docDefinition =
      type === "delivery"
        ? await getDeliveryDefinition(order)
        : await getShipmentDefinition(order);

    await createPdf(docDefinition, outputFile);
    console.log(`PDF is successfully generated at ${outputFile}`); //TEST: only for testing

    const file = await uploadFile(
      outputFile,
      "invoices",
      "invoice",
      order.userId
    );

    deleteLocalFile(outputFile);

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
