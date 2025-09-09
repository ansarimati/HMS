// PROTECTED API ROUTE

import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Patient from "@/app/models/Patient";

// ✨ NEW: Using withAuth middleware wrapper
async function getPatientsHandler (request) {
  try {
    await dbConnect();

    // ✨ request.user is automatically available from withAuth middleware
    const { user } = request;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    // ✨ NEW: Role-based data filtering
    let query = {};

    // If user is a patient, only show their own data
    if (user.role === "patient") {
      const patientProfile = await Patient.findOne({ userId: user._id });
      if (!patientProfile) {
        return NextResponse.json(
          { patients: [], totalCount: 0 }
        );
      }
      query._id = patientProfile._id;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { "personalInfo.firstName": new RegExp(search, "i") },
        { "personalInfo.lastName": new RegExp(search, "i") },
        { "patientId": new RegExp(search, "i") }
      ];
    }

    const patients = await Patient.find(query)
      .populate("userId", "email isActive")
      .limit(limit)
      .skip((page -1) * limit)
      .sort({ createdAt: -1 });

    const totalCount = await Patient.countDocuments(query);

    return NextResponse.json(
      {
        patients,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount/limit),
        hasNextPage: page < Math.ceil(totalCount/limit),
        hasPrevPage: page > 1
      }
    );

  } catch (error) {
    console.log("Get patients error", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// ✨ NEW: Export wrapped handler with role-based authorization
export const GET = withAuth(getPatientsHandler, {
  roles: ["admin", "doctor", "nurse", "receptionist", "patient"]
});

// ✨ NEW: POST endpoint for creating patients (admin/receptionist only)
async function createPatientHandler (request) {
  try {
    await dbConnect();

    const { user } = request;
    const body = await request.json();
    const patientData = {
      ...body,
      createdBy: user._id,
      createdAt: new Date()
    }

    const newPatient = new Patient(patientData);
    await newPatient.save();

    return NextResponse.json(
      { message: "Patient created successfully", patient: newPatient },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create patient' },
      { status: 400 }
    );
  }
}

export const POST = withAuth(createPatientHandler, {
  roles: ['admin', 'receptionist'] // Only admin and receptionist can create patients
});