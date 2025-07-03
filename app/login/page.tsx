'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '../components/Notification';
import Sidebar from '../components/Sidebar';

export default function LoginPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use refs to get autofilled values
    const userVal = usernameRef.current?.value || username;
    const passVal = passwordRef.current?.value || password;
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userVal, password: passVal }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = '/admin';
    } else {
      setToastMessage('Login unsuccessful. Please check your credentials.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <form
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-6 border border-gray-200 dark:border-gray-700"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input
            ref={usernameRef}
            className="border-2 border-gray-200 focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-base transition w-full"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            ref={passwordRef}
            className="border-2 border-gray-200 focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-base transition w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Notification show={showToast} message={toastMessage} type={toastType} />
      </div>
    </div>
  );
} 