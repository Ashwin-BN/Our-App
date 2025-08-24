import { useState, useEffect } from "react";
import styles from "@/styles/formShared.module.css";

export default function UploadForm({ userId, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [albumId, setAlbumId] = useState("");
  const [userAlbums, setUserAlbums] = useState([]);

  // Fetch user's albums
  useEffect(() => {
    if (!userId) return;

    fetch("/api/album")
      .then((res) => res.json())
      .then((albums) => {
        // Filter albums belonging to this user
        const filtered = albums.filter((a) => a.userId === userId);
        setUserAlbums(filtered);
      })
      .catch(console.error);
  }, [userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (albumId) formData.append("albumId", albumId);

    const res = await fetch("/api/photo/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setFile(null);
      setAlbumId("");
      onUploadComplete?.();
    } else {
      alert(data.error || "Upload failed");
    }
  };

  return (
    <form onSubmit={handleUpload} className={styles.albumForm}>
      <h2 className={styles.formHeading}>Upload Photo</h2>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Album</label>
        <select
          className={styles.formInput}
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
        >
          <option value="">No Album / Standalone</option>
          {userAlbums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-cherry">
        Upload Photo
      </button>
    </form>
  );
}
