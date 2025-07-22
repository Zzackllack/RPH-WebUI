"use client";

import { WarningModal } from "@/app/components/ui/WarningModal";
import type { ApiResourcePack } from "@/app/types";
import { AnimatePresence, motion } from "framer-motion";
import { FolderSync, HelpCircle, Play, X } from "lucide-react";
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface ConvertVersionModalProps {
    open: boolean;
    onClose: () => void;
    conversions: ApiResourcePack[];
    onConvert: (version: string) => void;
}

export function ConvertVersionModal({
    open,
    onClose,
    conversions,
    onConvert,
}: ConvertVersionModalProps) {
    const [input, setInput] = useState("");
    const [touched, setTouched] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    function isValidVersion(input: string) {
        return /^(\d+\.\d+|\d+\.\d+\.\d+)$/.test(input);
    }

    const valid = isValidVersion(input);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
        setTouched(true);
        if (conversions.find((conv) => conv.targetVersion === e.target.value)) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
    }

    function handleConvert() {
        if (valid && !showWarning) {
            onConvert(input);
            setInput("");
            setTouched(false);
            setShowWarning(false);
            onClose();
        }
    }

    if (!open) return null;

    return typeof window !== "undefined"
        ? createPortal(
              <AnimatePresence>
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                      onClick={onClose}
                  >
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="relative w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                      >
                          <button
                              onClick={onClose}
                              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Close"
                          >
                              <X className="w-6 h-6 text-gray-500" />
                          </button>
                          <div className="flex items-center gap-3 mb-8">
                              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                  <FolderSync className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                      Convert to Another Version
                                  </h2>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                      <HelpCircle className="w-4 h-4" />
                                      Enter the targeted Minecraft version to convert this pack into.
                                  </p>
                              </div>
                          </div>
                          <WarningModal
                              open={showWarning}
                              onClose={() => setShowWarning(false)}
                              version={input}
                          />
                          <div className="space-y-4">
                              <input
                                  type="text"
                                  value={input}
                                  onChange={handleInputChange}
                                  onBlur={() => setTouched(true)}
                                  className={`minecraft-input w-full ${touched && !valid ? "border-red-500" : ""}`}
                                  placeholder="e.g. 1.20 or 1.20.4"
                                  pattern="^\d+\.\d+(\.\d+)?$"
                                  inputMode="decimal"
                                  aria-invalid={touched && !valid}
                              />
                              {touched && !valid && (
                                  <p className="text-red-500 text-xs mt-1 pt-3">
                                      Please enter a valid version in the format x.x or x.x.x
                                  </p>
                              )}
                              <div className="pt-3">
                                <button
                                    onClick={handleConvert}
                                    disabled={!valid || showWarning}
                                    className={`minecraft-button w-full px-6 py-2 text-base font-semibold flex items-center gap-2 transition-all duration-300 ${
                                        !valid || showWarning
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:scale-105 hover:shadow-xl"
                                    }`}
                                >
                                    <span className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </span>
                                    <span>Start Conversion</span>
                                </button>
                              </div>
                          </div>
                      </motion.div>
                  </motion.div>
              </AnimatePresence>,
              document.body
          )
        : null;
}
