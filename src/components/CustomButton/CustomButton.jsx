import React from "react";
import styles from "./CustomButton.module.css";

export default function CustomButton({ label = "Button", onClick, type = "button" }) {
  return (
    <button className={styles["custom-btn"]} onClick={onClick} type={type}>
      {label}
    </button>
  );
}

