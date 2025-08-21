// src/lib/api/album.js

export async function fetchAlbum(id) {
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
