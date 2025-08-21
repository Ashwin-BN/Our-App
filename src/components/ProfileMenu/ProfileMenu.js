"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileMenu.module.css";

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push("/api/auth/signout"); // Or call signOut() from next-auth/react
  };

  return (
    <div ref={menuRef} className={styles.floatingContainer}>
      <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
        <Image
  src={user?.image && user.image.trim() !== "" ? user.image : "/default-profile.png"}
  alt="Profile"
  width={40}
  height={40}
  className={styles.profilePic}
  onError={(e) => {
    e.currentTarget.src = "/default-profile.png"; // fallback if image fails to load
  }}
/>
      </div>

      {open && (
        <div className={styles.dropdownMenu}>
          <a href="/profile" className={styles.dropdownItem}>
            View Profile
          </a>
          <button onClick={handleLogout} className={styles.dropdownItem}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
