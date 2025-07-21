import type { ApiConversionJob, ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useState } from "react";

type Props = {
    version: string;
    setVersion: (v: string) => void;
    polling: boolean;
    startConversion: () => void;
    job: ApiConversionJob | null;
    convertedPack: ApiResourcePack | null;
    API: string;
};

function isValidVersion(input: string) {
    // Matches x.x or x.x.x where x is one or more digits
    return /^(\d+\.\d+|\d+\.\d+\.\d+)$/.test(input);
}

export default function ConversionSection({
    version,
    setVersion,
    polling,
    startConversion,
    job,
    convertedPack,
    API,
}: Props) {
    const [input, setInput] = useState(version);
    const [touched, setTouched] = useState(false);

    const valid = isValidVersion(input);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
        setVersion(e.target.value);
        setTouched(true);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="minecraft-card p-6 mt-8 space-y-4 border border-emerald-400/20 bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-gray-900/80 dark:to-emerald-900/40 shadow-md"
        >
            <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                Convert to another version
            </h2>
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(true)}
                    className={`minecraft-input flex-1 ${touched && !valid ? "border-red-500" : ""}`}
                    placeholder="e.g. 1.20 or 1.20.4"
                    pattern="^\d+\.\d+(\.\d+)?$"
                    inputMode="decimal"
                    aria-invalid={touched && !valid}
                />
                <button
                    onClick={startConversion}
                    disabled={!!polling || !valid}
                    className={`minecraft-button flex items-center gap-2 relative px-4 py-2 ${polling || !valid ? "cursor-not-allowed opacity-80" : ""}`}
                >
                    {polling ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin w-4 h-4 text-emerald-500"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            <span>Converting…</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-emerald-500"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14M12 5l7 7-7 7"
                                />
                            </svg>
                            <span>Start Conversion</span>
                        </span>
                    )}
                </button>
            </div>
            {touched && !valid && (
                <p className="text-red-500 text-xs mt-1">
                    Please enter a valid version in the format x.x or x.x.x
                </p>
            )}

            {job && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                        <strong>Job #{job.id}:</strong>
                        {job.status === "PENDING" ||
                        job.status === "IN_PROGRESS" ? (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                                <svg
                                    className="animate-spin w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                <span>{job.status.replace("_", " ")}</span>
                            </span>
                        ) : job.status === "FAILED" ? (
                            <span className="flex items-center gap-1 text-red-500">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h8"
                                    />
                                </svg>
                                <span>Failed</span>
                            </span>
                        ) : job.status === "COMPLETED" ? (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4"
                                    />
                                </svg>
                                <span>Completed</span>
                            </span>
                        ) : (
                            <span className="text-gray-500">
                                {String(job.status).replace("_", " ")}
                            </span>
                        )}
                    </div>
                    {job.status === "FAILED" && (
                        <p className="text-red-500 flex items-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 12h8"
                                />
                            </svg>
                            <span>Error: {job.errorMessage}</span>
                        </p>
                    )}
                    {job.consoleLog && (
                        <pre className="bg-black/5 dark:bg-white/5 p-2 rounded text-xs overflow-x-auto max-h-40">
                            {job.consoleLog}
                        </pre>
                    )}
                </div>
            )}

            {convertedPack && (
                <div className="mt-4 p-4 border border-green-300 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="font-medium text-green-700 dark:text-green-300">
                        Conversion completed! Download:
                    </p>
                    <a
                        href={`${API}/uploads/${convertedPack.storageFilename}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        download
                    >
                        <Download className="w-4 h-4" />{" "}
                        {convertedPack.storageFilename}
                    </a>
                </div>
            )}
        </motion.div>
    );
}
