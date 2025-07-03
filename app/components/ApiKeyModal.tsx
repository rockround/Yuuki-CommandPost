import React, { useState, useEffect } from 'react';
import { ApiKey } from '../lib/apiKeys';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; key: string; limit: number | undefined; limitEnabled: boolean }) => void;
  initialData?: Partial<ApiKey>;
  loading?: boolean;
}

export default function ApiKeyModal({ open, onClose, onSubmit, initialData, loading }: ApiKeyModalProps) {
  const [form, setForm] = useState({
    name: '',
    key: '',
    limit: 1000,
    limitEnabled: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        key: initialData.key || '',
        limit: initialData.limit ?? 1000,
        limitEnabled: !!initialData.limit,
      });
    } else {
      setForm({ name: '', key: '', limit: 1000, limitEnabled: false });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLimitToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, limitEnabled: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl min-w-[350px] max-w-[90vw] flex flex-col gap-6 shadow-2xl border border-gray-200 dark:border-gray-700 items-center"
        onSubmit={handleSubmit}
        style={{ minWidth: 350, maxWidth: 400 }}
      >
        <h2 className="text-xl font-bold text-center mb-1">{initialData ? 'Edit API key' : 'Create a new API key'}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-2">Enter a name and limit for the new API key.</p>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium mb-1">Key Name <span className="text-gray-400">— A unique name to identify this key</span></label>
          <input
            className="border-2 border-gray-200 focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-base transition w-full"
            name="name"
            id="name"
            placeholder="Key Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex items-center gap-2">
          <input
            type="checkbox"
            id="limitEnabled"
            checked={form.limitEnabled}
            onChange={handleLimitToggle}
            className="accent-blue-600 w-4 h-4"
          />
          <label htmlFor="limitEnabled" className="text-sm font-medium select-none">Limit monthly usage*</label>
          <input
            type="number"
            name="limit"
            min={1}
            className="border-2 border-gray-200 rounded-lg px-2 py-1 w-20 text-center ml-2 disabled:bg-gray-100 disabled:text-gray-400"
            value={form.limit}
            onChange={handleChange}
            disabled={!form.limitEnabled}
          />
        </div>
        <div className="w-full text-xs text-gray-500 mt-[-8px] mb-2">
          * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {initialData ? 'Save' : 'Create'}
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 