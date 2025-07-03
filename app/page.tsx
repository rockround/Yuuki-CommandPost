import Image from "next/image";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
            <h1 className="text-3xl font-bold mt-4 mb-2 text-center">Welcome to the API Key Manager</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl">
              Manage your API keys securely and efficiently. Use the dashboard to create, edit, and delete your API keys.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
              className="rounded border border-solid border-blue-500 transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-base h-12 px-5 w-full sm:w-auto"
              href="/dashboards"
            >
              Go to API Key Dashboard
            </a>
            <a
              className="rounded border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-base h-12 px-5 w-full sm:w-auto"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
