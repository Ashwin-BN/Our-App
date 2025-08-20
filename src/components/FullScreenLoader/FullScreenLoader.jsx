"use client";

import React from "react";
import MacbookLoader from "@/components/MacbookLoader/MacbookLoader"; // import the component

export default function FullScreenLoader({ message = "Loading..." }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 9999,
        flexDirection: "column",
      }}
    >
      <MacbookLoader />  {/* render the component */}
      <p style={{ marginTop: "20px", fontSize: "16px", color: "#555" }}>{message}</p>
    </div>
  );
}
