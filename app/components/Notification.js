import React from "react";

export default function Notification({ show, message, type = "success" }) {
  if (!show) return null;
  const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-gray-800";
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all animate-fade-in`}>
      {message}
    </div>
  );
} 