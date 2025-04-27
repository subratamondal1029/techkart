import { Info, RotateCcw } from "lucide-react";
import Button from "./Button";

const InfiniteLoadingError = ({ error, retry }) => {
  return (
    <div
      id="alert-additional-content-2"
      className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <Info size={20} />
        <h3 className="text-lg font-medium">An error occurred</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">{error}</div>
      <div className="flex">
        <Button classname="w-24 justify-between" onClick={retry}>
          <RotateCcw />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default InfiniteLoadingError;
