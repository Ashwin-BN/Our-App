import { useState } from "react";
import styles from "./PhotoModal.module.css";

export default function PhotoModal({ photos, startIndex = 0, onClose, onDelete }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const prevPhoto = () =>
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setCurrentIndex((i) => (i + 1) % photos.length);

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch(`/api/photo/${photoId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete photo");
      onDelete(photoId);
      if (photos.length > 1) {
        setCurrentIndex((i) => (i >= photos.length - 1 ? 0 : i));
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!photos.length) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          src={photos[currentIndex].url}
          alt={`Photo ${currentIndex + 1}`}
          className={styles.photo}
        />

        {photos.length > 1 && (
          <>
            <button
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={prevPhoto}
              aria-label="Previous Photo"
            >
              ‹
            </button>
            <button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={nextPhoto}
              aria-label="Next Photo"
            >
              ›
            </button>
          </>
        )}

        <button
          className={styles.deleteBtn}
          onClick={() => handleDeletePhoto(photos[currentIndex].id)}
          aria-label="Delete Photo"
        >
          Delete
        </button>

        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close Modal"
        >
          ✕
        </button>

        <div className={styles.counter}>
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}
