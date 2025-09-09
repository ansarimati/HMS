import Nurse from "@/app/models/Nurse";
import User from "@/app/models/User";
import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


// Generate unique nurse id
function generateNurseId () {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `N${year}-${random}`;
}

export async function POST (request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, personalInfo, professionalInfo } = body;

    // validate fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.dateOfBirth || !personalInfo.gender) {
      return NextResponse.json(
        { error: "First name, last name, dob and gender are required" },
        { status: 400 }
      );
    }

    if (!professionalInfo.qualification || !professionalInfo.licenseNumber || !professionalInfo.department) {
      return NextResponse.json(
        { error: "Qualification, license number and department are required" },
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

    // Check if license number is already exist
    const existingNurse = await Nurse.findOne({ "professionalInfo.licenseNumber": professionalInfo.licenseNumber });
    if (existingNurse) {
      return NextResponse.json(
        { error: "Nurse is with this license number already existed" },
        { status: 409 }
      );
    }

    const session = await mongoose.startSession();

    try {
      let newUser, newNurse;

      await session.withTransaction( async () => {
        // Create User
        newUser = new User({
          email: email.toLowerCase(),
          password,
          role: "nurse"
        });

        await newUser.save({ session });

        // Generate unique Id
        let nurseId, isUnique = false;
        
        while (!isUnique) {
          nurseId = generateNurseId();
          const existingNur = await Nurse.findOne({ nurseId });
          if (!existingNur) {
            isUnique = true;
          }
        }


        // Create Nurse record
        newNurse = new Nurse({
          userId: newUser._id,
          nurseId,
          personalInfo: {
            ...personalInfo,
            email: email.toLowerCase()
          },
          professionalInfo
        });

        newNurse.save({ session });
      });

      // Generate token
      const token = generateToken({
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profileId: newNurse._id
      });

      // Create response
      const response = NextResponse.json(
        {
          message: "Nurse registered successfully",
          user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive
          },
          nurse: {
            id: newNurse._id,
            nurseId: newNurse.nurseId,
            personalInfo: newNurse.personalInfo,
            professionalInfo: {
              department: newNurse.professionalInfo.department,
              shift: newNurse.professionalInfo.shift,
              experience: newNurse.professionalInfo.experience
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
    console.log("Nurse registration failed", error);
    return NextResponse.json(
      { error: error.messsage || "Internal Server Error" },
      { status: 500 }
    );
  }
}