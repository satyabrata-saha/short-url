import { redirect, notFound } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { id } = await params;
  // console.log(id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/url/singleUrl`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pathdata: id,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log(data);

    if (data && data.data && data.data.originalurl) {
      redirect(data.data.originalurl);
    } else {
      throw new Error("Invalid data structure from API");
    }
  } catch (error) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error processing redirect:", error);
    redirect("/");
  }
}
