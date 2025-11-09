"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [loginSource, setLoginSource] = useState<string | null>(null);
    const { data: session } = useSession();

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-100">
                <h1 className="text-3xl font-bold text-indigo-600 mb-2">Dashboard</h1>
                <p className="text-gray-600 mb-6">
                    {loginSource ? loginSource : "Sedang memuat..."}
                </p>

                {/* Kalau login pakai Google dan session ada */}
                {loginSource === "Login melalui Google OAuth" && session?.user && (
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={session.user.image ?? "/default-avatar.png"}
                            alt="User Avatar"
                            className="w-20 h-20 rounded-full shadow-md border border-gray-200"
                        />
                        <p className="mt-3 text-lg font-semibold text-gray-800">
                            {session.user.name}
                        </p>
                        <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                )}

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-all duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <p className="text-center mt-10 text-gray-500">
                    Memuat dashboard...
                </p>
            }
        >
            <DashboardContent />
        </Suspense>
    );
}
