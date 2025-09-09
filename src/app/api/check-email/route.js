import User from "@/app/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET (request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!email || !role) {
      return NextResponse.js(
        {error: "Email and role is required" },
        { status: 400}
      );
    }

    const existingUser = await User.findOne({ email, role });

    if (existingUser) {
      return NextResponse.json({ exist: true });
    }

    return NextResponse.json({ exist: false });
  } catch (error) {
    console.log("Email check error", error);
    return NextResponse.json(
      {error: "Internal server Error"},
      { status: 500 }
    )
  }
}