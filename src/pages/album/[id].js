import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useLoading } from "@/context/LoadingContext";
import PhotoModal from "@/components/PhotoModal/PhotoModal";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import FloatingMenu from "@/components/Navbar/Navbar";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import Modal from "@/components/Modal/Modal";
import Toast from "@/components/Toast/Toast";
import styles from "@/styles/AlbumDetail.module.css";
import formStyles from "@/styles/formShared.module.css";
import { fetchAlbum, updateAlbum, deleteAlbum } from "@/lib/api/album";

export default function AlbumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { showLoader, hideLoader } = useLoading();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchedOnce = useRef(false); // Ensures we fetch only once per id

  // Load album safely
  useEffect(() => {
    if (!router.isReady || !session || !id || fetchedOnce.current) return;

    const loadAlbum = async () => {
      try {
        setLoading(true);
        showLoader("Loading album...");
        const data = await fetchAlbum(id, session.user.id);
        setAlbum({ ...data, photos: data.photos || [] });
        fetchedOnce.current = true; // mark as fetched
      } catch (err) {
        console.error(err);
        setToast("Failed to load album");
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    loadAlbum();
  }, [router.isReady, id, session, showLoader, hideLoader]);

  if (loading) return <p>Loading album...</p>;
  if (!album) return <p>Album not found</p>;

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

  const handleEditSubmit = async (data) => {
    try {
      const updated = await updateAlbum(id, data);
      setAlbum({ ...updated, photos: updated.photos || album.photos || [] });
      setEditModalOpen(false);
      setDropdownOpen(false);
      setToast("Album updated successfully!");
    } catch (err) {
      console.error(err);
      setToast("Failed to update album");
    }
  };

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
  <div className={styles.albumHeaderBar}>
    <h1 className={styles.albumTitle}>{album.name}</h1>
    {/* Show actions only for real albums */}
  {!["all-photos", "favourites"].includes(album.id) && (
    <div className={styles.albumActions}>
      <button className="btn-cherry" onClick={() => setEditModalOpen(true)}>
        Edit
      </button>
      <button
        className="btn-cherry"
        style={{ background: "#ccc", color: "#222", boxShadow: "none" }}
        onClick={handleDeleteAlbum}
      >
        Delete
      </button>
    </div>
  )}
</div>

  <p className={styles.albumDescription}>{album.description}</p>

  {/* Photo Grid */}
  <div className={styles.photoGrid}>
    {album.photos.length > 0 ? (
      album.photos.map((photo, idx) => (
        <div
          key={photo.id}
          className={styles.photoWrapper}
          onClick={() => openPhotoModal(idx)}
        >
          <img
            src={photo.url}
            alt={`Photo ${idx + 1}`}
            className={styles.photoThumb}
          />
          <div className={styles.photoOverlay}>
            <span>View</span>
          </div>
        </div>
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
