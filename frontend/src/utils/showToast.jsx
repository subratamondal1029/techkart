import { X } from "lucide-react";
import { toast } from "react-toastify";

/**
 * Displays a toast notification with a custom layout and type.
 *
 * @function showToast
 * @param {"success" | "error" | "info" | "warning"} [status="success"] - The status/type of the toast.
 * @param {string} [message=""] - The message to display in the toast.
 * @param {Object} [config={}] - Additional configuration for the toast (passed to toastify).
 * @returns {void}
 */

const showToast = ({
  status = "success",
  message = "Successful",
  config = {},
}) => {
  toast[status](
    <div className="flex items-center gap-3 justify-between">
      <p className="text-xs text-gray-600">{message}</p>
      <X size={20} className="text-gray-600 hover:text-gray-400" />
    </div>,
    config
  );
};

export default showToast;
