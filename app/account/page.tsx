'use client';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Notification from '../components/Notification';

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToastMessage('New passwords do not match.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    setLoading(true);
    const res = await fetch('/api/account/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);
    const data = await res.json();
    if (data.success) {
      setToastMessage('Password updated successfully!');
      setToastType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setToastMessage(data.message || 'Failed to update password.');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <form
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-6 border border-gray-200 dark:border-gray-700"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center">Manage Account</h2>
          <input
            className="border-2 border-gray-200 focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-base transition w-full"
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <input
            className="border-2 border-gray-200 focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-base transition w-full"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <input
            className="border-2 border-gray-200 focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-base transition w-full"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        <Notification show={showToast} message={toastMessage} type={toastType} />
      </div>
    </div>
  );
} 