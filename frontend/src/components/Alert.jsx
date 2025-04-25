import React from "react";

const Alert = ({ type, message }) => {
  const bgColor =
    type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-blue-100 border-blue-400 text-blue-700";

  return (
    <div
      className={`${bgColor} px-4 py-3 rounded relative mb-4 border`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Alert;
