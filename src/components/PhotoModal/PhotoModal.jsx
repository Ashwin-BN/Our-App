import { useState, useRef, useEffect } from "react";
import { FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./PhotoModal.module.css";

export default function PhotoModal({ photos, startIndex = 0, onClose, onDelete }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [photoList, setPhotoList] = useState(photos); // track changes
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const prevPhoto = () => setCurrentIndex((i) => (i - 1 + photoList.length) % photoList.length);
  const nextPhoto = () => setCurrentIndex((i) => (i + 1) % photoList.length);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.1), 5));
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await fetch(`/api/photo/${photoId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete photo");
      onDelete(photoId);
      setPhotoList((prev) => prev.filter((p) => p.id !== photoId));
      if (photoList.length > 1) setCurrentIndex((i) => (i >= photoList.length - 1 ? 0 : i));
      else onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Async favorite toggle
  const handleToggleFavourite = async (photoId) => {
    try {
      // Optimistic UI update
      setPhotoList((prev) =>
        prev.map((p) => p.id === photoId ? { ...p, favourite: !p.favourite } : p)
      );

      // API call
      const res = await fetch(`/api/photo/favourite/${photoId}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to update favourite");
      const updated = await res.json();

      // Ensure state matches server
      setPhotoList((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, favourite: updated.favourite } : p))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!photoList.length) return null;

  const currentPhoto = photoList[currentIndex];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWindow}>
        {/* Header */}
        <div className={styles.windowHeader}>
          <span>Photo Viewer</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Photo */}
        <div
          className={styles.photoContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            src={currentPhoto.url}
            alt={`Photo ${currentIndex + 1}`}
            className={styles.photo}
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              cursor: zoom > 1 ? "grab" : "default",
            }}
            draggable={false}
          />

          {photoList.length > 1 && (
            <>
              <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevPhoto}>‹</button>
              <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextPhoto}>›</button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.infoBar}>
          <span>{currentIndex + 1} / {photoList.length}</span>
          <div className={styles.zoomDelete}>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <span>{Math.round(zoom * 100)}%</span>

            {/* Favorite Button */}
            <button
              className={styles.deleteBtn}
              onClick={() => handleToggleFavourite(currentPhoto.id)}
              title={currentPhoto.favourite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {currentPhoto.favourite ? <FaHeart color="red" /> : <FaRegHeart />}
            </button>

            {/* Delete Button */}
            <button
              className={styles.deleteBtn}
              onClick={() => handleDeletePhoto(currentPhoto.id)}
              title="Delete Photo"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
