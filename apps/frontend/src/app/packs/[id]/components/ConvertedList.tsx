import type { ApiResourcePack } from "@/app/types";
import { Download } from "lucide-react";

export default function ConvertedList({
    packs,
    API,
}: {
    packs: ApiResourcePack[];
    API: string;
}) {
    if (!packs.length) return null;
    return (
        <div className="minecraft-card p-6 mt-8 space-y-2 border border-emerald-400/20 bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-gray-900/80 dark:to-emerald-900/40 shadow-md">
            <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                Converted Versions
            </h2>
            <ul className="space-y-1">
                {packs.map((p) => (
                    <li
                        key={p.id}
                        className="flex items-center justify-between text-sm"
                    >
                        <span className="font-mono text-gray-700 dark:text-gray-300">
                            {p.targetVersion ?? ""}
                        </span>
                        <a
                            href={`${API}/uploads/${p.storageFilename}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                            download
                        >
                            <Download className="w-4 h-4" /> {p.storageFilename}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
