import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./FlipCard.module.css";

export default function FlipCard({ album }) {
  const router = useRouter();

  const openAlbum = () => router.push(`/album/${album.id}`);
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = album.photos || [];

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className={styles.flipCard} onClick={openAlbum}>
      <div className={styles.flipCardInner}>
        {/* Front: Album cover or themed gradient */}
        <div
          className={styles.flipCardFront}
          style={{
            backgroundImage: album.cover
              ? `url(${album.cover})`
              : `url(/no-default-image.jpg)`,
          }}
        >
          {album.cover && <div className={styles.frontOverlay}></div>}
          <div className={styles.albumTitle}>{album.name}</div>
        </div>

        {/* Back: Slide-show */}
        <div className={styles.flipCardBack} onClick={nextPhoto}>
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
