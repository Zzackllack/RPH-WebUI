"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Download, HardDrive, Hash } from "lucide-react";
import type React from "react";
import mockPacks from "../data/mockPacks.json";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface ResourcePack {
  id: string;
  name: string;
  uploadDate: string;
  hash: string;
  fileSize: number;
  downloadUrl: string;
}

const PacksList: React.FC = () => {
  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const truncateHash = (hash: string): string => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const handleDownload = (pack: ResourcePack) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${pack.name}`);
    alert(`Downloading ${pack.name} - ${formatFileSize(pack.fileSize)}`);
  };

  return (
    <section className="py-16 px-4 bg-minecraft-stone-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Available Resource Packs
          </h2>
          <p className="text-gray-300 text-lg">
            Browse and download community resource packs
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPacks.map((pack: ResourcePack, index: number) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4 text-minecraft-grass">
                      {pack.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-minecraft-grass" />
                        <span>Uploaded: {formatDate(pack.uploadDate)}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-300">
                        <HardDrive className="w-4 h-4 mr-2 text-minecraft-grass" />
                        <span>Size: {formatFileSize(pack.fileSize)}</span>
                      </div>

                      <div className="flex items-start text-sm text-gray-300">
                        <Hash className="w-4 h-4 mr-2 mt-0.5 text-minecraft-grass flex-shrink-0" />
                        <span className="font-mono break-all">
                          {truncateHash(pack.hash)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDownload(pack)}
                    variant="grass"
                    className="w-full flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {mockPacks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg">
              No resource packs available yet. Be the first to upload one!
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PacksList;
