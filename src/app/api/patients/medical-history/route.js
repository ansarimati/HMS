import Patient from "@/app/models/Patient";
import { verifyToken } from "@/lib/auth-server";

import dbConnect from "@/lib/dbConnect";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function GET (request) {
  try {
    await dbConnect();

    // const userId = request.headers.get("x-user-id");
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }
    let decoded = verifyToken(token);
    const userId = decoded?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      medicalInfo: patient.medicalInfo || [],
      personalInfo: {
        firstName: patient.personalInfo.firstName,
        lastName: patient.personalInfo.lastName,
        dateOfBirth: patient.personalInfo.dateOfBirth,
        gender: patient.personalInfo.gender
      },
      bloodGroup: patient.bloodGroup || "Not Specified",
    })
  } catch (error) {
    console.error("Error fetching medical history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}