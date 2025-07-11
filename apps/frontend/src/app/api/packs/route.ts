import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, this would fetch from a database
  const packs = [
    {
      id: "1",
      name: "Faithful 32x",
      uploadDate: "2025-01-15T10:30:00Z",
      hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      fileSize: 15728640,
      downloadUrl: "/downloads/faithful-32x.zip",
    },
    {
      id: "2",
      name: "Sphax PureBDcraft",
      uploadDate: "2025-01-14T14:20:00Z",
      hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
      fileSize: 45678901,
      downloadUrl: "/downloads/sphax-purebdcraft.zip",
    },
  ];

  return NextResponse.json(packs);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    // In a real app, you would:
    // 1. Validate the file
    // 2. Generate SHA-256 hash
    // 3. Save to storage
    // 4. Store metadata in database

    const mockResponse = {
      success: true,
      message: "File uploaded successfully",
      pack: {
        id: Date.now().toString(),
        name: file.name,
        uploadDate: new Date().toISOString(),
        hash: "mock-hash-" + Math.random().toString(36).substring(2),
        fileSize: file.size,
        downloadUrl: "/downloads/" + file.name,
      },
    };

    return NextResponse.json(mockResponse);
  } catch {
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
