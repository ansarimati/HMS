import Doctor from "@/app/models/Doctor";
import Patient from "@/app/models/Patient";
import User from "@/app/models/User";
import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST (request) {
  try {
    // console.log("INSIDE POST METHOD")
    await dbConnect();
    // console.log("after db connect");
    const body = await request.json();
    const { email, password, role, profileData } = body;


    // basic validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, Password, Role are required"},
        { status: 400 }
      );
    }

    // validate password
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be atleast 8 char long" },
        { status: 400 }
      )
    }

    // check if user already exist
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // start transaction for multi collection operations
    // console.log("before starting session")
    // const session = await dbConnect().startSession();
    
    const session = await mongoose.startSession();
    // console.log("after start session")

    let response;

    try {
      await session.withTransaction(async () => {
        // Step 1 : create user record
        const newUser = new User({
          email: email.trim().toLowerCase(),
          password,
          role
        });

        await newUser.save({ session });

        // create role specific profile record
        let profileRecord = null;

        switch (role) {
          case "patient":
            if (!profileData) {
              throw new Error("Profile data is required for patient registration");
            }
            profileRecord = new Patient({
              userId: newUser._id,
              ...profileData
            });
            await profileRecord.save({ session });
            break;

          case "doctor":
            if (!profileData) {
              throw new Error('Profile data is required for doctor registration');
            }
            profileRecord = new Doctor({
              userId: newUser._id,
              ...profileData
            });
            await profileRecord.save({ session });
            break;

          case "nurse":
            if (!profileData) {
              throw new Error('Profile data is required for nurse registration');
            }
            profileRecord = new Nurse({
              userId: newUser._id,
              ...profileData
            });
            await profileRecord.save({ session });
            break;

          case "admin":
          case "receptionist":
          case "pharmacist":
            break;

          default:
            throw new Error("Invalid role specified");
        }

        // Generate token
        const token = generateToken({
          userId: newUser._id,
          email: newUser.email,
          role: newUser.role,
          profileId: profileRecord?._id
        });

        // create response
        response = NextResponse.json({
          message: "User registered successfully",
          user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            isActive: newUser.isActive,
            profileId: profileRecord?._id
          }
        }, {
          status: 201
        });

        // Set cookies
        response.cookies.set("auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });

        // return response;
      })
    } catch (transactionError) {
      console.log("transactionError", transactionError);
    } finally {
      await session.endSession();
    }

    return response;

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: errors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}