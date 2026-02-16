
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { supabase } from "../supabaseClient";

export class GeminiService {
  private static async getApiKey(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Coba ambil key pribadi user
    if (user) {
      const { data } = await supabase
        .from('user_api_keys')
        .select('gemini_api_key')
        .eq('user_id', user.id)
        .single();
      
      if (data?.gemini_api_key) {
        return data.gemini_api_key;
      }
    }

    // 2. Jika tidak ada, ambil Master Key dari system_config (Setelan Admin)
    const { data: config } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'master_gemini_api_key')
      .single();

    if (config?.value) {
      return config.value;
    }

    // 3. Fallback ke environment variable jika semua gagal
    return process.env.API_KEY || '';
  }

  static async generate(prompt: string, modelName?: string, imageData?: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Quota Check
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, credits_remaining, role')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found.");

      // Admin has unlimited access, Pro has unlimited access
      if (profile.role !== 'admin' && profile.subscription_status !== 'pro' && (profile.credits_remaining || 0) <= 0) {
        throw new Error("PAYWALL_TRIGGERED");
      }
    } else {
      const guestTrialUsed = localStorage.getItem('nusai_guest_trial_used');
      if (guestTrialUsed === 'true') {
        throw new Error("AUTH_REQUIRED");
      }
    }

    const apiKey = await this.getApiKey();
    if (!apiKey) throw new Error("API Key not found. Please set a Master Key in Admin Panel or User Settings.");

    const ai = new GoogleGenAI({ apiKey });
    let response: GenerateContentResponse;

    const selectedModel = modelName || 'gemini-3-flash-preview';

    try {
      if (imageData) {
        const imagePart = {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData.split(',')[1] || imageData,
          },
        };
        const textPart = { text: prompt };
        response = await ai.models.generateContent({
          model: selectedModel,
          contents: { parts: [imagePart, textPart] },
        });
      } else if (modelName === 'gemini-2.5-flash-image') {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { aspectRatio: "16:9" } }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return `IMAGE_DATA:data:image/png;base64,${part.inlineData.data}`;
          }
        }
      } else {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents: prompt,
        });
      }

      // Logic potong kredit
      if (!user) {
        localStorage.setItem('nusai_guest_trial_used', 'true');
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, role')
          .eq('id', user.id)
          .single();
          
        if (profile?.role !== 'admin' && profile?.subscription_status !== 'pro') {
          await supabase.rpc('decrement_credits', { user_id: user.id });
        }
      }

      return response.text || "No response generated.";
    } catch (err: any) {
      if (err.message?.includes("401") || err.message?.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API Key. Please check settings.");
      }
      throw err;
    }
  }
}
