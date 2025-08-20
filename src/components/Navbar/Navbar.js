"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link"; 
import { ArrowLeft } from "lucide-react";
import styles from "./Navbar.module.css";

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const pathname = usePathname();
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

  if (pathname !== "/") {
    return (
      <div className={styles.floatingContainer}>
        <div className={styles.menuIcon} onClick={() => router.back()}>
          <ArrowLeft size={24} strokeWidth={2.5} />
        </div>
      </div>
    );
  }

  return (
    <div ref={menuRef} className={styles.floatingContainer}>
      <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
        ☰
      </div>
      {open && (
        <div className={styles.dropdownMenu}>
          <Link href="/" className={styles.dropdownItem}>
            Home
          </Link>
          <Link href="/contact" className={styles.dropdownItem}>
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}
