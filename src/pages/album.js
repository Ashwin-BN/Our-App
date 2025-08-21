import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import AlbumList from "@/components/AlbumList/AlbumList";
import UploadForm from "@/components/ImageUploadForm/ImageUploadForm";
import VantaBackground from "@/components/CloudBackground/CloudBackground";
import FloatingMenu from "@/components/Navbar/Navbar";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import Modal from "@/components/Modal/Modal";
import FancyButton from "@/components/CustomButton/CustomButton";
import Toast from "@/components/Toast/Toast";
import styles from "@/styles/Album.module.css";

export default function AlbumPage() {
  const { data: session } = useSession();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/album");
      const data = await res.json();
      if (Array.isArray(data)) setAlbums(data);
      else setAlbums([]);
    } catch (err) {
      console.error(err);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchAlbums();
  }, [session]);

  const handleAlbumCreated = async (formData) => {
  try {
    const res = await fetch("/api/album", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId: session.user.id }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create album");
    }

    const newAlbum = await res.json();
    setToast("Album created successfully!");
    setShowAlbumModal(false);
    await fetchAlbums(); // refresh the list
  } catch (err) {
    console.error(err);
    setToast("Error creating album: " + err.message);
  }
};

  const handleUploadComplete = async () => {
    setToast("Photo uploaded successfully!");
    setShowUploadModal(false);
    await fetchAlbums();
  };

  if (!session) {
    return (
      <div className="p-6 text-center text-lg text-gray-700">
        Please login to create albums and upload photos.
      </div>
    );
  }

  return (
    <>
      <VantaBackground />

      <div className={styles["album-page"]}>
        <FloatingMenu />
        <ProfileMenu user={session.user} />

        <h1 className={styles.pageHeading}>My Photo Albums</h1>

        <div className={styles["album-actions"]}>
          <FancyButton label="Create Album" onClick={() => setShowAlbumModal(true)} />
          <FancyButton
            label="Upload Photo"
            onClick={() => setShowUploadModal(true)}
            style={{ background: "var(--cherry-red-light)" }}
          />
        </div>

        <div className={styles["album-container"]}>
          {loading ? <p>Loading albums...</p> : <AlbumList albums={albums} />}
        </div>
      </div>

      <Modal isOpen={showAlbumModal} onClose={() => setShowAlbumModal(false)}>
        <AlbumForm userId={session.user.id} onSubmit={handleAlbumCreated} title="Create Album"/>
      </Modal>

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <UploadForm userId={session.user.id} onUploadComplete={handleUploadComplete} />
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
