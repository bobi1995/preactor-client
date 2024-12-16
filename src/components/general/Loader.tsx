import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const InfinityLoader = () => {
  return (
    <div className="flex justify-center">
      <div className="scale-150 mt-52">
        <InfinitySpin width="200" color="#4fa94d" />
      </div>
    </div>
  );
};

export default InfinityLoader;
