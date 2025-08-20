"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });
    if (!res.error) router.push("/");
    else alert(res.error);
  };

  const handleGoogle = async () => await signIn("google", { callbackUrl: "/" });

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="d-flex flex-column w-100">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
            <span
              className="eye-icon"
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="btn btn-cherry">
            Login
          </button>
        </form>

        <button className="btn btn-cherry mt-3" onClick={handleGoogle}>
          Login with Google
        </button>
      </div>
    </div>
  );
}
