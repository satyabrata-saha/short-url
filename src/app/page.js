"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [originalURL, setOriginalURL] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [urlData, setUrlData] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

      const data = await response.json();
      setUrlData([data.data]);
      console.log([data.data]);
    } catch (error) {
      console.error("Error submitting URL:", error);
    }
  };

  const handleCopy = (urlToCopy) => {
    navigator.clipboard.writeText(urlToCopy);
  };

  useEffect(() => {
    const firstRequest = async () => {
      try {
        const response = await fetch("/api/url/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUrlData([data.data]);
        console.log([data.data]);
      } catch (error) {
        console.error("Error submitting URL:", error);
      }
    };
    firstRequest();
  }, []);

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
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Original URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Short URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-700 bg-slate-800">
              {urlData[0]?.map((data) => (
                <tr key={data.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                    {/* Added truncation for very long URLs */}
                    <div className="max-w-xs truncate" title={data.originalurl}>
                      {data.originalurl}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                    {baseUrl + data.shorturl}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => (
                        handleCopy(baseUrl + data.shorturl), setIsCopied(true)
                      )}
                      className="cursor-pointer font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {isCopied ? (
                        <span className="text-green-400">✅ Copied!</span>
                      ) : (
                        <span className="text-blue-400">📋 Copy</span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
