"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [loginSource, setLoginSource] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const source = searchParams.get("source");
            if (source === "google") {
                setLoginSource("Login melalui Google OAuth");
            } else {
                setLoginSource("Login melalui LDAP");
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [searchParams]);

    return (
        <div
            style={{
                maxWidth: 600,
                margin: "80px auto",
                textAlign: "center",
                fontFamily: "sans-serif",
            }}
        >
            <h1 style={{ color: "#4F46E5" }}>Dashboard</h1>
            <p style={{ marginTop: 10, fontSize: 18 }}>
                {loginSource ? loginSource : "Sedang memuat..."}
            </p>
        </div>
    );
}

export default function DashboardPage() {
    // 🔒 Bungkus komponen yang pakai useSearchParams di dalam Suspense
    return (
        <Suspense fallback={<p style={{ textAlign: "center" }}>Memuat dashboard...</p>}>
            <DashboardContent />
        </Suspense>
    );
}
