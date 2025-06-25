const DeliveryShimmer = () => (
  <div className="opacity-100 absolute bg-gray-50 w-full max-w-96 border flex flex-col justify-start p-5 items-start mx-auto rounded-lg">
    <div className="h-6 w-2/3 bg-gray-200 rounded mb-4 transition-opacity duration-100 animate-pulse" />
    <div className="h-6 w-1/2 bg-gray-200 rounded mb-4 transition-opacity duration-100 animate-pulse" />
    <div className="h-4 w-1/3 bg-gray-200 rounded mb-6 transition-opacity duration-100 animate-pulse" />
    <div className="flex justify-between items-center w-full mt-4 gap-2">
      <div className="h-10 w-1/2 bg-gray-200 rounded transition-opacity duration-100 animate-pulse" />
      <div className="h-10 w-1/2 bg-gray-200 rounded transition-opacity duration-100 animate-pulse" />
    </div>
  </div>
);

export default DeliveryShimmer;
