import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL);

  const response = await sql`SELECT * FROM short_url ORDER BY id DESC`;

  return NextResponse.json({
    status: 200,
    message: "Data Fetched Successfully",
    data: response,
  });
}

export async function POST(request = NextRequest) {
  const searchData = await request.json();
  const url = searchData.url;
  const randomString = nanoid(6);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const sql = neon(process.env.DATABASE_URL);

  try {
    const createDataInDatabase =
      await sql`INSERT INTO short_url (originalURL, shortURL) VALUES (${url}, ${randomString}) RETURNING *`;

    const data = {
      id: createDataInDatabase[0].id,
      shorturl: baseUrl + createDataInDatabase[0].shorturl,
      originalurl: createDataInDatabase[0].originalurl,
    };
    console.log(data);

    return NextResponse.json({
      status: 200,
      message: "Data Fetched Successfully",
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Something went wrong while fetching data",
      error: error.message,
    });
  }
}
