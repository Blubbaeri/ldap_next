"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [loginSource, setLoginSource] = useState<string | null>(null);

    useEffect(() => {
        const source = searchParams.get("source");
        setTimeout(() => {
            if (source === "google") {
                setLoginSource("Google OAuth");
            } else {
                setLoginSource("LDAP");
            }
        }, 0);
    }, [searchParams]);


    const handleLogout = () => {
        if (loginSource === "Google OAuth") {
            signOut({ callbackUrl: "/" }); 
        } else {
            router.push("/"); 
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: 32,
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    width: "100%",
                    maxWidth: 480,
                }}
            >
                <h1 style={{ color: "#4F46E5", marginBottom: 10 }}>Dashboard</h1>
                <p style={{ fontSize: 18, color: "#555", marginBottom: 20 }}>
                    {loginSource
                        ? `Kamu berhasil login melalui ${loginSource}.`
                        : "Sedang memuat..."}
                </p>

                {/* TAMPILKAN HANYA JIKA LOGIN VIA GOOGLE */}
                {loginSource === "Google OAuth" && session?.user && (
                    <p
                        style={{
                            fontSize: 16,
                            color: "#333",
                            marginBottom: 20,
                        }}
                    >
                        👤 {session.user.name} ({session.user.email})
                    </p>
                )}

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.3s",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#dc2626")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ef4444")
                    }
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
