import Doctor from "@/app/models/Doctor";
import Nurse from "@/app/models/Nurse";
import Patient from "@/app/models/Patient";
import User from "@/app/models/User";
import { generateToken } from "@/lib/auth-server";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"


export async function POST (request) {
  try {
    // db connect
    await dbConnect();

    // parse request body
    const body = await request.json();

    const { email, password, rememberMe = false } = body;

    // validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required", code: 'MISSING_CREDENTIALS' },
        { status: 400 }
      );
    }

    // EMAIL REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'  // ➕ ADDED: Error code
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password", code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Check if user is active or not
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated, Please contact admin", code: 'ACCOUNT_DEACTIVATED' },
        { status: 403 }
      );
    }

    // verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password", code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Fetch role specific profile data
    let profileData = null;
    let profileId = null;

    switch (user.role) {
      case "patient": 
        const patient = await Patient.findOne({ userId: user._id });
        if (patient) {
          profileData = {
            profileType: "patient",
            patientId: patient.patientId,
            personalInfo: patient.personalInfo,
            contactInfo: patient.contactInfo,
            registrationDate: patient.registrationDate
          };
          profileId = patient._id;
        }
        break;

      case "doctor":
        const doctor = await Doctor.findOne({ userId: user._id })
          .populate("professionalInfo.department", "name location");
        if (doctor) {
          profileData = {
            profileType: 'doctor',
            doctorId: doctor.doctorId,
            personalInfo: doctor.personalInfo,
            // professionalInfo: doctor.professionalInfo
            professionalInfo: {
                specialization: doctor.professionalInfo.specialization,
                experience: doctor.professionalInfo.experience,
                consultationFee: doctor.professionalInfo.consultationFee,
                department: doctor.professionalInfo.department
              },
            joinDate: doctor.joinDate,
            status: doctor.status
          };
          profileId = doctor._id
        }
        break;

      case "nurse":
        const nurse = await Nurse.findOne({ userId: user._id })
          .populate("professionalInfo.department", "name location");
        if (nurse) {
          profileData = {
            profileType: 'nurse',
            nurseId: nurse.nurseId,
            personalInfo: nurse.personalInfo,
            // professionalInfo: nurse.professionalInfo
            professionalInfo: {
                experience: nurse.professionalInfo.experience,
                shift: nurse.professionalInfo.shift,
                department: nurse.professionalInfo.department
              },
            joinDate: nurse.joinDate,
            status: nurse.status
          };
          profileId = nurse._id;
        }
        break;

        // Admin, receptionist, pharmacist don't have additional profile schemas
        case 'admin':
        case 'receptionist':
        case 'pharmacist':
          break;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate Token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      profileId,
      loginTime: Date.now(),  
      rememberMe
    };
    const token = generateToken(tokenPayload, tokenExpiry);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        emailVerified: user.emailVerified,
        profile: profileData
      },
      loginTime: new Date().toISOString()
    }, { status: 200 });

    // Set cookies (Dynamic cookie expiration based on rememberMe)
    const cookieMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN })
    });

    // Additional cookie for client-side auth status checking
    response.cookies.set("auth-status", "authenticated", {
      httpOnly: false, // Readable by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/'
    })

    return response;

  } catch (error) {
    console.log("Loin error", error);
    return NextResponse.json(
      { error: "Internal Server Error", code: 'INTERNAL_ERROR' },
      { status: 500 }
    );

  }
}

// CORS support
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}