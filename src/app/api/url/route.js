import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL);

  const response = await sql`SELECT * FROM short_url ORDER BY id DESC`;

  if (response.length > 1000) {
    await sql`TRUNCATE TABLE short_url`;
    return NextResponse.json({
      status: 200,
      message:
        "Data Exceeded The Limit of 1000 Short URL, Data Deleted Successfully",
      data: response,
    });
  } else {
    return NextResponse.json({
      status: 200,
      message: "Data Fetched Successfully",
      data: response,
    });
  }
}

export async function POST(request = NextRequest) {
  const searchData = await request.json();
  const originalurl = searchData.originalurl;
  const shorturl = searchData.shorturl || nanoid(6);
  const sql = neon(process.env.DATABASE_URL);

  if (!originalurl) {
    return NextResponse.json({
      status: 400,
      message: "Original URL is required",
    });
  }

  try {
    const createDataInDatabase =
      await sql`INSERT INTO short_url (originalURL, shortURL) VALUES (${originalurl}, ${shorturl}) RETURNING *`;

    const data = {
      id: createDataInDatabase[0].id,
      shorturl: createDataInDatabase[0].shorturl,
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
      message: "short term already exists try different one",
      error: error.message,
    });
  }
}
