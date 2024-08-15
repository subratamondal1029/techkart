import PdfMake from "pdfmake/build/pdfmake.js";
import PdfFonts from "pdfmake/build/vfs_fonts.js";

function generatePdf(type, data) {
  return new Promise(async (resolve, reject) => {
    try {
      // Configure PDFMake with fonts
      PdfMake.vfs = PdfFonts.pdfMake.vfs;
      let docDefinition;

      // PDF document definition
      if (type === "shipped") {
          docDefinition = createShipmentPdf(data);
      }else if(type === "delivered"){
          docDefinition = createDeliveredPdf(data);
      }else reject("Invalid type");

      // Generate the PDF and return it
      PdfMake.createPdf(docDefinition).getBlob(async (blob) => {
        const file = new File([blob], `${data.orderId}.pdf`, { type: blob.type });
       resolve(file);
      })
    } catch (error) {
      reject(error);
    }
  });
}

function createShipmentPdf (data){
    const docDefinition = {
        pageSize: "A5",
        content: [
          { qr: data.orderId, fit: '150', margin: [0, 0, 0, 20] },
          {
            text: [
                { text: 'Customer Name: ', bold: true }, // Bold heading
                data.customerName
            ],
            margin: [0, 0, 0, 10],
            fontSize: 12,
          },
          {
            text: [
                { text: 'Address: ', bold: true }, // Bold heading
                data.address
            ],
            margin: [0, 0, 0, 20],
            fontSize: 10,
            width: 500,
            lineHeight: 1.2,
          },
          {
            text: [
                { text: 'Contact: ', bold: true }, // Bold heading
                data.contact
            ],
            margin: [0, 0, 0, 20],
            fontSize: 12,
          },
          {
            text: "Product Details",
            bold: true,
            fontSize: 14,
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              widths: ["*", "*", "*"], // Define column widths
              body: [
                [
                  { text: "Product", bold: true },
                  { text: "Quantity", bold: true },
                  { text: "Price", bold: true },
                ],
                ...data.products.map((product) => [
                  { text: product.name, alignment: "left", noWrap: false, fontSize: 10 },
                  product.quantity,
                  `₹${Number(product.price).toLocaleString("en-IN")}`,
                ]),
                [
                  "",
                  "",
                  {
                    text: `Total: ₹${data.products
                      .reduce((acc, product) => acc + product.price * product.quantity, 0).toLocaleString("en-IN")}`,
                    bold: true,
                  },
                ], // Summary row
              ],
            },
            layout: "lightHorizontalLines", // Table layout
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
          },
        },
      }

      return docDefinition
}

function createDeliveredPdf (data){
  const docDefinition = {
    pageSize: 'A4',
    content: [
        {
            text: `Invoice for Order #${data.orderId}`,
            bold: true,
            fontSize: 18,
            margin: [0, 0, 0, 20],
        },
        {
            text: `Date: ${data.date}`,
            bold: true,
            fontSize: 18,
            margin: [0, 0, 0, 20],
        },
        {
            text: [
                { text: 'Customer Name: ', bold: true },
                data.customerName
            ],
            margin: [0, 0, 0, 10],
            fontSize: 12,
        },
        {
            text: [
                { text: 'Address: ', bold: true },
                data.address
            ],
            margin: [0, 0, 0, 20],
            fontSize: 12,
            lineHeight: 1.2,
        },
        {
            text: [
                { text: 'Contact: ', bold: true },
                data.contact
            ],
            margin: [0, 0, 0, 20],
            fontSize: 12,
        },
        {
            text: "Product Details",
            bold: true,
            fontSize: 14,
            margin: [0, 10, 0, 10],
        },
        {
            table: {
                widths: ["*", "*", "*"], // Define column widths
                body: [
                    [
                        { text: "Product", bold: true },
                        { text: "Quantity", bold: true },
                        { text: "Price", bold: true },
                    ],
                    ...data.products.map((product) => [
                        { text: product.name, fontSize: 10 },
                        product.quantity,
                        `₹${Number(product.price).toLocaleString("en-IN")}`,
                    ]),
                    [
                        "",
                        "",
                        {
                            text: `Total: ₹${data.products
                                .reduce((acc, product) => acc + product.price * product.quantity, 0).toLocaleString("en-IN")}`,
                            bold: true,
                        },
                    ],
                ],
            },
            layout: "lightHorizontalLines", // Table layout
        },
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
        },
    },
};

return docDefinition
}



export { generatePdf };
