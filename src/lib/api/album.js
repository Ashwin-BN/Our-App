// src/lib/api/album.js

export async function fetchAlbum(id, userId) {
  // Handle default albums on the client side
  if (id === "all-photos") {
    const res = await fetch(`/api/photo/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch all photos");
    const { all } = await res.json();
    return { id: "all-photos", name: "All Photos", photos: all };
  }

  if (id === "favourites") {
    const res = await fetch(`/api/photo/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch favourites");
    const { favourites } = await res.json();
    return { id: "favourites", name: "Favourites", photos: favourites };
  }

  // Otherwise fetch from database normally
  const res = await fetch(`/api/album/${id}`);
  if (!res.ok) throw new Error("Failed to fetch album");
  return res.json();
}


export async function updateAlbum(id, data) {
  const res = await fetch(`/api/album/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
}

export async function deleteAlbum(id) {
  const res = await fetch(`/api/album/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete album");
  return res.json();
}
