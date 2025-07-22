"use client";

import { ForcePackConfigDisplay } from "@/app/components/ui/ForcePackConfigDisplay";
import { ForcePackModal } from "@/app/components/ui/ForcePackModal";
import { GenerateForcePackConfigButton } from "@/app/components/ui/GenerateForcePackConfigButton";
import { useToast } from "@/app/contexts/ToastContext";
import { ApiConversionJob, ApiResourcePack } from "@/app/types";
import { X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConversionSection from "./components/ConversionSection";
import ConvertedPackAccessError from "./components/ConvertedPackAccessError";
import ConvertedPacksSection from "./components/ConvertedPacksSection";
import DownloadUrl from "./components/DownloadUrl";
import ErrorCard from "./components/ErrorCard";
import HashDisplay from "./components/HashDisplay";
import Loading from "./components/Loading";
import PackInfo from "./components/PackInfo";
import ServerPropertiesSnippet from "./components/ServerPropertiesSnippet";

export default function PackDetailsPage() {
    const { id } = useParams();
    useToast();

    // Original pack
    const [pack, setPack] = useState<ApiResourcePack | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hash
    const [hash, setHash] = useState<string | null>(null);
    const [hashLoading, setHashLoading] = useState(false);

    // Conversion
    const [version, setVersion] = useState<string>("1.20.1");
    const [job, setJob] = useState<ApiConversionJob | null>(null);
    const [polling, setPolling] = useState(false);

    // Converted pack
    const [convertedPack, setConvertedPack] = useState<ApiResourcePack | null>(
        null
    );

    const [conversions, setConversions] = useState<ApiResourcePack[]>([]);

    // ForcePack configuration
    const [showForcePackModal, setShowForcePackModal] = useState(false);
    const [forcePackConfig, setForcePackConfig] = useState<{
        config: string;
        mode: "global" | "server";
        serverName?: string;
    } | null>(null);

    const API = process.env.NEXT_PUBLIC_API_URL;

    // Load ForcePack config from localStorage on mount
    useEffect(() => {
        if (!id) return;
        const storageKey = `forcepack-config-${id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setForcePackConfig(JSON.parse(stored));
            } catch (e) {
                // Invalid JSON, remove it
                localStorage.removeItem(storageKey);
            }
        }
    }, [id]);

    // Handle ForcePack config generation
    const handleForcePackConfigGenerated = (config: string, mode: "global" | "server", serverName?: string) => {
        const configData = { config, mode, serverName };
        setForcePackConfig(configData);
        setShowForcePackModal(false);
        
        // Persist to localStorage
        if (id) {
            const storageKey = `forcepack-config-${id}`;
            localStorage.setItem(storageKey, JSON.stringify(configData));
        }
    };

    // Handle closing ForcePack config
    const handleCloseForcePackConfig = () => {
        setForcePackConfig(null);
        if (id) {
            const storageKey = `forcepack-config-${id}`;
            localStorage.removeItem(storageKey);
        }
    };

    // Load original pack
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`${API}/api/resourcepacks/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json() as Promise<ApiResourcePack>;
            })
            .then(setPack)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id, API]);

    // Load existing conversions
    useEffect(() => {
        if (!id) return;
        fetch(`${API}/api/resourcepacks/${id}/conversions`)
            .then((r) => (r.ok ? (r.json() as Promise<ApiResourcePack[]>) : []))
            .then((data) => setConversions(data))
            .catch(() => {});
    }, [id, API]);

    // Load its hash
    useEffect(() => {
        if (!id) return;
        setHashLoading(true);
        fetch(`${API}/api/resourcepacks/${id}/hash`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then((txt) => setHash(txt.trim()))
            .catch((e) => setError(e.message))
            .finally(() => setHashLoading(false));
    }, [id, API]);

    // Kick off a conversion job
    const startConversion = async () => {
        setJob(null);
        setConvertedPack(null);
        const res = await fetch(
            `${API}/api/resourcepacks/${id}/convert?version=${encodeURIComponent(version)}`,
            { method: "POST" }
        );
        if (!res.ok) {
            setError(`Conversion request failed: ${res.status}`);
            return;
        }
        const jobData: ApiConversionJob = await res.json();
        setJob(jobData);
        setPolling(true);
    };

    // Poll for job status
    useEffect(() => {
        if (!polling || !job) return;
        const interval = setInterval(async () => {
            const res = await fetch(
                `${API}/api/resourcepacks/conversions/${job.id}`
            );
            const updated: ApiConversionJob = await res.json();
            setJob(updated);
            if (
                updated.status !== "IN_PROGRESS" &&
                updated.status !== "PENDING"
            ) {
                setPolling(false);
                clearInterval(interval);
                
                

                // On success, reload conversions
                if (updated.status === "COMPLETED") {
                    const conv = await fetch(
                        `${API}/api/resourcepacks/${id}/conversions`
                    ).then((r) =>
                        r.ok ? (r.json() as Promise<ApiResourcePack[]>) : []
                    );
                    setConversions(conv);
                    const child = conv.find((p) => p.targetVersion === version);
                    setConvertedPack(child ?? null);
                }
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [polling, job, id, API, version]);

    if (loading) {
        return <Loading />;
    }
    if (error || !pack) {
        return <ErrorCard error={error ?? "Pack not found"} />;
    }

    // If pack is converted, show scary error and set 403 status
    if (pack.converted) {
        if (typeof window !== "undefined") {
            console.error(
                "[403] Forbidden: Attempted to access converted pack page",
                { id }
            );
            const meta = document.createElement("meta");
            meta.httpEquiv = "status";
            meta.content = "403 Forbidden";
            document.head.appendChild(meta);
        }
        return (
            <ConvertedPackAccessError errorCode={`RPH-403-CONVERTED-${id}`} />
        );
    }

    const downloadUrl = `${API}/uploads/${pack.storageFilename}`;

    // Dynamic layout: if conversions exist or config exists, use grid layout; else, center details and make it larger
    const hasConversions = conversions && conversions.length > 0;
    const hasForcePackConfig = !!forcePackConfig;
    
    // Determine grid layout based on what sections exist
    const getGridCols = () => {
        if (hasConversions && hasForcePackConfig) return "grid-cols-1 lg:grid-cols-3"; // 3 columns on large screens
        if (hasConversions || hasForcePackConfig) return "grid-cols-1 md:grid-cols-2"; // 2 columns
        return null; // Single centered layout
    };
    
    const gridCols = getGridCols();
    
    return (
        <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 overflow-hidden pt-20 pb-20">
            {/* Animated background glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                <div className="absolute inset-0 minecraft-grid opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
                <Link
                    href="/"
                    className="text-sm text-gray-500 hover:underline flex items-center gap-1 mb-4"
                >
                    <X className="w-4 h-4" /> Back to all packs
                </Link>

                {/* Centered ForcePack Button */}
                <GenerateForcePackConfigButton
                    disabled={!!forcePackConfig}
                    onClick={() => setShowForcePackModal(true)}
                    forcePackConfig={forcePackConfig}
                />

                {gridCols ? (
                    <div className={`grid ${gridCols} gap-8`}>
                        {/* Pack Details Section */}
                        <div className="col-span-1">
                            <div className="minecraft-card p-6 md:p-8 space-y-8 border border-white/30 dark:border-gray-800/60 shadow-2xl backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text drop-shadow-glow">
                                    {pack.originalFilename}
                                </h1>
                                <PackInfo pack={pack} />
                                <DownloadUrl url={downloadUrl} />
                                <HashDisplay
                                    hash={hash}
                                    loading={hashLoading}
                                />
                                <ServerPropertiesSnippet
                                    url={downloadUrl}
                                    hash={hash}
                                />
                                <ConversionSection
                                    version={version}
                                    setVersion={setVersion}
                                    polling={polling}
                                    startConversion={startConversion}
                                    job={job}
                                    convertedPack={convertedPack}
                                    conversions={conversions}
                                    API={API ?? ""}
                                />
                            </div>
                        </div>
                        
                        {/* ForcePack Config Section */}
                        {hasForcePackConfig && (
                            <div className="col-span-1">
                                <ForcePackConfigDisplay
                                    config={forcePackConfig.config}
                                    mode={forcePackConfig.mode}
                                    serverName={forcePackConfig.serverName}
                                    onClose={handleCloseForcePackConfig}
                                />
                            </div>
                        )}
                        
                        {/* Converted Packs Section */}
                        {hasConversions && (
                            <div className="col-span-1 flex items-start justify-center">
                                <ConvertedPacksSection packs={conversions} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="w-full max-w-2xl mx-auto">
                            <div className="minecraft-card p-10 md:p-16 space-y-10 border border-white/30 dark:border-gray-800/60 shadow-2xl backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text drop-shadow-glow text-center">
                                    {pack.originalFilename}
                                </h1>
                                <PackInfo pack={pack} />
                                <DownloadUrl url={downloadUrl} />
                                <HashDisplay
                                    hash={hash}
                                    loading={hashLoading}
                                />
                                <ServerPropertiesSnippet
                                    url={downloadUrl}
                                    hash={hash}
                                />
                                <ConversionSection
                                    version={version}
                                    setVersion={setVersion}
                                    polling={polling}
                                    startConversion={startConversion}
                                    job={job}
                                    convertedPack={convertedPack}
                                    conversions={conversions}
                                    API={API ?? ""}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
    
            {/* ForcePack Modal */}
            <ForcePackModal
                open={showForcePackModal}
                onClose={() => setShowForcePackModal(false)}
                pack={pack}
                conversions={conversions}
                apiUrl={API ?? ""}
                onConfigGenerated={handleForcePackConfigGenerated}
            />
        </div>
    );
}