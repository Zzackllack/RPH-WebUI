export interface ResourcePack {
  id: string;
  name: string;
  description: string;
  version: string;
  mcVersion: string[];
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  size: string;
  thumbnail: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  verified: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  packCount: number;
  totalDownloads: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FilterOptions {
  search: string;
  mcVersion: string[];
  tags: string[];
  sortBy: "downloads" | "rating" | "newest" | "oldest";
  verified: boolean;
}

export interface Stats {
  totalPacks: number;
  totalDownloads: number;
  activeUsers: number;
  packCount: number;
}

/**
 * The shape returned by GET /api/resourcepacks
 */
export interface ApiResourcePack {
  id: number;
  originalFilename: string;
  storageFilename: string;
  size: number; // bytes
  uploadDate: string; // ISO date string
  packFormat?: number;
  minecraftVersion?: string;
  fileHash?: string;
}

/**
 * The shape returned by POST /api/resourcepacks/{id}/convert
 * and GET  /api/resourcepacks/conversions/{jobId}
 */
export interface ApiConversionJob {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  targetVersion: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  consoleLog?: string;
}

export interface ApiResourcePack {
  id: number;
  originalFilename: string;
  storageFilename: string;
  size: number; // bytes
  uploadDate: string; // ISO date string
  packFormat?: number;
  minecraftVersion?: string;

  /** ONLY present on converted packs */
  converted?: boolean;
  targetVersion?: string;
  /** Only present on converted packs */
  originalPack?: { id: number };
}
