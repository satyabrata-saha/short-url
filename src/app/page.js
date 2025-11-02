"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [originalURL, setOriginalURL] = useState("");
  const [urlData, setUrlData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOriginalURL(event.target.url.value);

    try {
      const response = await fetch("/api/url/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: event.target.url.value }),
      });

      const data = (await response.json()).data;
      setUrlData(data);
    } catch (error) {
      console.error("Error submitting URL:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            name="url"
            placeholder="url"
            type="url"
            className="border border-amber-400 rounded-md p-2"
          />
          <button type="submit" className="bg-amber-400 rounded-md p-2">
            Submit
          </button>
        </form>
        {/* <p>{originalURL}</p> */}
        <p>{urlData.shortURL}</p>
        <p>{urlData.originalURL}</p>
      </div>
    </div>
  );
}
