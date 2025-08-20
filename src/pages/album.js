import { useState } from "react";
import { useSession } from "next-auth/react";
import AlbumForm from "@/components/AlbumForm/AlbumForm";
import AlbumList from "@/components/AlbumList/AlbumList";

export default function AlbumPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [albumId, setAlbumId] = useState(""); // selected album to upload into

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (!session) {
      alert("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", session.user.id); // session user ID
    if (albumId) formData.append("albumId", albumId); // assign to album if chosen

    const res = await fetch("/api/photo/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Uploaded photo:", data);
      setFile(null);
      setAlbumId("");
    } else {
      alert(data.error || "Upload failed");
    }
  };

  if (!session) {
    return <p className="p-6">Please login to create albums and upload photos.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Albums</h1>

      {/* Album creation form */}
      <AlbumForm userId={session.user.id} />

      {/* File upload */}
      <form onSubmit={handleUpload} className="mt-4 space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Album ID (optional)"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Photo
        </button>
      </form>

      {/* List of albums */}
      <AlbumList />
    </div>
  );
}
