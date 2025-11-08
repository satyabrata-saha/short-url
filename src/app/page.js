"use client";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineSwitchAccessShortcut } from "react-icons/md";
import { SiShortcut } from "react-icons/si";
import { useEffect, useState } from "react";

export default function Home() {
  const [originalURL, setOriginalURL] = useState("");
  const [shortURLInput, setShortURLInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [urlData, setUrlData] = useState([]);
  const [currUrlData, setCurrUrlData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOriginalURL(event.target.url.value);
    setShortURLInput(event.target.shorturl.value);

    try {
      const response = await fetch("/api/url/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalurl: event.target.url.value,
          shorturl: event.target.shorturl.value,
        }),
      });

      const data = await response.json();
      if (data.status === 500 || data.status === 400) {
        setErrorMessage(data.message);
        return;
      }
      setCurrUrlData(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error submitting URL:", error);
    }
  };

  const handleCopy = (urlToCopy) => {
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 1000);

        //reload page
        window.location.reload();
      })
      .catch((err) => console.error("Failed to copy text: ", err));
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-100 dark:bg-slate-900">
      <div className="w-full max-w-4xl rounded-xl bg-white dark:bg-slate-900">
        <div className="flex flex-col gap-6 p-6 sm:p-8 sm:pt-24">
          <div className="flex flex-col gap-6 w-full items-center">
            <div className="flex flex-col gap-6 w-full max-w-xl justify-center items-center">
              <SiShortcut className="font-bold text-amber-500 text-4xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center text-wrap">
                A Public URL Shortener
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center text-wrap">
                After 1000 short url the website will reset and all the data
                will be deleted and you will have to start again from the
                beginning
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="url-input"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Original URL
                </label>
                <input
                  id="url-input"
                  name="url"
                  placeholder="https://my-super-long-url.com/..."
                  type="url"
                  className="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                  required
                />
              </div>

              <div className="sm:w-1/3">
                <label
                  htmlFor="short-input"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Custom Path (Optional)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    /
                  </span>
                  <input
                    id="short-input"
                    name="shorturl"
                    placeholder="my-link"
                    type="text"
                    className="w-full flex-1 rounded-none rounded-r-md border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-md bg-amber-400 p-2 px-4 font-medium text-black shadow-sm transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:ring-offset-slate-900 flex flex-row gap-2 text-center items-center justify-center"
              >
                Shorten
                <MdOutlineSwitchAccessShortcut />
              </button>
            </form>
            <div className="text-red-500">{errorMessage}</div>
          </div>
          <div>
            {(currUrlData.originalurl && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Short URL
                  </h3>
                  <div className="flex flex-row gap-6">
                    <Link
                      href={baseUrl + currUrlData.shorturl}
                      className="text-sm hover:text-blue-500"
                    >
                      {baseUrl + currUrlData.shorturl}
                    </Link>
                    <button
                      onClick={() => (
                        handleCopy(baseUrl + shortURLInput), setIsCopied(true)
                      )}
                      className="cursor-pointer font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {isCopied ? (
                        <span className="text-green-400">✅ Copied!</span>
                      ) : (
                        <span className="text-blue-400">📋 Copy</span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Original URL
                  </h3>
                  <Link
                    href={currUrlData.originalurl}
                    className="text-sm hover:text-blue-500"
                  >
                    {currUrlData.originalurl}
                  </Link>
                </div>
              </div>
            )) ||
              null}
          </div>
          {/* total Short url  */}

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex flex-row gap-4 p-2 justify-between">
              <div className="flex flex-row gap-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  Used URL :
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {urlData[0]?.length}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  Available URL :
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {1000 - urlData[0]?.length}
                </p>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              {/* Table Header */}
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400"
                  >
                    Original URL
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400"
                  >
                    Short URL
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400"
                  >
                    Visits
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
                {(urlData[0]?.length > 0 &&
                  urlData[0]?.map((data) => (
                    <tr key={data.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-slate-300">
                        <Link
                          href={data.originalurl}
                          className="hover:text-blue-500"
                        >
                          <div
                            className="max-w-xs truncate"
                            title={data.originalurl}
                          >
                            {data.originalurl}
                          </div>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-slate-300">
                        <Link
                          href={baseUrl + data.shorturl}
                          className="hover:text-blue-500"
                        >
                          <div
                            title={baseUrl + data.shorturl}
                            className="max-w-xs truncate"
                          >
                            {baseUrl + data.shorturl}
                          </div>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {data.visits}
                        </span>
                      </td>
                    </tr>
                  ))) ||
                  null}

                {!urlData[0] ||
                  (urlData[0].length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-12 text-center text-sm text-gray-500 dark:text-slate-400"
                      >
                        No URLs have been shortened yet.
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full pt-4 px-0">
        <Footer />
      </div>
    </div>
  );
}
