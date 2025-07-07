'use client'

import React, { useState, useEffect } from "react";
import { EyeIcon, ClipboardIcon, PencilSquareIcon, TrashIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { supabase } from "../supabaseClient";
import Notification from "../components/Notification";
import Sidebar from "../components/Sidebar";
import ApiKeyModal from "../components/ApiKeyModal";
import ApiKeysTable from "../components/ApiKeysTable";
import { ApiKey, getApiKeys, createApiKey, updateApiKey, deleteApiKey } from '../lib/apiKeys';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

function maskKey(key: string) {
  return key.slice(0, 5) + "-" + "*".repeat(key.length - 9) + key.slice(-4);
}

function generateApiKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 16; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return 'tvly-' + rand;
}

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch API keys from Supabase on mount
  useEffect(() => {
    setLoading(true);
    getApiKeys()
      .then(setApiKeys)
      .finally(() => setLoading(false));
  }, []);

  // Modal open/close
  const handleOpenModal = (key?: ApiKey) => {
    setEditingKey(key || null);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setEditingKey(null);
    setShowModal(false);
  };

  // Create or update API key
  const handleModalSubmit = async (form: { name: string; key: string; limit: number | undefined; limitEnabled: boolean }) => {
    setModalLoading(true);
    const keyToUse = form.key && form.key.length >= 10 ? form.key : generateApiKey();
    try {
      if (editingKey) {
        const updated = await updateApiKey(editingKey.id, {
          name: form.name,
          key: keyToUse,
          limit: form.limitEnabled ? Number(form.limit) : undefined,
        });
        setApiKeys(apiKeys.map(k => k.id === editingKey.id ? updated : k));
        setToastMessage("API key updated successfully!");
        setToastType("success");
      } else {
        const created = await createApiKey({
          name: form.name,
          key: keyToUse,
          usage: 0,
          limit: form.limitEnabled ? Number(form.limit) : undefined,
        });
        setApiKeys([...apiKeys, created]);
        setToastMessage("API key created successfully!");
        setToastType("success");
      }
    } catch {
      setToastMessage(editingKey ? "Failed to update API key." : "Failed to create API key.");
      setToastType("error");
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
    setModalLoading(false);
    handleCloseModal();
  };

  // Delete API key
  const handleDelete = async (id: string) => {
    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter(k => k.id !== id));
      setToastMessage("API key deleted successfully!");
      setToastType("success");
    } catch {
      setToastMessage("Failed to delete API key.");
      setToastType("error");
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  // Show/hide key
  const handleShow = (id: string) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  // Copy to clipboard
  const handleCopy = async (key: string, id: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(id);
      setToastMessage("API key copied to clipboard!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        setCopiedKeyId(null);
        setShowToast(false);
      }, 1500);
    } catch {}
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center py-10 px-2">
        {/* Gradient Plan Card */}
        <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg mb-8 p-6 relative overflow-hidden" style={{background: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)'}}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full text-white font-semibold tracking-wide">CURRENT PLAN</span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-1">Researcher</h2>
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <span>API Limit</span>
                <span className="relative top-[1px]">•</span>
                <span>24/1,000 Requests</span>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full mt-2">
                <div className="h-2 bg-white/80 rounded-full" style={{width: '2.4%'}}></div>
              </div>
            </div>
            <button className="absolute top-6 right-6 bg-white/30 hover:bg-white/40 text-white font-medium px-4 py-2 rounded-lg border border-white/40 transition-all text-sm shadow">
              Manage Plan
            </button>
          </div>
        </div>
        {/* API Keys Card */}
        <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-lg">API Keys</div>
            <button
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              onClick={() => handleOpenModal()}
            >
              + New
            </button>
          </div>
          <div className="text-gray-500 dark:text-gray-300 text-sm mb-4">
            The key is used to authenticate your requests to the <a href="#" className="underline hover:text-blue-600">Research API</a>. To learn more, see the <a href="#" className="underline hover:text-blue-600">documentation</a> page.
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : (
            <ApiKeysTable
              apiKeys={apiKeys}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onShow={handleShow}
              onCopy={handleCopy}
              visibleKeyId={visibleKeyId}
              copiedKeyId={copiedKeyId}
              maskKey={maskKey}
            />
          )}
        </div>
        <ApiKeyModal
          open={showModal}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          initialData={editingKey || undefined}
          loading={modalLoading}
        />
        <Notification show={showToast} message={toastMessage} type={toastType} />
      </div>
    </div>
  );
}
