'use client';
import Sidebar from '../components/Sidebar';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <p className="text-gray-500 mt-2">(To be fleshed out later)</p>
      </div>
    </div>
  );
} 