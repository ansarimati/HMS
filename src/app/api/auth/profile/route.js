import Doctor from "@/app/models/Doctor";
import Nurse from "@/app/models/Nurse";
import Patient from "@/app/models/Patient";
import User from "@/app/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function GET (request) {
  try {
    await dbConnect();
    // const userId = request.headers.get("x-user-id");

    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      )
    }

    // verify jwt
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId || decoded.id;  
    } catch (jwtError) {
      console.log("Jwt verification failed", jwtError);
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!user) {
      return NextResponse.json(
        { error: "User Not Found" },
        { status: 404 }
      );
    }

    // Fetch role specific profile data
    let profileData = null;

    switch (user.role) {
      case "patient":
        const patient = await Patient.findOne({ userId: user._id });
        if (patient) {
          profileData = {
            profileType: "patient",
            patientId: patient.patientId,
            personalInfo: patient.personalInfo,
            contactInfo: patient.contactInfo,
            medicalInfo: patient.medicalInfo,
            registrationDate: patient.registrationDate
          };
        }
        break;

      case "doctor":
        const doctor = await Doctor.findOne({ userId: user._id });
        if (doctor) {
          profileData = {
          profileId: doctor.doctorId,
          personalInfo: doctor.personalInfo,
          professionalInfo: doctor.professionalInfo,
          joinDate: doctor.joinDate,
          status: doctor.status
        };
      }
      break;

      case "nurse":
        const nurse = await Nurse.findOne({ userId: user._id })
          .populate('professionalInfo.department', 'name location');
        if (nurse) {
          profileData = {
            profileType: 'nurse',
            nurseId: nurse.nurseId,
            personalInfo: nurse.personalInfo,
            professionalInfo: nurse.professionalInfo,
            joinDate: nurse.joinDate,
            status: nurse.status
          };
        }
        break;
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          profile: profileData
        }
      }
    );

  } catch (error) {
    console.log("Profile match error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}