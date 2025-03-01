import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AccessDenied, Button, ButtonLoading } from "../components";
import { Html5Qrcode } from "html5-qrcode";
import { ScanQrCodeIcon } from "lucide-react";
import appWriteDb from "../appwrite/DbServise";
import { toast } from "react-toastify";
import { generatePdf } from "../../invoiceGen";
import appWriteStorage from "../appwrite/storageService";
import { invoiceId } from "../config";

const Delivery = () => {
  const { userData } = useSelector((state) => state.auth);
  
  const {products: allProducts} = useSelector((state) => state.products);
  const html5QrcodeScanner = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [order, setOrder] = useState(null);
  const [scanedData, setScanedData] = useState({
    isScaned: false,
    isDeliverd: false,
    orderId: "",
  }); 
  const [isSending, setIsSending] = useState(false);

  // Uncomment if access control is needed
  if (!userData?.labels.includes("delivery")) {
    return <AccessDenied message="Delivery Boy" />;
  }

  const startScanning = () => {
    console.log("start scanning");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      disableFlip: true,
    };

    html5QrcodeScanner.current = new Html5Qrcode("reader");
    html5QrcodeScanner.current
      .start({ facingMode: "environment" }, config, qrCodeSuccessCallback, () =>
        console.warn(errorMessage)
      )
      .then(() => {
        setScanning(true);
      })
      .catch((err) => {
        console.error(`Unable to start scanning, error: ${err}`);
      });
  };

  const stopScanning = () => {
    if (html5QrcodeScanner.current) {
      html5QrcodeScanner.current
        .stop()
        .then(() => {
          html5QrcodeScanner.current.clear();
          setScanning(false);
        })
        .catch((err) => console.error(err));
    }
  };

  const qrCodeSuccessCallback = (decodedText) => {
    stopScanning();
    appWriteDb.getOrder(decodedText).then((order) => {
      if (order) {
        setOrder({
          orderId: order.$id,
          customerName: order.name,
          date: order.date,
          address: order.address,
          contact: order.phone,
          products: order.cart.map((product) => JSON.parse(product)).map((product) =>{
            const foundProduct = allProducts.find((p) => p.$id === product.productId);
            return { quantity: product.quantity, name: foundProduct.name, price: foundProduct.price};
          })
        });
        setScanedData({ isScaned: true, orderId: decodedText, isDeliverd: order.isDeliverd });
      }else setScanedData({ isScaned: false, orderId: "", isDeliverd: false });
    })
  };

  const changeStatus =  async (orderId) => {
    setIsSending(true);
    try {
      const updateOrder = await appWriteDb.updateOrder(orderId, { isDeliverd: true });
      if (updateOrder) {
        const createInvoice = await generatePdf("delivered", {...order})
       const deleteFile = await appWriteStorage.deleteFile(orderId, invoiceId)
       if (deleteFile) {
         const uploadInvoice = await appWriteStorage.uploadInvoice(createInvoice, `${orderId}_invoice`)
         if (uploadInvoice) {
           setScanedData((prev) => ({ ...prev, isDeliverd: true }));
           setTimeout(
             () =>
               setScanedData({ isScaned: false, orderId: "", isDeliverd: false }),
             2000
           );
         }
       }else throw new Error("Something went wrong");
      } else throw new Error("Something went wrong");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error.message)
    }

    setIsSending(false);
  };

  return (
    <div className="w-full max-w-96 mx-auto mt-7 p-2 overflow-y-hidden rounded-lg shadow-lg min-h-[50vh] flex justify-between items-center flex-col">
      <div id="reader" className="w-full h-auto"></div>
      <ScanQrCodeIcon
        className={`w-3/4 min-h-52 mt-7 rounded absolute ${
          scanning ? "hidden" : "block"
        }`}
        size={50}
      />
      {scanning ? (
        <Button classname="w-full mt-2" onClick={stopScanning}>
          Stop Scanning
        </Button>
      ) : (
        <Button classname="w-full" onClick={startScanning}>
          Start Scanning
        </Button>
      )}

      <div
        className={`${
          scanedData.isScaned ? "opacity-100" : "opacity-0"
        } absolute bg-gray-50 w-full max-w-96 border flex flex-col justify-start  p-5 items-start transition-opacity mx-auto`}
      >
        <h1>Order Confirmed: #{scanedData?.orderId}</h1>
        <h1>Customer Name: {order?.customerName}</h1>
        <p>
          Order Status: {scanedData?.isDeliverd ? "Delivered" : "Not Delivered"}
        </p>
        <div className="flex justify-between items-center w-full mt-4">
          <Button
            classname="w-full mr-1"
            onClick={() =>
              setScanedData({ isScaned: false, orderId: "", isDeliverd: false })
            }
          >
            Cancel
          </Button>
          <Button
            classname={`w-full disabled:bg-black/80 disabled:cursor-not-allowed h-9 flex items-center justify-center`}
            onClick={() => changeStatus(scanedData.orderId)}
            disabled={isSending || scanedData.isDeliverd}
          >
            {isSending ? <ButtonLoading fillColor="fill-black" /> : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
