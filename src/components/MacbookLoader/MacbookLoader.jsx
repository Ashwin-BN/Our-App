"use client";

import React from "react";
import styles from "./MacbookLoader.module.css"; // Import as styles

export default function MacbookLoader() {
  return (
    <div className={styles.macbook}>
      <div className={styles.inner}>
        <div className={styles.screen}>
          <div className={styles.faceOne}>
            <div className={styles.camera}></div>
            <div className={styles.display}>
              <div className={styles.shade}></div>
            </div>
            <span>MacBook Air</span>
          </div>
        </div>
        <div className={styles.macbody}>
          <div className={styles.faceOne}>
            <div className={styles.touchpad}></div>
            <div className={styles.keyboard}>
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.key} ${i > 10 && i < 50 ? styles.f : ""}`}
                ></div>
              ))}
            </div>
          </div>
          <div className={`${styles.pad} ${styles.one}`}></div>
          <div className={`${styles.pad} ${styles.two}`}></div>
          <div className={`${styles.pad} ${styles.three}`}></div>
          <div className={`${styles.pad} ${styles.four}`}></div>
        </div>
      </div>
      <div className={styles.shadow}></div>
    </div>
  );
}
