import { useEffect, useState } from "react";

export default function AlbumList() {
  const [albums, setAlbums] = useState([]); // start with empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/album")
      .then((res) => res.json())
      .then((data) => {
        // Ensure it's an array
        if (Array.isArray(data)) {
          setAlbums(data);
        } else {
          console.error("Unexpected response:", data);
          setAlbums([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching albums:", err);
        setAlbums([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading albums...</p>;
  if (!albums.length) return <p>No albums found.</p>;

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {albums.map((album) => (
        <div key={album.id} className="border rounded-lg p-3">
          {album.cover ? (
            <img
              src={album.cover}
              alt={album.name}
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
              No Cover
            </div>
          )}
          <h2 className="text-lg font-bold mt-2">{album.name}</h2>
          <p className="text-sm text-gray-600">{album.description}</p>
          <p className="text-xs text-gray-400">{album.photos?.length || 0} photos</p>
        </div>
      ))}
    </div>
  );
}
