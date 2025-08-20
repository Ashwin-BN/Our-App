"use client";

import { createContext, useContext, useState } from "react";
import FullScreenLoader from "@/components/FullScreenLoader/FullScreenLoader";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoader = (msg = "Loading...") => {
    setMessage(msg);
    setLoading(true);
  };

  const hideLoader = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <FullScreenLoader message={message} />}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
