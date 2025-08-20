"use client";

import React, { useEffect } from "react";
import VantaBackground from "@/components/CloudBackground/CloudBackground";
import FloatingMenu from "@/components/Navbar/Navbar";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import FancyButton from "@/components/HomeButton/FancyButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
  showLoader("Testing MacBook loader...");
  const timer = setTimeout(() => hideLoader(), 90000); // Hide after 5s
  return () => clearTimeout(timer);
}, [showLoader, hideLoader]);


  // Manage loader based on session status
  useEffect(() => {
    if (status === "loading") {
      showLoader("Checking session...");
    } else {
      hideLoader();
    }

    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router, showLoader, hideLoader]);

  // Redirect to set-password if user has no password
  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.hasPassword) {
      showLoader("Redirecting to set password...");
      router.push("/set-password");
    }
  }, [status, session, router, showLoader]);

  // Save access token
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      showLoader("Saving access token...");
      localStorage.setItem(
        "access_token",
        JSON.stringify({
          token: session.accessToken,
          expires: session.accessTokenExpires,
        })
      );
      hideLoader();
    }
  }, [status, session, showLoader, hideLoader]);

  // Do not render content until session.user exists
  if (!session?.user) return null;

  return (
    <VantaBackground>
      <FloatingMenu />
      <ProfileMenu user={session.user} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#333",
        }}
      >
        <h1 className="welcome-text">Hey, {session.user.name || session.user.email}!</h1>
        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <FancyButton label="Album" to="/album" />
          <FancyButton label="Letters" to="/letters" />
          <FancyButton label="Map" to="/map" />
        </div>
      </div>
    </VantaBackground>
  );
}
