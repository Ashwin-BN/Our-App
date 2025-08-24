import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./FlipCard.module.css";

export default function FlipCard({ album }) {
  const router = useRouter();

  const openAlbum = () => router.push(`/album/${album.id}`);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const photos = album.photos || [];

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  // Auto slideshow on hover
  useEffect(() => {
    if (!hovered || photos.length <= 1) return;
    const interval = setInterval(nextPhoto, 2000);
    return () => clearInterval(interval);
  }, [hovered, photos.length]);

  return (
    <div
      className={styles.flipCard}
      onClick={openAlbum}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.flipCardInner}>
        {/* Front: Album cover or gradient */}
        <div
          className={`${styles.flipCardFront} ${!album.cover ? styles.noCover : ""}`}
          style={album.cover ? { backgroundImage: `url(${album.cover})` } : {}}
        >
          {album.cover && <div className={styles.frontOverlay}></div>}
          <div className={styles.albumTitleFront}>{album.name}</div>
        </div>

        {/* Back: Slide-show */}
        <div className={styles.flipCardBack}>
          {photos.length ? (
            <img
              src={photos[currentIndex]?.url}
              alt={`Slide ${currentIndex + 1}`}
              className={styles.slidePhoto}
            />
          ) : (
            <div className={styles.emptyBack}>
              <p>No photos yet</p>
            </div>
          )}

          {/* Album title on back */}
          <div className={styles.albumTitleBack}>{album.name}</div>

          {/* Slide counter at top-right */}
          {photos.length > 1 && (
            <div className={styles.slideCounter}>
              {currentIndex + 1}/{photos.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
