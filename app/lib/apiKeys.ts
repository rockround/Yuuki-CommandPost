import { supabase } from '../supabaseClient';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit?: number;
}

export async function getApiKeys(): Promise<ApiKey[]> {
  const { data, error } = await supabase.from('api_keys').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createApiKey(newKey: Omit<ApiKey, 'id'>): Promise<ApiKey> {
  const { data, error } = await supabase.from('api_keys').insert([newKey]).select();
  if (error) throw error;
  return data![0];
}

export async function updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey> {
  const { data, error } = await supabase.from('api_keys').update(updates).eq('id', id).select();
  if (error) throw error;
  return data![0];
}

export async function deleteApiKey(id: string): Promise<void> {
  const { error } = await supabase.from('api_keys').delete().eq('id', id);
  if (error) throw error;
} 