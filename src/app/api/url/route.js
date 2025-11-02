import { NextResponse } from "next/server";

export async function GET() {}

export async function POST(request = NextRequest) {
  const searchData = await request.json();
  const url = searchData.url;

  try {
    const randomUrlPath = Math.floor(Math.random() * 100);

    const urlData = {
      shortURL: process.env.BASE_URL + randomUrlPath,
      originalURL: url,
    };

    const data = urlData;

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
