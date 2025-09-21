import Appointment from "@/app/models/Appointment";
import { verifyToken } from "@/lib/auth-server";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";



// Generate appointment Id
const generateAppointmentId = () => {
  const prefix = "APT";
  const timeStamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, 0);
  return `${prefix}-${timeStamp}-${random}`;
};

// GET patients appointments
export async function GET (request) {
  try {
    await dbConnect();
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    };

    const decoded = verifyToken(token);
    const userId = decoded?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let query = { patient: userId }
    if (status && status !== "all") {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctor",
        select: "personalInfo professionalInfo.specialization professionalInfo.consultationFees "
      })
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: {
          appointments,
          pagination: {
            currentPage: page,
            total: Math.ceil(total/limit),
            hasNext: page < Math.ceil(total/limit),
            hasPrev: page > 1
          }
        }
      }
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST Create new appointment
