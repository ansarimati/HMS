


// Generate unique patient Id

import Patient from "@/app/models/Patient";
import User from "@/app/models/User";
import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// generate patientId
function generatePatientId () {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `P${year}-${random}`;
}


export async function POST (request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, personalInfo, contactInfo, emergencyContact, medicalInfo } = body;

    // Validate email and password
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!personalInfo?.firstName || !personalInfo?.lastName || !personalInfo?.dateOfBirth || !personalInfo?.gender) {
      return NextResponse.json(
        { error: "First name, last name, dob and gender are required" },
        { status: 400 }
      );
    }

    if (!contactInfo?.phone) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      );
    }

    // check if user is already exist
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exist with this email"},
        { status: 409 }
      );
    }

    const session = await mongoose.startSession();

    try {
      let newUser, newPatient

      await session.withTransaction(async () => {
        // create user record
        newUser = new User({
          email: email.toLowerCase(),
          password,
          role: "patient"
        });

        await newUser.save({ session });

        // Generate unique patient Id
        let patientId;
        let isUnique = false;

        while(!isUnique) {
          patientId = generatePatientId();
          const existingPatient = await Patient.findOne({ patientId });
          if (!existingPatient) {
            isUnique = true;
          }
        }


        // create patient record
        newPatient = new Patient({
          userId: newUser._id,
          patientId,
          personalInfo,
          contactInfo,
          emergencyContact,
          medicalInfo: medicalInfo || {}
        });

        await newPatient.save();
      });

      // Generate token
      const token = generateToken({
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profileId: newPatient._id
      });

      // Create response
      const response = NextResponse.json(
        {
          message: "Patient registered successfully",
          user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive
          },
          patient: {
            id: newPatient._id,
            patientId: newPatient.patientId,
            personalInfo: newPatient.personalInfo,
            contactInfo: newPatient.contactInfo
          }
        }, {
          status: 201
        }
      );

      // Set cookies
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });

      return response;

    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.log("Patient registration failed", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}