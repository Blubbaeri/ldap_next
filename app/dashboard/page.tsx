"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const [loginSource, setLoginSource] = useState<string | null>(null);

    useEffect(() => {
        Promise.resolve().then(() => {
            const source = searchParams.get("source");
            if (source === "google") {
                setLoginSource("Login melalui Google OAuth");
            } else {
                setLoginSource("Login melalui LDAP");
            }
        });
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
