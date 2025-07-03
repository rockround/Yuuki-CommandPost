import React from 'react';
import { EyeIcon, ClipboardIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ApiKey } from '../lib/apiKeys';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
  onShow: (id: string) => void;
  onCopy: (key: string, id: string) => void;
  visibleKeyId: string | null;
  copiedKeyId: string | null;
  maskKey: (key: string) => string;
}

export default function ApiKeysTable({ apiKeys, onEdit, onDelete, onShow, onCopy, visibleKeyId, copiedKeyId, maskKey }: ApiKeysTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b border-gray-200 dark:border-gray-700">
            <th className="py-2 text-left font-medium">NAME</th>
            <th className="py-2 text-left font-medium">USAGE</th>
            <th className="py-2 text-left font-medium">KEY</th>
            <th className="py-2 text-left font-medium">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((k) => (
            <tr key={k.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td className="py-2 align-middle font-medium">{k.name}</td>
              <td className="py-2 align-middle">{k.usage}</td>
              <td className="py-2 align-middle">
                <span className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded font-mono tracking-wider">
                  {visibleKeyId === k.id ? k.key : maskKey(k.key)}
                </span>
              </td>
              <td className="py-2 align-middle">
                <div className="flex gap-2">
                  <button
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    title={visibleKeyId === k.id ? 'Hide' : 'Show'}
                    onClick={() => onShow(k.id)}
                  >
                    <EyeIcon className={`w-5 h-5 ${visibleKeyId === k.id ? 'text-blue-500' : 'text-gray-500'}`} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    title={copiedKeyId === k.id ? 'Copied!' : 'Copy'}
                    onClick={() => onCopy(k.key, k.id)}
                  >
                    <ClipboardIcon className={`w-5 h-5 ${copiedKeyId === k.id ? 'text-green-500' : 'text-gray-500'}`} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Edit"
                    onClick={() => onEdit(k)}
                  >
                    <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Delete"
                    onClick={() => onDelete(k.id)}
                  >
                    <TrashIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {apiKeys.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-gray-500 text-center">No API keys found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 