import Patient from "@/app/models/Patient";
import { verifyToken } from "@/lib/auth-server";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET (request) {
  try {
    await dbConnect();
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

    const insuranceDetails = await Patient.findOne({ userId }).select("medicalInfo.insuranceInfo");

    if (!insuranceDetails) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      insuranceInfo: insuranceDetails.medicalInfo?.insuranceInfo || null
    });
  } catch (error) {
    console.error('Error fetching insurance info:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST (request) {
  try {
    await dbConnect();
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);
    const userId = decoded?.userId;

    const body = await request.json();
    const { provider, policyNumber, groupNumber, validUntil } = body;

    if (!provider || !provider.trim()) {
      return NextResponse.json(
        { message: 'Insurance provider is required' },
        { status: 400 }
      );
    }

    if (!policyNumber || !policyNumber.trim()) {
      return NextResponse.json(
        { message: 'Policy number is required' },
        { status: 400 }
      );
    }

    if (validUntil && isNaN(Date.parse(validUntil))) {
      return NextResponse.json(
        { message: 'Invalid date format for validUntil' },
        { status: 400 }
      );
    }

    const insuranceData = {
      provider: provider.trim(),
      policyNumber: policyNumber.trim(),
      groupNumber: groupNumber ? groupNumber.trim() : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined
    };

    const patient = await Patient.findOne({userId});

    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }

    if (!patient.medicalInfo) {
      patient.medicalInfo = {};
    }

    patient.medicalInfo.insuranceInfo = insuranceData;

    await patient.save();

    return NextResponse.json({
      success: true,
      message: 'Insurance information saved successfully',
      insuranceInfo: patient.medicalInfo.insuranceInfo
    });
  } catch (error) {
    console.error('Error saving insurance info:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: 'Validation error', errors: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE (request) {
  try {
    await dbConnect();
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);
    const userId = decoded?.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }
    
    const patient = await Patient.findOne({ userid });
    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }

    if (!patient.medicalInfo?.insuranceInfo) {
      return NextResponse.json(
        { message: 'No insurance information found to delete' },
        { status: 404 }
      );
    }

    if (patient.medicalInfo) {
      patient.medicalInfo.insuranceInfo = undefined;
    }

    await patient.save();
    return NextResponse.json({
      success: true,
      message: 'Insurance information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting insurance info:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT (request) {
  try {
    await dbConnect();
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);
    const userId = decoded?.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }
    
    const body = await request.json();

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }

    if (!patient.medicalInfo?.insuranceInfo) {
      return NextResponse.json(
        { message: 'No insurance information found to update' },
        { status: 404 }
      );
    }

     // Update only provided fields
    const allowedFields = ['provider', 'policyNumber', 'groupNumber', 'validUntil'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === "validUntil") {
          updateData[field] = body[field] ? new Date(body[field]) : null;
        } else {
          updateData[field] = body[field] ? body[field].trim() : "";
        }
      }
    });

    // Validate required fields if they're being updated
    if (updateData.provider !== undefined && !updateData.provider) {
      return NextResponse.json(
        { message: 'Insurance provider cannot be empty' },
        { status: 400 }
      );
    }
    
    if (updateData.policyNumber !== undefined && !updateData.policyNumber) {
      return NextResponse.json(
        { message: 'Policy number cannot be empty' },
        { status: 400 }
      );
    }

    // Update insurance info
    Object.assign(patient.medicalInfo.insuranceInfo, updateData);

    await patient.save();

    return NextResponse.json({
      success: true,
      message: 'Insurance information updated successfully',
      insuranceInfo: patient.medicalInfo.insuranceInfo
    });
  } catch (error) {
    console.error('Error updating insurance info:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: 'Validation error', errors: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
    }
  }
