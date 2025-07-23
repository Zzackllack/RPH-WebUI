"use client";

import { ZipLogo } from "@/app/components/ui/ZipLogo";
import type { ApiResourcePack } from "@/app/types";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DownloadUrl from "../../[id]/components/DownloadUrl";
import ErrorCard from "../../[id]/components/ErrorCard";
import HashDisplay from "../../[id]/components/HashDisplay";
import Loading from "../../[id]/components/Loading";
import PackInfo from "../../[id]/components/PackInfo";
import ServerPropertiesSnippet from "../../[id]/components/ServerPropertiesSnippet";
import NonConvertedPackAccessError from "./components/NonConvertedPackAccessError";

export default function ConvertedPackDetailsPage() {
    const { convertedId } = useParams();
    const router = useRouter();
    const [pack, setPack] = useState<ApiResourcePack | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);
    const [hashLoading, setHashLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!convertedId) return;
        setLoading(true);
        fetch(`${API}/api/resourcepacks/${convertedId}`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json() as Promise<ApiResourcePack>;
            })
            .then(setPack)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [convertedId, API]);

    useEffect(() => {
        if (!convertedId) return;
        setHashLoading(true);
        fetch(`${API}/api/resourcepacks/${convertedId}/hash`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then((txt) => setHash(txt.trim()))
            .catch((e) => setError(e.message))
            .finally(() => setHashLoading(false));
    }, [convertedId, API]);

    if (loading) return <Loading />;
    if (error || !pack) {
        return <ErrorCard error={error ?? "Converted pack not found"} />;
    }

    // Only show error and log once after fetch completes and pack is confirmed non-converted
    if (!pack.converted) {
        // Use a ref to ensure logging only happens once
        const hasLoggedRef = (window as any)._rphPack403LoggedRef ?? false;
        if (typeof window !== "undefined" && !hasLoggedRef) {
            window.history.replaceState({}, "", window.location.href);
            console.error(
                "Error 403: Non-converted pack accessed on converted pack page."
            );
            (window as any)._rphPack403LoggedRef = true;
        }
        return <NonConvertedPackAccessError errorCode="PACK403-NONCONVERTED" />;
    }

    const downloadUrl = `${API}/uploads/${pack.storageFilename}`;
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this converted pack? This action cannot be undone.")) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            const res = await fetch(`${API}/api/resourcepacks/${pack.id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error(`Failed to delete (HTTP ${res.status})`);
            // Redirect to original pack if possible, else home
            if (pack.originalPack && typeof pack.originalPack.id === "number") {
                router.push(`/packs/${pack.originalPack.id}`);
            } else {
                router.push("/");
            }
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete pack.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 overflow-hidden pt-20 pb-20">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                <div className="absolute inset-0 minecraft-grid opacity-20"></div>
            </div>
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-500 hover:underline flex items-center gap-1 mb-4"
                >
                    <X className="w-4 h-4" /> Back
                </button>
                <div className="minecraft-card p-8 space-y-8 border border-white/30 dark:border-gray-800/60 shadow-2xl backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
                    <div className="flex items-center gap-3 mb-2">
                        <ZipLogo className="w-10 h-10 drop-shadow-lg" />
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text drop-shadow-glow">
                            {pack.originalFilename}
                        </h1>
                        <span className="inline-block text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded px-2 py-0.5 ml-2">
                            Converted Pack
                        </span>
                    </div>
                    <PackInfo pack={pack} />
                    <DownloadUrl url={downloadUrl} />
                    <HashDisplay hash={hash} loading={hashLoading} />
                    <ServerPropertiesSnippet url={downloadUrl} hash={hash} />
                    {/* Delete Button */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="w-full py-3 px-4 bg-red-600/90 hover:bg-red-700 text-white rounded-2xl text-sm font-medium flex items-center justify-center space-x-2 border border-red-700/40 transition-all duration-200 shadow-md shadow-red-500/10 z-10 relative group/delete-btn cursor-pointer"
                        >
                            {deleting ? "Deleting..." : "Delete Converted Pack"}
                        </button>
                        {deleteError && (
                            <div className="text-red-600 text-sm text-center">{deleteError}</div>
                        )}
                    </div>
                    {(() => {
                        if (
                            pack.originalPack &&
                            typeof pack.originalPack.id === "number"
                        ) {
                            const originalId = pack.originalPack.id;
                            return (
                                <button
                                    onClick={() =>
                                        router.push(`/packs/${originalId}`)
                                    }
                                    className="mt-6 minecraft-button px-6 py-2"
                                >
                                    Back to original pack
                                </button>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>
        </div>
    );
}
