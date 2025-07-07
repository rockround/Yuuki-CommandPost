'use client';
import Sidebar from '../components/Sidebar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GithubSummarizerPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get('repoUrl');
  const [summary, setSummary] = useState<string | null>(null);
  const [readme, setReadme] = useState<string | null>(null);

  useEffect(() => {
    if (repoUrl) {
      setSummary(sessionStorage.getItem(`summary:${repoUrl}`));
      setReadme(sessionStorage.getItem(`readme:${repoUrl}`));
    }
  }, [repoUrl]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">GitHub Summarizer</h1>
        {repoUrl && (
          <a href={repoUrl} className="text-blue-600 underline mb-4" target="_blank" rel="noopener noreferrer">{repoUrl}</a>
        )}
        {summary ? (
          <pre className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4 max-w-2xl w-full overflow-x-auto whitespace-pre-wrap text-sm border border-gray-200 dark:border-gray-700">
            {summary}
          </pre>
        ) : (
          <div className="text-gray-500 mt-4">No summary available.</div>
        )}
        {readme && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-2">README.md</h2>
            <pre className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full overflow-x-auto whitespace-pre-wrap text-sm border border-gray-200 dark:border-gray-700">
              {readme}
            </pre>
          </>
        )}
        {!repoUrl && <p className="text-gray-500 mt-2">No repository selected.</p>}
      </div>
    </div>
  );
} 