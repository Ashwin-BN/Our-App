import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PhotoModal from "@/components/PhotoModal/PhotoModal";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import FloatingMenu from "@/components/Navbar/Navbar";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import Modal from "@/components/Modal/Modal";
import Toast from "@/components/Toast/Toast";
import styles from "@/styles/AlbumDetail.module.css";
import { fetchAlbum, updateAlbum, deleteAlbum } from "@/lib/api/album";

export default function AlbumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Load album
  useEffect(() => {
    if (!id) return;
    async function loadAlbum() {
      try {
        setLoading(true);
        const data = await fetchAlbum(id);
        setAlbum({ ...data, photos: data.photos || [] }); // Ensure photos is always an array
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAlbum();
  }, [id]);

  if (loading) return <p>Loading album...</p>;
  if (!album) return <p>Album not found</p>;

  // Photo modal
  const openPhotoModal = (index) => {
    setPhotoIndex(index);
    setPhotoModalOpen(true);
  };

  const handlePhotoDelete = (photoId) => {
    setAlbum((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
    setPhotoModalOpen(false);
  };

  // Update album
  const handleEditSubmit = async (data) => {
    try {
      // Keep existing photos if API does not return them
      const updated = await updateAlbum(id, data);
      setAlbum((prev) => ({
        ...updated,
        photos: prev.photos || prev.photos || [],
      }));
      setEditModalOpen(false);
      setDropdownOpen(false);
      setToast("Album updated successfully!");
    } catch (err) {
      console.error(err);
      setToast("Failed to update album");
    }
  };

  // Delete album
  const handleDeleteAlbum = async () => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      await deleteAlbum(id);
      router.push("/album");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className={styles.albumDetailPage}>
      <FloatingMenu />
      {session && <ProfileMenu user={session.user} />}

      {/* Album Header */}
      <div className={styles.albumHeader}>
        <h1>{album.name}</h1>
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            &#x22EE;
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownContent}>
              <button onClick={() => setEditModalOpen(true)}>Edit</button>
              <button onClick={handleDeleteAlbum}>Delete</button>
            </div>
          )}
        </div>
      </div>

      <p>{album.description}</p>

      {/* Photo Grid */}
      <div className={styles.photoGrid}>
        {(album.photos || []).length > 0 ? (
          album.photos.map((photo, idx) => (
            <img
              key={photo.id}
              src={photo.url}
              alt={`Photo ${idx + 1}`}
              className={styles.photoThumb}
              onClick={() => openPhotoModal(idx)}
            />
          ))
        ) : (
          <p>No photos in this album.</p>
        )}
      </div>

      {/* Photo Modal */}
      {photoModalOpen && (
        <PhotoModal
          photos={album.photos}
          startIndex={photoIndex}
          onClose={() => setPhotoModalOpen(false)}
          onDelete={handlePhotoDelete}
        />
      )}

      {/* Edit Album Modal */}
      {editModalOpen && (
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <AlbumForm
            userId={session.user.id}
            albumData={album}
            onSubmit={handleEditSubmit}
            onClose={() => setEditModalOpen(false)}
            title="Edit Album"
          />
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
