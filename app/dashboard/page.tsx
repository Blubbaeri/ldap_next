"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { signOut, useSession } from "next-auth/react";

function DashboardContent() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
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
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
                <h1 className="text-3xl font-semibold text-indigo-600 mb-6">
                    Selamat Datang di Dashboard 👋
                </h1>

                {/* tampilkan profile jika login lewat Google */}
                {session?.user && loginSource === "Login melalui Google OAuth" && (
                    <div className="flex flex-col items-center mb-6">
                        {session.user.image && (
                            <img
                                src={session.user.image}
                                alt="User Profile"
                                className="w-20 h-20 rounded-full shadow-md mb-3"
                            />
                        )}
                        <p className="text-lg font-medium text-gray-800">
                            {session.user.name}
                        </p>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>
                )}

                <p className="text-gray-700 mb-6">
                    {loginSource ? loginSource : "Sedang memuat..."}
                </p>

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    // Bungkus dengan Suspense supaya aman pas build
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
