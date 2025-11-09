"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const getBaseURL = () => {
            if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
            if (typeof window !== "undefined") {
                const protocol = window.location.protocol;
                const host = window.location.hostname;
                return `${protocol}//${host}:8000`;
            }
            return "http://localhost:8000";
        };

        try {
            const baseURL = getBaseURL();

            const res = await fetch(`${baseURL}/login-ldap`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username, password }),
                mode: "cors",
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data.status === "success") {
                setMessage(`Login berhasil! Selamat datang, ${data.user}`);
                setTimeout(() => router.push("/dashboard?source=ldap"), 2000);
            } else {
                setMessage("Login gagal! Periksa username atau password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Gagal terhubung ke server FastAPI atau server sedang down.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "80px auto",
                padding: 24,
                borderRadius: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                textAlign: "center",
                fontFamily: "sans-serif",
            }}
        >
            <h2 style={{ marginBottom: 20, color: "#4F46E5" }}>Login LDAP & OAuth</h2>

            {/* LDAP Login */}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        outlineColor: "#4F46E5",
                    }}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        outlineColor: "#4F46E5",
                    }}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: loading ? "#a5b4fc" : "#4F46E5",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "background 0.3s",
                    }}
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>

            {message && (
                <p
                    style={{
                        marginTop: 15,
                        color: message.startsWith("✅")
                            ? "green"
                            : message.startsWith("⚠️")
                                ? "orange"
                                : "red",
                    }}
                >
                    {message}
                </p>
            )}

            {/* Garis pembatas */}
            <div
                style={{
                    margin: "20px 0",
                    borderTop: "1px solid #ddd",
                    position: "relative",
                }}
            >
                <span
                    style={{
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "0 10px",
                        color: "#666",
                        fontSize: 14,
                    }}
                >
                    atau
                </span>
            </div>

            {/* Google OAuth */}
            <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard?source=google" })}
                style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    color: "#444",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "background 0.3s",
                }}
            >
                <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                />
                Login with Google
            </button>
        </div>
    );
}
