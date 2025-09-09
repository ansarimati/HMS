import Department from "@/app/models/Department";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET (request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("active");

    let query = {};
    if (isActive === "true") {
      query.isActive = true;
    }

    const departments = await Department.find(query)
      .select("_id name description location facilities")
      .sort({ name: 1 });

    return NextResponse.json({
      departments,
      count: departments.length
    });

  } catch (error) {
    console.log("Department fetch error", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}