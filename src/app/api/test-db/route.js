import dbConnect from "@/lib/dbConnect";

export async function GET () {
  try {
    await dbConnect();
    return new Response(
      JSON.stringify({ message: "MongoDb Connected" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.log("MongoDb connection error ", error);
    return new Response(
      JSON.stringify({ message: "MongoDb Connection Failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
      
    )
  }
}