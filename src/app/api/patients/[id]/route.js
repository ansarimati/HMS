import Patient from "@/app/models/Patient";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET (request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const patient = await Patient.findOne({ userId: id }).populate("userId");
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: patient },
    )
  } catch (error) {
    console.error("Error in GET /api/patients/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}


export async function PATCH (request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const updateData = await request.json();

    console.log("Received update data:", updateData);

    // Validate that patient exists
    const patient = await Patient.findOne({ userId: id });
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Build the update object
    const updateFields = {};

    // Handle personalInfo updates
    if (updateData.personalInfo) {
      if (updateData.personalInfo.firstName !== undefined) {
        updateFields["personalInfo.firstName"] = updateData.personalInfo.firstName;
      }

      if (updateData.personalInfo.lastName !== undefined) {
        updateFields["personalInfo.lastName"] = updateData.personalInfo.lastName;
      }

      if (updateData.personalInfo.dateOfBirth !== undefined) {
        updateFields["personalInfo.dateOfBirth"] = updateData.personalInfo.dateOfBirth;
      }

      if (updateData.personalInfo.gender !== undefined) {
        updateFields["personalInfo.gender"] = updateData.personalInfo.gender
      }
    }

    // Handle Contact Info
    if (updateData.contactInfo) {
      if (updateData.contactInfo.phone !== undefined) {
        updateFields["contactInfo.phone"] = updateData.contactInfo.phone;
      }

      if (updateData.contactInfo.alternatePhone !== undefined) {
        updateFields["contactInfo.alternatePhone"] = updateData.contactInfo.alternatePhone;
      }

      if (updateData.contactInfo.email !== undefined) {
        updateFields["contactInfo.email"] = updateData.contactInfo.email;
      }

      if (updateData.contactInfo.address) {
        if (updateData.contactInfo.address.street !== undefined) {
          updateFields["contactInfo.address.street"] = updateData.contactInfo.address.street;
        }

        if (updateData.contactInfo.address.city !== undefined) {
          updateFields["contactInfo.address.city"] = updateData.contactInfo.address.city;
        }

        if (updateData.contactInfo.address.state !== undefined) {
          updateFields["contactInfo.address.state"] = updateData.contactInfo.address.state;
        }

        if (updateData.contactInfo.address.zipCode !== undefined) {
          updateFields["contactInfo.address.zipCode"] = updateData.contactInfo.address.zipCode;
        }

        if (updateData.contactInfo.address.country !== undefined) {
          updateFields["contactInfo.address.country"] = updateData.contactInfo.address.country;
        }
      }
    }

    // Perform the update
    const updatedPatient = await Patient.findOneAndUpdate(
      { userId: id },
      { $set: updateFields },
      {
        new: true,
        runValidators: true
      }
    ).populate("userId");

    return NextResponse.json(
      { success: true, message: "Patient info updated successfully", data:  updatedPatient },
      { status: 200 }
    )
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}