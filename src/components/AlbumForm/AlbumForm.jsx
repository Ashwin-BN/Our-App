import { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal"; // Use your existing Modal component
import styles from "@/styles/Album.module.css";

export default function AlbumForm({ 
  userId, 
  albumData = null, 
  onSubmit, 
  title = "Create Album" 
}) {
  const [form, setForm] = useState({ name: "", description: "", cover: "" });
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);

  // Initialize form if editing
  useEffect(() => {
    if (albumData) {
      setForm({
        name: albumData.name || "",
        description: albumData.description || "",
        cover: albumData.cover || "",
      });
    }
  }, [albumData]);

  // Fetch user photos
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/photo/user/${userId}`)
      .then((res) => res.json())
      .then(setUserPhotos)
      .catch(console.error);
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverSelect = (url) => {
    setForm({ ...form, cover: url });
    setShowCoverModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      await onSubmit(form);
    } else {
      console.error("AlbumForm: onSubmit prop is missing or not a function");
    }
  };

  return (
    <div className={styles.albumFormWrapper}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.albumForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Album Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Cover Image</label>
          <div className={styles.coverPicker}>
            {form.cover ? (
              <img src={form.cover} alt="Cover" className={styles.coverPreview} />
            ) : (
              <span>No cover selected</span>
            )}
            <button
              type="button"
              className={styles.selectCoverBtn}
              onClick={() => setShowCoverModal(true)}
            >
              Select Cover
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-cherry">
          {albumData ? "Save Changes" : "Create Album"}
        </button>
      </form>

      {/* Cover selection modal */}
      {showCoverModal && (
        <Modal isOpen={showCoverModal} onClose={() => setShowCoverModal(false)}>
          <h4>Select Cover Image</h4>
          <div className={styles.coverGridScrollable}>
            {userPhotos.length ? (
              userPhotos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt="cover"
                  className={styles.coverOption}
                  onClick={() => handleCoverSelect(photo.url)}
                />
              ))
            ) : (
              <p>No uploaded photos available</p>
            )}
          </div>
          <button 
            onClick={() => setShowCoverModal(false)} 
            className="btn btn-cherry mt-2"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}
