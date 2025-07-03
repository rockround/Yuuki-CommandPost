'use client';
import React from "react";
import { HomeIcon, KeyIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Dashboard', href: '/dashboards', icon: KeyIcon },
  { name: 'Login', href: '/login', icon: LockClosedIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, loading, logout } = useAuth();

  return (
    <aside className="h-full min-h-screen w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-8 px-4">
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">...</div>
      ) : (
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => {
            if (tab.name === 'Login' && isAuthenticated) return null;
            const active = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <a
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </a>
            );
          })}
          {isAuthenticated && (
            <a
              href="/account"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/account' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <UserCircleIcon className="w-5 h-5" />
              Manage Account
            </a>
          )}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900 mt-2"
            >
              <LockClosedIcon className="w-5 h-5" />
              Log out
            </button>
          )}
        </nav>
      )}
    </aside>
  );
} 