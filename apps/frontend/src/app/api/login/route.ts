import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.NEXT_PUBLIC_LOGIN_USER;
    const validPassword = process.env.NEXT_PUBLIC_LOGIN_PASS;

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({ success: true, message: "Login successful" });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }
}
