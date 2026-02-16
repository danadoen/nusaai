
export type ModuleType = 'creative' | 'professional' | 'career' | 'health' | 'automation' | 'dashboard' | 'settings' | 'pricing' | 'about' | 'changelog' | 'privacy' | 'terms' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  email?: string;
  role: 'user' | 'admin';
  language_preference: 'en' | 'id';
  subscription_status: 'free' | 'pro';
  credits_remaining: number;
  stripe_customer_id?: string;
  created_at: string;
}

export interface AIHistoryItem {
  id: string;
  user_id: string;
  module_type: string;
  input_data: any;
  output_data: any;
  created_at: string;
}

export interface UserApiKey {
  user_id: string;
  gemini_api_key: string;
  updated_at: string;
}

export interface Translation {
  [key: string]: {
    en: string;
    id: string;
  };
}
