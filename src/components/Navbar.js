"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={styles.floatingContainer}>
      {/* Menu Icon */}
      <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className={styles.dropdownMenu}>
          <a href="#" className={styles.dropdownItem}>
            Home
          </a>
          <a href="#" className={styles.dropdownItem}>
            About
          </a>
          <a href="#" className={styles.dropdownItem}>
            Contact
          </a>
          <a href="#" className={`btn btn-warning rounded-pill ${styles.ctaButton}`}>
            Get Started
          </a>
        </div>
      )}
    </div>
  );
}
