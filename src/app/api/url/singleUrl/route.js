import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request = NextRequest) {
  const pathdata = await request.json();
  const sql = neon(process.env.DATABASE_URL);

  try {
    const createDataInDatabase =
      await sql`SELECT id, originalurl, visits FROM short_url WHERE shorturl = ${pathdata.pathdata}`;

    await sql`UPDATE short_url SET visits = ${
      Number(createDataInDatabase[0].visits) + 1
    } WHERE shorturl = ${pathdata.pathdata}`;

    const data = {
      originalurl: createDataInDatabase[0].originalurl,
    };
    // console.log(data);

    return NextResponse.json({
      status: 200,
      message: "Data Fetched Successfully",
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
}
