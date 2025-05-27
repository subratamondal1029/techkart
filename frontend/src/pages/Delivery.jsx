import { useRef, useState, useEffect } from "react";
import { Button, ButtonLoading } from "../components";
import { Html5Qrcode } from "html5-qrcode";
import { ScanQrCodeIcon } from "lucide-react";
import delay from "../utils/delay";
import showToast from "../utils/showToast";
import useLoading from "../hooks/useLoading";
import orderService from "../services/order.service";
import DeliveryShimmer from "../components/shimmers/Delivery.shimmer";

const Delivery = () => {
  // TODO: update the ui
  const html5QrcodeScanner = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [order, setOrder] = useState(null);
  const [scannedData, setScannedData] = useState("");

  const startScanning = () => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      disableFlip: true,
    };

    html5QrcodeScanner.current = new Html5Qrcode("reader");
    html5QrcodeScanner.current
      .start({ facingMode: "environment" }, config, qrCodeSuccessCallback, () =>
        console.warn("QR Code not found")
      )
      .then(() => {
        setIsScanning(true);
      })
      .catch((err) => {
        if (err.includes("NotFoundError")) {
          showToast("warn", "Camera not found");
        } else showToast("error", "Something went wrong");
      });
  };

  const stopScanning = () => {
    if (html5QrcodeScanner.current) {
      html5QrcodeScanner.current
        .stop()
        .then(() => {
          html5QrcodeScanner.current.clear();
          setIsScanning(false);
        })
        .catch((err) => console.error(err));
    }
  };

  const [qrCodeSuccessCallback, isFetching, fetchError] = useLoading(
    async (decodedText) => {
      stopScanning();
      setScannedData(decodedText);
      const { data } = await orderService.getOne(decodedText);
      setOrder(data);
    }
  );

  const [changeStatus, isUpdating, updateError] = useLoading(async (id) => {
    const { data } = await orderService.changeStatus({
      id,
      isDelivered: true,
    });

    setOrder((prev) => ({ ...data, cart: prev.cart }));
  });

  useEffect(() => {
    if (updateError) {
      showToast("error", updateError);
    }
  }, [updateError]);

  useEffect(() => {
    if (fetchError) {
      showToast("error", fetchError);
    }
  }, [fetchError]);

  return (
    <div className="w-full overflow-y-hidden min-h-[50vh] flex justify-center mt-5 rounded-lg">
      {scannedData ? (
        isFetching ? (
          <DeliveryShimmer />
        ) : (
          <div className="opacity-100 rounded-lg bg-gray-50 w-full max-w-96 border flex flex-col justify-start p-5 items-start">
            <div className="space-y-2 p-4 bg-white rounded-xl shadow-md w-full max-w-md">
              <p className="text-lg font-semibold text-green-600">
                {scannedData}
              </p>

              <p>
                <span className="font-medium">Customer Name:</span>{" "}
                {order?.customerName}
              </p>

              <div className="flex flex-col  sm:items-start gap-1">
                <span className="font-medium">Address:</span>
                <span className="text-gray-700">{order?.address}</span>
              </div>

              <p>
                <span className="font-medium">Total Products:</span>{" "}
                {order?.cart?.products.length}
              </p>

              <p>
                <span className="font-medium">Total Price:</span> ₹
                {order?.totalAmount}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {order?.paymentMethod || "N/A"}{" "}
                {/* FIXME: store payment method in database*/}
              </p>

              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    order?.isDelivered ? "text-green-600" : "text-red-500"
                  }
                >
                  {order?.isDelivered ? "Delivered" : "Not Delivered"}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center w-full mt-4">
              <Button
                classname="w-full mr-1 bg-red-600 hover:bg-red-700"
                onClick={() => setScannedData("")}
                disabled={isUpdating}
              >
                {order?.isDelivered ? "Close" : "Cancel"}
              </Button>
              <Button
                classname="w-full h-9 flex items-center justify-center bg-green-600 hover:bg-green-700"
                onClick={() => changeStatus(scannedData)}
                disabled={isUpdating || order?.isDelivered}
                loader={isUpdating}
              >
                Confirm
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col h-full w-full justify-between items-center max-w-96 mx-auto m-5 p-2 pb-3 min-h-[50vh] shadow-lg rounded-md ">
          <div id="reader" className="w-full"></div>
          <ScanQrCodeIcon
            className={`w-3/4 min-h-52 mt-7 rounded ${
              isScanning ? "hidden" : "block"
            }`}
            size={50}
          />

          <Button
            classname="w-full mt-2"
            onClick={isScanning ? stopScanning : startScanning}
            disabled={scannedData}
          >
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Delivery;
