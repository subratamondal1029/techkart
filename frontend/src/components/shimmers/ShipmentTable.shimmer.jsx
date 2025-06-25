import React from "react";

const ShipmentTableShimmer = () => (
  <table className="w-full">
    <tbody>
      {[...Array(6)].map((_, idx) => (
        <tr
          key={idx}
          className="even:bg-gray-100 odd:bg-gray-50 rounded-lg flex flex-col lg:table-row mb-2 lg:mb-0 animate-pulse"
        >
          {/* Order ID */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">
              Order ID:
            </span>
            <div className="h-4 bg-gray-300 rounded w-full max-w-full md:max-w-28" />
          </td>
          {/* Customer Name */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">
              Customer Name:
            </span>
            <div className="h-4 bg-gray-300 rounded w-full max-w-full md:max-w-40" />
          </td>
          {/* Date */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">Date:</span>
            <div className="h-4 bg-gray-300 rounded w-full max-w-full md:max-w-32" />
          </td>
          {/* Address */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-help lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">Address:</span>
            <div className="h-4 bg-gray-300 rounded w-full max-w-full md:max-w-44 lg:max-w-24" />
          </td>
          {/* Total Products */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center cursor-default lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">
              Total Products:
            </span>
            <div className="h-4 bg-gray-300 rounded w-12" />
          </td>
          {/* Status */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">Status:</span>
            <div className="h-4 bg-gray-300 rounded w-16" />
          </td>
          {/* Action */}
          <td className="min-w-32 py-2 px-2 lg:pl-2 border-b border-gray-200 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:table-cell">
            <span className="block font-semibold lg:hidden mb-1">Action:</span>
            <div className="h-8 bg-gray-300 rounded w-24" />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ShipmentTableShimmer;
