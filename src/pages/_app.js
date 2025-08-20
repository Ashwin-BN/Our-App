import "@/styles/brite.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "@/context/LoadingContext";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <LoadingProvider>
        <Component {...pageProps} />
      </LoadingProvider>
    </SessionProvider>
  );
}
