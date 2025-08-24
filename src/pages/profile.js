"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import FancyButton from "@/components/CustomButton/CustomButton";
import styles from "@/styles/Profile.module.css";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [friends, setFriends] = useState([]);
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/user/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setName(data.name || "");
          setImage(data.image || "/default-profile.png");
          setFriends(data.friends || []);
          setPartner(data.partner || null);
        });
    }
  }, [session]);

  const handleSave = async () => {
    await fetch(`/api/user/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    alert("Profile updated!");
  };

  const handleChangePassword = async () => {
    const newPass = prompt("Enter new password:");
    if (!newPass) return;
    await fetch(`/api/user/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, password: newPass }),
    });
    alert("Password updated!");
  };

  return (
    <div className={styles.profilePage}>
      <h1>My Profile</h1>

      <div className={styles.profileCard}>
        <Image src={image} alt="Profile" width={100} height={100} className={styles.profilePic} />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Profile image URL" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <FancyButton label="Save" onClick={handleSave} />
        <FancyButton label="Change Password" onClick={handleChangePassword} style={{ background: "var(--cherry-red-light)" }} />
      </div>

      <div className={styles.section}>
        <h2>Partner</h2>
        {partner ? (
          <p>💞 Partner: {partner.name}</p>
        ) : (
          <p>No partner yet. Send a proposal!</p>
        )}
      </div>

      <div className={styles.section}>
        <h2>Friends</h2>
        <ul>
          {friends.map(f => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
