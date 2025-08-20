import { useState } from "react";

export default function AlbumForm({ userId, onAlbumCreated }) {
  const [form, setForm] = useState({ name: "", description: "", cover: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/album", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId }),
    });
    const data = await res.json();
    if (res.ok) {
      onAlbumCreated?.(data);
      setForm({ name: "", description: "", cover: "" });
    } else {
      alert(data.error || "Error creating album");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Album Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="cover"
        placeholder="Cover Image URL (optional)"
        value={form.cover}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Album
      </button>
    </form>
  );
}
