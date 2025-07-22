import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Braces, Copy, Check } from "lucide-react";
import type { ApiResourcePack } from "@/app/types";

export default function ForcePackConfigSection({
    pack,
    conversions,
    apiUrl,
}: {
    pack: ApiResourcePack;
    conversions: ApiResourcePack[];
    apiUrl: string;
}) {
    const [mode, setMode] = useState<"global" | "server">("global");
    const [serverName, setServerName] = useState("");
    const [copied, setCopied] = useState(false);

    const snippet = useMemo(() => {
        const baseUrl = `${apiUrl}/uploads/${pack.storageFilename}`;
        const baseHash = pack.fileHash ?? "";
        let cfg = "";
        if (mode === "global") {
            cfg += `[global-pack]
    enable = true
    url = "${baseUrl}"
    hash = "${baseHash}"
    generate-hash = false
    resourcepack.prompt = "some message"
    exclude = ["someserver"]

    [global-pack.actions]
        [global-pack.actions.ACCEPTED]
            kick = false
            commands = []
        [global-pack.actions.DECLINED]
            kick = true
            message = "some message"
            commands = []
        [global-pack.actions.FAILED_DOWNLOAD]
            kick = true
            message = "some message"
            commands = []
        [global-pack.actions.FAILED_RELOAD]
            kick = true
            message = "some message"
            commands = []
        [global-pack.actions.SUCCESSFUL]
            kick = false
            commands = []
`;
            conversions.forEach((c) => {
                const url = `${apiUrl}/uploads/${c.storageFilename}`;
                const hash = c.fileHash ?? "";
                cfg += `
[global-pack.version.${c.packFormat}]
    resourcepack.url = "${url}"
    resourcepack.generate-hash = false
    resourcepack.hash = "${hash}"
    resourcepack.prompt = "some message"
`;
            });
        } else if (serverName) {
            const name = serverName;
            cfg += `[servers]
    [servers.${name}]
        resourcepack.urls = ["${baseUrl}"]
        resourcepack.generate-hash = false
        resourcepack.hashes = ["${baseHash}"]
        resourcepack.prompt = "some message"
        [servers.${name}.actions]
            [servers.${name}.actions.ACCEPTED]
                kick = false
                commands = []
            [servers.${name}.actions.DECLINED]
                kick = true
                message = "some message"
                commands = []
            [servers.${name}.actions.FAILED_DOWNLOAD]
                kick = true
                message = "some message"
                commands = []
            [servers.${name}.actions.FAILED_RELOAD]
                kick = true
                message = "some message"
                commands = []
            [servers.${name}.actions.SUCCESSFUL]
                kick = false
                commands = []
`;
            conversions.forEach((c) => {
                const url = `${apiUrl}/uploads/${c.storageFilename}`;
                const hash = c.fileHash ?? "";
                cfg += `
[servers.${name}.version.${c.packFormat}]
    resourcepack.url = "${url}"
    resourcepack.generate-hash = false
    resourcepack.hash = "${hash}"
    resourcepack.prompt = "some message"
`;
            });
        }
        return cfg.trim();
    }, [mode, serverName, pack, conversions, apiUrl]);

    const copy = () => {
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="minecraft-card p-6 mt-4 space-y-4 border border-emerald-400/20 bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-gray-900/80 dark:to-emerald-900/40 shadow-md"
        >
            <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <Braces className="w-5 h-5" /> ForcePack Config
            </h2>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 text-sm">
                    <input
                        type="radio"
                        className="mr-1"
                        checked={mode === "global"}
                        onChange={() => setMode("global")}
                    />
                    Global Pack
                </label>
                <label className="flex items-center gap-1 text-sm">
                    <input
                        type="radio"
                        className="mr-1"
                        checked={mode === "server"}
                        onChange={() => setMode("server")}
                    />
                    Server Pack
                </label>
                {mode === "server" && (
                    <input
                        type="text"
                        placeholder="server name"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        className="minecraft-input max-w-xs"
                    />
                )}
            </div>
            {snippet && (
                <div className="relative">
                    <pre className="bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-100 select-all overflow-x-auto shadow-inner border border-emerald-400/10 whitespace-pre-line break-words">
                        {snippet}
                    </pre>
                    <button
                        className={`absolute top-2 right-2 p-1 rounded transition ${copied ? "bg-green-100 dark:bg-green-900/30" : "hover:bg-emerald-100 dark:hover:bg-emerald-900/30"}`}
                        onClick={copy}
                        title={copied ? "Copied!" : "Copy config"}
                        aria-label={copied ? "Copied!" : "Copy config"}
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4 text-emerald-400" />
                        )}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
