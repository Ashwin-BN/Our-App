"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (!res.error) router.push("/");
    else alert(res.error);
  };

  const handleGoogle = async () => {
    await signIn("google");
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="d-flex flex-column align-items-center mt-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-3"
          style={{ width: "300px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-3"
          style={{ width: "300px" }}
        />
        <button type="submit" className="btn btn-primary w-50 mb-3">
          Login
        </button>
      </form>
      <button className="btn btn-danger w-50" onClick={handleGoogle}>
        Login with Google
      </button>
    </div>
  );
}
