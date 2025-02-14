import React from "react";

const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#eaf0fc] p-3 rounded-md shadow-custom-blue w-full h-32">
      <div className="h-6 bg-[#F7F9FE] rounded w-3/4 animate-pulse mb-2"></div>
      <div className="h-4 bg-[#F7F9FE] rounded w-1/2 animate-pulse mb-2"></div>
      <div className="h-4 bg-[#F7F9FE] rounded w-1/3 animate-pulse"></div>
    </div>
  );
};
export default CardSkeleton;
