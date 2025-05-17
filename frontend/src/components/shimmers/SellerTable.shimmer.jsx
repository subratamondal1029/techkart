const SellerTable = () => (
  <div className="animate-pulse">
    {[...Array(8)].map((_, idx) => (
      <div
        key={idx}
        className="grid grid-cols-2 md:grid-cols-8 gap-4 px-2 py-2 items-center border-t border-gray-200 rounded"
      >
        <div className="w-12 h-12 bg-gray-200 rounded col-span-1" />
        <div className="hidden md:block h-4 bg-gray-200 rounded max-w-24" />
        <div className="h-4 bg-gray-200 rounded max-w-xs" />
        <div className="hidden md:block h-4 bg-gray-200 rounded" />
        <div className="hidden md:block h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="hidden md:block h-4 bg-gray-200 rounded" />
        <div className="flex gap-2 justify-evenly col-span-1">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default SellerTable;
