import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode";

function generatePdf(type, data) {
  return new Promise(async (resolve, reject) => {
    try {
      let doc;

      if (type === "shipped") {
        doc = await createShipmentPdf(data);
      } else if (type === "delivered") {
        doc = await createDeliveredPdf(data);
      } else reject("Invalid type");

      const pdfBlob = doc.output("blob");
      const file = new File([pdfBlob], `${data.orderId}_${type}.pdf`, {
        type: pdfBlob.type,
      });
      resolve(file);
    } catch (error) {
      console.log("generatePdf :: error", error);
      reject(error);
    }
  });
}

async function createShipmentPdf(data) {
  const doc = new jsPDF({ unit: "pt", format: "a5" });


  doc.setFont('helvetica')

  const options = {
    errorCorrectionLevel: "H",
    type: "image/png",
    quality: 1,
    margin: 1,
    width: 300,
  };
  const qrCodeDataUrl = await QRCode.toDataURL(data.orderId, options);

  doc.addImage(qrCodeDataUrl, "PNG", 20, 20, 150, 150);

  doc.setFontSize(12);
  doc.text(`Customer Name: ${data.customerName}`, 20, 190);
  doc.text(`Address: ${data.address}`, 20, 210, { maxWidth: 500 });
  doc.text(`Contact: ${data.contact}`, 20, 250);

  doc.setFontSize(14);
  doc.text("Product Details", 20, 280);

  const products = data.products.map((product) => [
    { content: product.name, styles: { halign: "left" } },
    product.quantity,
    `RS. ${Number(product.price).toLocaleString("en-IN")}`,
  ]);
  
  const total = data.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  doc.autoTable({
    startY: 300,
    head: [["Product", "Quantity", "Price"]],
    body: [
      ...products,
      [
        "",
        "",
        {
          content: `Total: RS. ${total.toLocaleString("en-IN")}`,
          styles: { fontStyle: "bold" },
        },
      ],
    ],
    theme: "grid",
    styles: { fontSize: 10 },
  });

  return doc;
}

async function createDeliveredPdf(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFont('helvetica')

  doc.setFontSize(18);
  doc.text(`Invoice for Order #${data.orderId}`, 20, 40);
  doc.text(`Date: ${data.date}`, 20, 60);

  doc.setFontSize(12);
  doc.text(`Customer Name: ${data.customerName}`, 20, 100);
  doc.text(`Address: ${data.address}`, 20, 120, { maxWidth: 500 });
  doc.text(`Contact: ${data.contact}`, 20, 160);

  doc.setFontSize(14);
  doc.text("Product Details", 20, 190);

  const products = data.products.map((product) => [
    { content: product.name, styles: { halign: "left" } },
    product.quantity,
    `RS. ${Number(product.price).toLocaleString("en-IN")}`,
  ]);
  const total = data.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  doc.autoTable({
    startY: 210,
    head: [["Product", "Quantity", "Price"]],
    body: [
      ...products,
      [
        "",
        "",
        {
          content: `Total: RS. ${total.toLocaleString("en-IN")}`,
          styles: { fontStyle: "bold" },
        },
      ],
    ],
    theme: "grid",
    styles: { fontSize: 10 },
  });

  return doc;
}

export { generatePdf };
