

// Generate Dr unique Id

import Doctor from "@/app/models/Doctor";
import User from "@/app/models/User";
import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

function generateDoctorId () {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `DR${year}-${random}`;
}

export async function POST (request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, personalInfo, professionalInfo } = body;

    // validations
    if (!email || !password) {
      return NextResponse.json(
        {error: "Email and password are required"},
        { status: 400 }
      );
    }

    if (!personalInfo?.firstName || !personalInfo?.lastName || !personalInfo?.gender) {
      return NextResponse.json(
        { error: "First name, last name and gender are required" },
        { status: 400 }
      );
    }

    if (!professionalInfo?.specialization || !professionalInfo?.qualification || !professionalInfo?.licenseNumber) {
      return NextResponse.json(
        { error: "specialization, qualification and licenseNumber are required" },
        { status: 400 }
      );
    }

    // Check if user already exist
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exist with this email id" },
        { status: 409 }
      );
    }

    // check if license number already exist
    const existingDoctor = await Doctor.findOne({ "professionalInfo.licenseNumber": professionalInfo.licenseNumber });
    if (existingDoctor) {
      return NextResponse.json(
        { error: "Doctor with this license number already exists" },
        { status: 409 }
      );
    }

    const session = await mongoose.startSession();

    try {
      let newUser, newDoctor;

      await session.withTransaction(async () => {
        // create User
        newUser = new User({
          email: email.toLowerCase(),
          password,
          role: "doctor"
        });

        await newUser.save({ session });

        // Generate unique dr id
      let doctorId, isUnique = false;

      while(!isUnique) {
        doctorId = generateDoctorId();
        const existingDoc = await Doctor.findOne({ doctorId });
        if (!existingDoc) {
          isUnique = true;
        }
      }

      // Create Doctor record
      newDoctor = new Doctor({
        userId: newUser._id,
        doctorId,
        personalInfo: {
          ...personalInfo,
          email: email.toLowerCase()
        },
        professionalInfo
      });

      await newDoctor.save({ session });
      });


      // Generate token
      const token = generateToken({
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profileId: newDoctor._id
      });

      // Create response
      const response = NextResponse.json(
        {
          message: "Doctor registered successfully",
          user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive
          },
          doctor: {
            id: newDoctor._id,
            doctorId: newDoctor.doctorId,
            personalInfo: newDoctor.personalInfo,
            professionalInfo: {
              specialization: newDoctor.professionalInfo.specialization,
              experience: newDoctor.professionalInfo.experience,
              consultationFee: newDoctor.professionalInfo.consultationFee
            }
          }
        },
        {
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
    console.log("Doctor registration failed", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}