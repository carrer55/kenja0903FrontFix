import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cnllmppvdsmxhbfbrspn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNubGxtcHB2ZHNteGhiZmJyc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjQwNjMsImV4cCI6MjA3MjQ0MDA2M30.fyy4bpuDZ1YSwc7v3ZDxltDEdOwvYytE7sCvDdA79so';

// Supabaseクライアントの設定を改善
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // JWTの自動更新を有効化
    autoRefreshToken: true,
    // セッションの永続化を有効化
    persistSession: true,
    // セッションの検出を有効化
    detectSessionInUrl: true,
    // ストレージの設定
    storage: {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn('Error getting item from localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('Error setting item in localStorage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('Error removing item from localStorage:', error);
        }
      }
    },
    // フロー設定
    flowType: 'pkce'
  },
  // グローバル設定
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  // リアルタイム設定
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          company_name: string;
          position: string;
          phone_number: string;
          email: string;
          role: 'admin' | 'department_admin' | 'approver' | 'general_user';
          plan: 'Free' | 'Pro' | 'Enterprise';
          department_id: string | null;
          invited_by: string | null;
          last_login_at: string | null;
          status: 'active' | 'invited' | 'inactive';
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          company_name: string;
          position: string;
          phone_number: string;
          email: string;
          role?: 'admin' | 'department_admin' | 'approver' | 'general_user';
          plan?: 'Free' | 'Pro' | 'Enterprise';
          department_id?: string | null;
          invited_by?: string | null;
          last_login_at?: string | null;
          status?: 'active' | 'invited' | 'inactive';
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          company_name?: string;
          position?: string;
          phone_number?: string;
          email?: string;
          role?: 'admin' | 'department_admin' | 'approver' | 'general_user';
          plan?: 'Free' | 'Pro' | 'Enterprise';
          department_id?: string | null;
          invited_by?: string | null;
          last_login_at?: string | null;
          status?: 'active' | 'invited' | 'inactive';
        };
      };
      companies: {
        Row: {
          id: string;
          created_at: string;
          company_name: string;
          address: string | null;
          representative: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          company_name: string;
          address?: string | null;
          representative?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          company_name?: string;
          address?: string | null;
          representative?: string | null;
        };
      };
      departments: {
        Row: {
          id: string;
          created_at: string;
          department_name: string;
          company_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          department_name: string;
          company_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          department_name?: string;
          company_id?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          applicant_id: string;
          department_id: string;
          title: string;
          type: 'business_trip_request' | 'expense_request' | 'business_report' | 'expense_report';
          status: 'draft' | 'pending' | 'approved' | 'rejected' | 'returned' | 'on_hold' | 'completed';
          total_amount: number | null;
          current_approver_id: string | null;
          submitted_at: string | null;
          approved_at: string | null;
          rejection_reason: string | null;
          priority: 'high' | 'medium' | 'low';
          days_waiting: number | null;
          metadata: any | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          applicant_id: string;
          department_id: string;
          title: string;
          type: 'business_trip_request' | 'expense_request' | 'business_report' | 'expense_report';
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'returned' | 'on_hold' | 'completed';
          total_amount?: number | null;
          current_approver_id?: string | null;
          submitted_at?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          priority?: 'high' | 'medium' | 'low';
          days_waiting?: number | null;
          metadata?: any | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          applicant_id?: string;
          department_id?: string;
          title?: string;
          type?: 'business_trip_request' | 'expense_request' | 'business_report' | 'expense_report';
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'returned' | 'on_hold' | 'completed';
          total_amount?: number | null;
          current_approver_id?: string | null;
          submitted_at?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          priority?: 'high' | 'medium' | 'low';
          days_waiting?: number | null;
          metadata?: any | null;
        };
      };
    };
  };
}

// ユーザープロフィールの型定義（フロントエンド用）
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  position: string;
  phone_number: string;
  role: 'admin' | 'department_admin' | 'approver' | 'general_user';
  plan: 'Free' | 'Pro' | 'Enterprise';
  department_id: string | null;
  department_name?: string;
  invited_by: string | null;
  last_login_at: string | null;
  status: 'active' | 'invited' | 'inactive';
  created_at: string;
  updated_at: string;
}

// 統一されたプロフィールフォームデータ型定義
export interface ProfileFormData {
  email: string;
  password?: string;
  confirmPassword?: string;
  full_name: string;
  company_name: string;
  position: string;
  phone_number: string;
  department_name: string; // 部署名（新規登録時に選択）
  role?: 'admin' | 'department_admin' | 'approver' | 'general_user';
  plan?: 'Free' | 'Pro' | 'Enterprise';
  department_id?: string | null;
  invited_by?: string | null;
}

// 手当設定の型定義
export interface AllowanceSettings {
  domestic: {
    daily_allowance: number;
    accommodation: number;
    transportation: number;
    accommodation_disabled: boolean;
    transportation_disabled: boolean;
  };
  overseas: {
    daily_allowance: number;
    accommodation: number;
    transportation: number;
    preparation_fee: number;
    accommodation_disabled: boolean;
    transportation_disabled: boolean;
    preparation_fee_disabled: boolean;
  };
}

// 通知設定の型定義
export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  reminder_time: string;
  approval_only: boolean;
}

// 認証状態の型定義
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// JWT検証ユーティリティ
export class JWTUtils {
  /**
   * Base64URLデコード（atobの代替）
   */
  private static base64UrlDecode(str: string): string {
    // Base64URLをBase64に変換
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // パディングを追加
    while (base64.length % 4) {
      base64 += '=';
    }
    
    try {
      // ブラウザ環境ではatobを使用
      if (typeof window !== 'undefined' && window.atob) {
        return window.atob(base64);
      }
      // Node.js環境ではBufferを使用
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(base64, 'base64').toString('utf-8');
      }
      // フォールバック: 手動デコード
      return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
      console.error('Base64 decode error:', error);
      throw new Error('Invalid base64 string');
    }
  }

  /**
   * JWTトークンが有効かどうかをチェック
   */
  static isTokenValid(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') {
        return false;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      
      const payload = JSON.parse(this.base64UrlDecode(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * JWTトークンからペイロードを取得
   */
  static getTokenPayload(token: string): any {
    try {
      if (!token || typeof token !== 'string') {
        return null;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      return JSON.parse(this.base64UrlDecode(parts[1]));
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }

  /**
   * JWTトークンの有効期限を取得
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const payload = this.getTokenPayload(token);
      return payload ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * JWTトークンが期限切れまで何秒残っているかを取得
   */
  static getTokenTimeRemaining(token: string): number {
    try {
      const payload = this.getTokenPayload(token);
      if (!payload) return 0;
      
      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - now);
    } catch (error) {
      console.error('Error getting token time remaining:', error);
      return 0;
    }
  }
}

// セキュリティユーティリティ
export class SecurityUtils {
  /**
   * セッションの有効性をチェック
   */
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        return false;
      }

      if (!session) {
        return false;
      }

      // JWTの有効性をチェック
      if (session.access_token && !JWTUtils.isTokenValid(session.access_token)) {
        console.log('Access token expired, refreshing...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        return !refreshError;
      }

      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  /**
   * セキュアなAPI呼び出しのためのヘッダーを取得
   */
  static async getSecureHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Client-Info': 'supabase-js-web'
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  }
}
