import React from "react";
import "../styles/shimmer.css";

const ShimmerCard = () => {
  return (
    <div className="pg-card shimmer-card">
      <div className="updated-box shimmer-img"></div>
      <div className="pg-card-content">
        <div className="shimmer-line title"></div>
        <div className="shimmer-line subtitle"></div>
        <div className="shimmer-line small"></div>
        <div className="shimmer-line small"></div>
      </div>
    </div>
  );
};

export default ShimmerCard;