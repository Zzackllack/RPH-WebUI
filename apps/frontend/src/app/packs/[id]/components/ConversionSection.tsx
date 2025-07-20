import type { ApiConversionJob, ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

type Props = {
  version: string;
  setVersion: (v: string) => void;
  polling: boolean;
  startConversion: () => void;
  job: ApiConversionJob | null;
  convertedPack: ApiResourcePack | null;
  API: string;
};


export default function ConversionSection({ version, setVersion, polling, startConversion, job, convertedPack, API }: Props) {
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
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="minecraft-input flex-1"
          placeholder="e.g. 1.20.1"
        />
        <button
          onClick={startConversion}
          disabled={!!polling}
          className="minecraft-button"
        >
          {polling ? "Converting…" : "Start Conversion"}
        </button>
      </div>

      {job && (
        <div className="mt-4 space-y-2">
          <p>
            <strong>Job #{job.id}:</strong> {job.status.replace("_", " ")}
          </p>
          {job.status === "FAILED" && (
            <p className="text-red-500">
              Error: {job.errorMessage}
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
            <Download className="w-4 h-4" /> {convertedPack.storageFilename}
          </a>
        </div>
      )}
    </motion.div>
  );
}
