import FlipCard from "@/components/FlipCard/FlipCard";
import styles from "./AlbumList.module.css";

export default function AlbumList({ albums, loading }) {
  if (loading) return <p>Loading albums...</p>;

  if (!albums.length) {
    return (
      <div className={styles.emptyCard}>
        <div className={styles.emptyAnimation}></div>
        <p>No albums found</p>
      </div>
    );
  }

  return (
    <div className={styles.albumGrid}>
      {albums.map((album) => (
        <FlipCard key={album.id} album={album} />
      ))}
    </div>
  );
}
