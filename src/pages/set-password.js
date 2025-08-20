"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SetPassword() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");

    try {
      const res = await fetch("/api/user/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        await signIn("credentials", {
          redirect: false,
          email: session.user.email,
          password: password,
        });

        alert("Password set! You can now access the home page.");
        router.push("/");
      } else {
        alert(data.error || "Failed to set password");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  const inputWrapperStyle = { position: "relative", width: "100%", marginBottom: "1rem" };
  const iconStyle = { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Set Your Password</h2>

        <form onSubmit={handleSubmit} className="d-flex flex-column w-100 mt-3">
          {/* New Password */}
          <div style={inputWrapperStyle}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
            <span style={iconStyle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div style={inputWrapperStyle}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="form-control"
              required
            />
            <span style={iconStyle} onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="btn btn-cherry w-100 mt-2">
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
