import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, type UserProfile, type ProfileFormData, JWTUtils, SecurityUtils } from '../lib/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';

interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: ProfileFormData) => Promise<{ success: boolean; error?: string; retryAfter?: number; emailConfirmationRequired?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetAuthState: () => void;
  refreshSession: () => Promise<void>;
  getAccessToken: () => string | null;
  userRole: 'admin' | 'department_admin' | 'approver' | 'general_user';
  userPlan: 'Free' | 'Pro' | 'Enterprise';
  isOnboardingComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: {
      id: 'admin-bypass-001',
      email: 'admin@kenjano-seisan.com',
      full_name: '管理者 太郎',
      company_name: '株式会社賢者の精算',
      position: '代表取締役',
      phone_number: '03-1234-5678',
      role: 'admin',
      plan: 'Enterprise',
      department_id: 'dept-admin-001',
      department_name: '経営企画部',
      invited_by: null,
      last_login_at: new Date().toISOString(),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    session: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer',
      user: {
        id: 'admin-bypass-001',
        email: 'admin@kenjano-seisan.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      }
    } as any,
    isAuthenticated: true,
    loading: false,
    error: undefined
  });

  useEffect(() => {
    // 認証バイパス時は初期化処理をスキップ
    console.log('Auth bypass enabled - skipping initialization');
    return;
    
    // メール確認URLの処理
    const handleEmailConfirmation = async (): Promise<boolean> => {
      console.log(`🚀 [handleEmailConfirmation] Starting email confirmation process...`);
      console.log(`🌐 [handleEmailConfirmation] Current URL:`, window.location.href);
      
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      const token = urlParams.get('token');
      const hash = urlParams.get('hash');
      const code = urlParams.get('code');
      
      console.log('🔍 [handleEmailConfirmation] Checking for email confirmation URL params:', { 
        type, 
        token: token ? `${token.substring(0, 10)}...` : null, 
        hash: hash ? `${hash.substring(0, 10)}...` : null,
        code: code ? `${code.substring(0, 10)}...` : null,
        fullUrl: window.location.href,
        allParams: Object.fromEntries(urlParams.entries())
      });
      
      // codeパラメータがある場合、またはtype=signupでtoken/hashがある場合に処理
      if (code || (type === 'signup' && (token || hash))) {
        try {
          // 全体の処理にタイムアウトを設定
          const overallTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Overall email confirmation timeout after 30 seconds')), 30000);
          });
          
          const emailConfirmationPromise = (async () => {
          console.log('📧 [handleEmailConfirmation] Processing email confirmation...', { 
            type, 
            token: !!token, 
            hash: !!hash, 
            code: !!code 
          });
          
          // 使用するトークンを決定（code > token > hash の優先順位）
          const tokenToUse = code || token || hash;
          console.log('🔑 [handleEmailConfirmation] Using token for verification:', {
            hasCode: !!code,
            hasToken: !!token,
            hasHash: !!hash,
            tokenLength: tokenToUse?.length,
            tokenStart: tokenToUse?.substring(0, 20),
            tokenType: code ? 'code' : token ? 'token' : 'hash'
          });
          
          // Step 1: 認証コードをセッションに交換
          console.log('🔄 [handleEmailConfirmation] Step 1: Exchanging code for session...');
          console.log(`🔑 [handleEmailConfirmation] Token details:`, {
            tokenLength: tokenToUse?.length,
            tokenStart: tokenToUse?.substring(0, 20),
            tokenEnd: tokenToUse?.substring(-20)
          });
          
          let data, error;
          
          if (code) {
            // codeパラメータの場合はexchangeCodeForSessionを使用（タイムアウト付き）
            try {
              console.log(`🔄 [handleEmailConfirmation] Attempting exchangeCodeForSession with code...`);
              
              // 10秒のタイムアウトを設定
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('exchangeCodeForSession timeout after 10 seconds')), 10000);
              });
              
              const exchangePromise = supabase.auth.exchangeCodeForSession(tokenToUse);
              
              const result = await Promise.race([exchangePromise, timeoutPromise]);
              data = result.data;
              error = result.error;
              
              console.log('✅ [handleEmailConfirmation] exchangeCodeForSession result:', { 
                hasData: !!data, 
                hasUser: !!data?.user, 
                hasSession: !!data?.session,
                userId: data?.user?.id,
                userEmail: data?.user?.email,
                sessionAccessToken: data?.session?.access_token ? `${data.session.access_token.substring(0, 20)}...` : null,
                sessionRefreshToken: data?.session?.refresh_token ? `${data.session.refresh_token.substring(0, 20)}...` : null,
                sessionExpiresAt: data?.session?.expires_at,
                userCreatedAt: data?.user?.created_at,
                userConfirmedAt: data?.user?.email_confirmed_at,
                error: error ? {
                  message: error.message,
                  status: error.status,
                  name: error.name,
                  code: error.code
                } : null
              });
              
              if (error) {
                console.error('❌ [handleEmailConfirmation] exchangeCodeForSession returned error:', error);
              } else {
                console.log('✅ [handleEmailConfirmation] exchangeCodeForSession completed successfully');
              }
              
            } catch (exchangeError) {
              console.error('❌ [handleEmailConfirmation] exchangeCodeForSession failed:', exchangeError);
              console.log(`🔄 [handleEmailConfirmation] Exchange error details:`, {
                name: exchangeError?.name,
                message: exchangeError?.message,
                stack: exchangeError?.stack
              });
              
              // タイムアウトエラーの場合は特別な処理
              if (exchangeError?.message?.includes('timeout')) {
                console.error('⏰ [handleEmailConfirmation] exchangeCodeForSession timed out, trying fallback...');
                // フォールバックとしてverifyOtpを試行
                try {
                  const fallbackResult = await supabase.auth.verifyOtp({
                    token_hash: tokenToUse,
                    type: 'signup'
                  });
                  data = fallbackResult.data;
                  error = fallbackResult.error;
                  console.log('🔄 [handleEmailConfirmation] Fallback verifyOtp result:', { 
                    hasData: !!data, 
                    hasUser: !!data?.user, 
                    hasSession: !!data?.session,
                    userId: data?.user?.id,
                    userEmail: data?.user?.email,
                    error: error ? {
                      message: error.message,
                      status: error.status,
                      name: error.name,
                      code: error.code
                    } : null
                  });
                } catch (fallbackError) {
                  console.error('❌ [handleEmailConfirmation] Fallback verifyOtp also failed:', fallbackError);
                  error = fallbackError;
                }
              } else {
                error = exchangeError;
              }
            }
          } else {
            // token/hashパラメータの場合はverifyOtpを使用（タイムアウト付き）
            try {
              console.log(`🔄 [handleEmailConfirmation] Attempting verifyOtp with token/hash...`);
              
              // 10秒のタイムアウトを設定
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('verifyOtp timeout after 10 seconds')), 10000);
              });
              
              const verifyPromise = supabase.auth.verifyOtp({
                token_hash: tokenToUse,
                type: 'signup'
              });
              
              const result = await Promise.race([verifyPromise, timeoutPromise]);
              data = result.data;
              error = result.error;
              
              console.log('✅ [handleEmailConfirmation] verifyOtp result:', { 
                hasData: !!data, 
                hasUser: !!data?.user, 
                hasSession: !!data?.session,
                userId: data?.user?.id,
                userEmail: data?.user?.email,
                sessionAccessToken: data?.session?.access_token ? `${data.session.access_token.substring(0, 20)}...` : null,
                sessionRefreshToken: data?.session?.refresh_token ? `${data.session.refresh_token.substring(0, 20)}...` : null,
                sessionExpiresAt: data?.session?.expires_at,
                userCreatedAt: data?.user?.created_at,
                userConfirmedAt: data?.user?.email_confirmed_at,
                error: error ? {
                  message: error.message,
                  status: error.status,
                  name: error.name,
                  code: error.code
                } : null
              });
              
              if (error) {
                console.error('❌ [handleEmailConfirmation] verifyOtp returned error:', error);
              } else {
                console.log('✅ [handleEmailConfirmation] verifyOtp completed successfully');
              }
              
            } catch (verifyError) {
              console.error('❌ [handleEmailConfirmation] verifyOtp failed:', verifyError);
              console.log(`🔄 [handleEmailConfirmation] Verify error details:`, {
                name: verifyError?.name,
                message: verifyError?.message,
                stack: verifyError?.stack
              });
              
              // タイムアウトエラーの場合は特別な処理
              if (verifyError?.message?.includes('timeout')) {
                console.error('⏰ [handleEmailConfirmation] verifyOtp timed out');
              }
              
              error = verifyError;
            }
          }
          
          if (error) {
            console.error('❌ [handleEmailConfirmation] Email confirmation error:', error);
            console.error('🔍 [handleEmailConfirmation] Error details:', {
              message: error.message,
              status: error.status,
              name: error.name,
              code: error.code
            });
            console.log('🔄 [handleEmailConfirmation] Redirecting to login page with error...');
            
            // URLパラメータをクリアして無限ループを防ぐ
            console.log('🧹 [handleEmailConfirmation] Clearing URL parameters to prevent infinite loop...');
            const newUrl = new URL(window.location.href);
            newUrl.search = '?view=login&error=email_confirmation_failed';
            
            setTimeout(() => {
              window.location.href = newUrl.toString();
            }, 100);
            
            return true; // メール確認処理は実行された
          }
          
          if (data?.user) {
            console.log('✅ [handleEmailConfirmation] Email confirmation successful, user:', data.user.id);
            console.log('📋 [handleEmailConfirmation] User details:', {
              id: data.user.id,
              email: data.user.email,
              created_at: data.user.created_at,
              user_metadata: data.user.user_metadata
            });
            
            // Step 2: セッションを設定
            if (data.session) {
              console.log('🔐 [handleEmailConfirmation] Step 2: Setting session...');
              console.log('📋 [handleEmailConfirmation] Session details:', {
                accessToken: data.session.access_token ? `${data.session.access_token.substring(0, 20)}...` : null,
                refreshToken: data.session.refresh_token ? `${data.session.refresh_token.substring(0, 20)}...` : null,
                expiresAt: data.session.expires_at,
                tokenType: data.session.token_type,
                user: data.session.user ? {
                  id: data.session.user.id,
                  email: data.session.user.email,
                  emailConfirmed: data.session.user.email_confirmed_at
                } : null
              });
              
              setAuthState(prev => ({
                ...prev,
                session: data.session,
                isAuthenticated: true
              }));
              console.log('✅ [handleEmailConfirmation] Session set successfully');
            } else {
              console.warn('⚠️ [handleEmailConfirmation] No session data available');
            }
            
            // Step 3: プロフィール作成処理（タイムアウト付き）
            console.log('👤 [handleEmailConfirmation] Step 3: Creating user profile...');
            try {
              // プロフィール処理全体にタイムアウトを設定
              const profileTimeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile processing timeout after 10 seconds')), 10000);
              });
              
              const profileProcessingPromise = (async () => {
                // 既存のプロフィールをチェック
                console.log('🔍 [handleEmailConfirmation] Checking for existing profile...');
                const { data: existingProfile, error: profileCheckError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', data.user.id)
                  .single();
                
                console.log('🔍 [handleEmailConfirmation] Profile check result:', {
                  hasExistingProfile: !!existingProfile,
                  profileCheckError: profileCheckError?.message,
                  profileCheckErrorCode: profileCheckError?.code
                });
                
                if (existingProfile) {
                  console.log('✅ [handleEmailConfirmation] Profile already exists, loading user profile...');
                  await loadUserProfile(data.user.id);
                } else {
                  console.log('🆕 [handleEmailConfirmation] Creating new profile...');
                  
                  // ユーザーメタデータからプロフィール情報を取得
                  const userMetadata = data.user.user_metadata || {};
                  console.log('📋 [handleEmailConfirmation] User metadata:', userMetadata);
                  
                  const profileData = {
                    id: data.user.id,
                    email: data.user.email || '',
                    full_name: userMetadata.full_name || '',
                    company_name: userMetadata.company_name || '',
                    position: userMetadata.position || '',
                    phone_number: userMetadata.phone_number || '',
                    role: 'general_user' as const,
                    plan: 'Free' as const,
                    status: 'active' as const
                  };
                  
                  console.log('📝 [handleEmailConfirmation] Profile data to insert:', profileData);
                  
                  const { data: newProfile, error: profileError } = await supabase
                    .from('profiles')
                    .insert(profileData)
                    .select()
                    .single();
                  
                  if (profileError) {
                    console.error('❌ [handleEmailConfirmation] Profile creation error:', profileError);
                    console.error('🔍 [handleEmailConfirmation] Profile error details:', {
                      code: profileError.code,
                      message: profileError.message,
                      details: profileError.details,
                      hint: profileError.hint
                    });
                    // プロフィール作成に失敗してもメール認証は成功しているので続行
                  } else {
                    console.log('✅ [handleEmailConfirmation] Profile created successfully:', newProfile);
                  }
                }
                
                // Step 4: ユーザープロフィールをロード
                console.log('🔄 [handleEmailConfirmation] Step 4: Loading user profile...');
                await loadUserProfile(data.user.id);
              })();
              
              await Promise.race([profileProcessingPromise, profileTimeoutPromise]);
              console.log('✅ [handleEmailConfirmation] Profile processing completed successfully');
              
            } catch (profileError) {
              console.error('❌ [handleEmailConfirmation] Error in profile creation/loading:', profileError);
              console.error('🔍 [handleEmailConfirmation] Profile error details:', {
                name: profileError?.name,
                message: profileError?.message,
                stack: profileError?.stack
              });
              
              if (profileError?.message?.includes('timeout')) {
                console.error('⏰ [handleEmailConfirmation] Profile processing timed out');
              }
              
              // プロフィール処理に失敗してもメール認証は成功しているので続行
            }
            
            // Step 5: 本登録完了画面にリダイレクト
            console.log('🎉 [handleEmailConfirmation] Step 5: Redirecting to registration complete page...');
            
            // URLパラメータをクリアして無限ループを防ぐ
            console.log('🧹 [handleEmailConfirmation] Clearing URL parameters to prevent infinite loop...');
            const newUrl = new URL(window.location.href);
            newUrl.search = '?view=registration-complete';
            
            // 本登録完了画面を表示
            setTimeout(() => {
              window.location.href = newUrl.toString();
            }, 100);
            
            return true; // メール確認処理は実行された
          } else {
            console.error('❌ [handleEmailConfirmation] No user data returned from email confirmation');
            console.error('🔍 [handleEmailConfirmation] Data object:', data);
            
            // URLパラメータをクリアして無限ループを防ぐ
            console.log('🧹 [handleEmailConfirmation] Clearing URL parameters to prevent infinite loop...');
            const newUrl = new URL(window.location.href);
            newUrl.search = '?view=login&error=email_confirmation_failed';
            
            setTimeout(() => {
              window.location.href = newUrl.toString();
            }, 100);
            return true; // メール確認処理は実行された
          }
          })();
          
          // 全体の処理をタイムアウト付きで実行
          await Promise.race([emailConfirmationPromise, overallTimeoutPromise]);
          console.log('✅ [handleEmailConfirmation] Overall email confirmation completed successfully');
          
        } catch (error) {
          console.error('❌ [handleEmailConfirmation] Email confirmation exception:', error);
          console.error('🔍 [handleEmailConfirmation] Exception details:', {
            name: error?.name,
            message: error?.message,
            stack: error?.stack
          });
          
          if (error?.message?.includes('timeout')) {
            console.error('⏰ [handleEmailConfirmation] Overall email confirmation timed out');
          }
          
          // URLパラメータをクリアして無限ループを防ぐ
          console.log('🧹 [handleEmailConfirmation] Clearing URL parameters to prevent infinite loop...');
          const newUrl = new URL(window.location.href);
          newUrl.search = '?view=login&error=email_confirmation_failed';
          
          setTimeout(() => {
            window.location.href = newUrl.toString();
          }, 100);
          return true; // メール確認処理は実行された
        }
      }
      
      console.log('ℹ️ [handleEmailConfirmation] No email confirmation parameters found, skipping...');
      return false; // メール確認処理は実行されなかった
    };

    // 初回セッション取得
    const initializeAuth = async () => {
      console.log('🚀 [initializeAuth] Starting auth initialization...');
      
      // メール確認URLの処理を最初に実行
      console.log('📧 [initializeAuth] Checking for email confirmation...');
      const emailConfirmationProcessed = await handleEmailConfirmation();
      
      // メール確認処理が実行された場合は、その後の処理をスキップ
      if (emailConfirmationProcessed) {
        console.log('✅ [initializeAuth] Email confirmation processed, skipping normal auth initialization');
        return;
      }
      
      console.log('🔄 [initializeAuth] Proceeding with normal auth initialization...');
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthState({ 
            user: null, 
            session: null,
            isAuthenticated: false, 
            loading: false,
            error: error.message
          });
          return;
        }

        if (session?.user) {
          // JWTの有効性を確認
          if (session.access_token && !JWTUtils.isTokenValid(session.access_token)) {
            console.log('Access token expired, refreshing...');
            await refreshSession();
            return;
          }
          await loadUserProfile(session.user, session);
        } else {
          setAuthState({ 
            user: null, 
            session: null,
            isAuthenticated: false, 
            loading: false 
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({ user: null, isAuthenticated: false, loading: false });
      }
    };

    initializeAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        // JWTの有効性を確認
        if (session.access_token && !JWTUtils.isTokenValid(session.access_token)) {
          console.log('Access token expired during auth state change, refreshing...');
          await refreshSession();
          return;
        }
        await loadUserProfile(session.user, session);
      } else {
        setAuthState({ 
          user: null, 
          session: null,
          isAuthenticated: false, 
          loading: false 
        });
      }
    });

    // 定期的なセッション検証（5分ごと）
    const sessionValidationInterval = setInterval(async () => {
      if (authState.isAuthenticated && authState.session) {
        const isValid = await SecurityUtils.validateSession();
        if (!isValid) {
          console.log('Session validation failed, logging out...');
          await logout();
        }
      }
    }, 5 * 60 * 1000); // 5分

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionValidationInterval);
    };
  }, [authState.isAuthenticated, authState.session]);

  const loadUserProfile = async (user: User, session?: Session, retryCount: number = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1秒

    try {
      console.log(`🔄 [loadUserProfile] Starting profile load for user ${user.id} (attempt ${retryCount + 1})`);
      console.log(`📋 [loadUserProfile] User details:`, {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_metadata: user.user_metadata
      });
      
      // プロフィール情報を取得（タイムアウト付き）
      console.log(`🔍 [loadUserProfile] Executing Supabase query for profiles table...`);
      
      // 5秒のタイムアウトを設定
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile query timeout after 5 seconds')), 5000);
      });
      
      const profileQueryPromise = supabase
        .from('profiles')
        .select(`
          *,
          departments (
            id,
            name
          )
        `)
        .eq('id', user.id)
        .single();
      
      const { data: profile, error } = await Promise.race([profileQueryPromise, timeoutPromise]);
      
      console.log(`📊 [loadUserProfile] Supabase query response:`, {
        hasData: !!profile,
        hasError: !!error,
        dataKeys: profile ? Object.keys(profile) : null,
        errorDetails: error ? {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          status: error.status
        } : null
      });

      if (error) {
        console.error(`❌ [loadUserProfile] Error loading profile:`, error);
        console.error(`🔍 [loadUserProfile] Profile error details:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          status: error.status
        });
        
        // タイムアウトエラーの場合は特別な処理
        if (error.message?.includes('timeout')) {
          console.error('⏰ [loadUserProfile] Profile query timed out');
          
          // タイムアウトの場合は新規プロフィール作成を試行
          try {
            console.log('🆕 [loadUserProfile] Attempting to create profile due to timeout...');
            const createResult = await createUserProfile(user);
            if (createResult) {
              console.log('✅ [loadUserProfile] Profile created successfully after timeout');
              return;
            }
          } catch (createError) {
            console.error('❌ [loadUserProfile] Profile creation failed after timeout:', createError);
          }
        }

        // プロフィールが存在しない場合は作成
        if (error.code === 'PGRST116') {
          console.log(`🆕 [loadUserProfile] Profile not found (PGRST116), creating new profile...`);
          const createResult = await createUserProfile(user);
          console.log(`📝 [loadUserProfile] Profile creation result:`, createResult);
          
          if (createResult) {
            // プロフィール作成成功後、再試行
            if (retryCount < MAX_RETRIES) {
              console.log(`🔄 [loadUserProfile] Retrying profile load after creation (attempt ${retryCount + 2})`);
              setTimeout(() => {
                loadUserProfile(user, retryCount + 1);
              }, RETRY_DELAY);
              return;
            } else {
              console.error(`❌ [loadUserProfile] Max retries reached for profile loading`);
              setAuthState({ 
                user: null, 
                session: null,
                isAuthenticated: false, 
                loading: false,
                error: 'プロフィールの読み込みに失敗しました'
              });
              return;
            }
          } else {
            console.error(`❌ [loadUserProfile] Profile creation failed`);
            setAuthState({ 
              user: null, 
              session: null,
              isAuthenticated: false, 
              loading: false,
              error: 'プロフィールの作成に失敗しました'
            });
            return;
          }
        }

        // その他のエラーの場合
        if (retryCount < MAX_RETRIES) {
          console.log(`🔄 [loadUserProfile] Retrying profile load due to error (attempt ${retryCount + 2})`);
          setTimeout(() => {
            loadUserProfile(user, retryCount + 1);
          }, RETRY_DELAY);
          return;
        } else {
          console.error(`❌ [loadUserProfile] Max retries reached for profile loading`);
          const errorMessage = getProfileErrorMessage(error);
          console.error(`💥 [loadUserProfile] Final error message:`, errorMessage);
          setAuthState({ 
            user: null, 
            isAuthenticated: false, 
            loading: false,
            error: errorMessage
          });
          return;
        }
      }

      console.log(`✅ [loadUserProfile] Profile loaded successfully:`, {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        company_name: profile.company_name,
        position: profile.position,
        role: profile.role,
        plan: profile.plan,
        status: profile.status,
        phone_number: profile.phone_number,
        department_name: profile.departments?.name || null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        last_login_at: profile.last_login_at,
        hasDepartments: !!profile.departments,
        hasDepartmentManagement: !!profile.department_management
      });

      // 最終ログイン時刻を更新（エラーが発生しても続行）
      console.log(`🕐 [loadUserProfile] Updating last login time...`);
      try {
        await supabase
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', user.id);
        console.log(`✅ [loadUserProfile] Last login time updated successfully`);
      } catch (updateError) {
        console.warn(`⚠️ [loadUserProfile] Failed to update last login time:`, updateError);
        // ログイン時刻の更新失敗は致命的ではない
      }

      // 古いカラム名と新しいカラム名の両方を考慮してマッピング
      console.log(`🔄 [loadUserProfile] Mapping profile data to UserProfile interface...`);
      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email || '',
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        position: profile.position || '',
        phone_number: profile.phone_number || '',
        role: profile.role || 'general_user',
        plan: profile.plan || 'Free',
        department_id: profile.department_id,
        department_name: profile.departments?.name || null,
        invited_by: profile.invited_by,
        last_login_at: profile.last_login_at,
        status: profile.status || 'active',
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };

      console.log(`📋 [loadUserProfile] Mapped UserProfile:`, userProfile);
      console.log(`🔐 [loadUserProfile] Setting auth state with user profile...`);

      setAuthState({ 
        user: userProfile, 
        session: session || null,
        isAuthenticated: true, 
        loading: false 
      });
      
      console.log(`✅ [loadUserProfile] Auth state updated successfully`);
    } catch (error) {
      console.error(`💥 [loadUserProfile] Exception in loadUserProfile:`, error);
      console.error(`🔍 [loadUserProfile] Exception details:`, {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      if (retryCount < MAX_RETRIES) {
        console.log(`🔄 [loadUserProfile] Retrying profile load due to exception (attempt ${retryCount + 2})`);
        setTimeout(() => {
          loadUserProfile(user, retryCount + 1);
        }, RETRY_DELAY);
        return;
      } else {
        console.error(`❌ [loadUserProfile] Max retries reached for profile loading due to exception`);
        setAuthState({ 
          user: null, 
          session: null,
          isAuthenticated: false, 
          loading: false,
          error: 'プロフィールの読み込みに失敗しました'
        });
      }
    }
  };

  // プロフィールエラーメッセージを取得するヘルパー関数
  const getProfileErrorMessage = (error: any): string => {
    if (!error) return 'プロフィールの読み込みに失敗しました。';
    
    switch (error.code) {
      case 'PGRST116':
        return 'プロフィールが見つかりません。管理者にお問い合わせください。';
      case 'PGRST301':
        return 'データベース接続エラーが発生しました。しばらく時間をおいてから再度お試しください。';
      case '42501':
        return 'アクセス権限がありません。管理者にお問い合わせください。';
      case '42P01':
        return 'データベーステーブルが見つかりません。管理者にお問い合わせください。';
      default:
        if (error.message?.includes('network') || error.message?.includes('fetch')) {
          return 'ネットワーク接続エラーが発生しました。インターネット接続を確認してください。';
        }
        return `プロフィールの読み込みに失敗しました: ${error.message || '不明なエラー'}`;
    }
  };

  const createUserProfile = async (user: User): Promise<boolean> => {
    try {
      console.log('🆕 [createUserProfile] Creating user profile for:', user.id);
      console.log('📋 [createUserProfile] User details:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_metadata: user.user_metadata
      });
      
      // プロフィール作成全体にタイムアウトを設定
      const createTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile creation timeout after 10 seconds')), 10000);
      });
      
      const createProfilePromise = (async () => {
      
      // ユーザーメタデータから情報を取得
      const userMetadata = user.user_metadata || {};
      const fullName = userMetadata.full_name || user.email?.split('@')[0] || 'ユーザー';
      const companyName = userMetadata.company_name || '株式会社デモ';
      const position = userMetadata.position || '一般社員';
      const phoneNumber = userMetadata.phone_number || '090-0000-0000';
      const departmentName = userMetadata.department_name;
      
      // デフォルトの会社と部署を作成または取得
      let companyId: string | null = null;
      let departmentId: string | null = null;

      try {
        // 会社を取得または作成
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('company_name', companyName)
          .single();

        if (companyError && companyError.code === 'PGRST116') {
          console.log('Company not found, creating new company...');
          const { data: newCompany, error: createCompanyError } = await supabase
            .from('companies')
            .insert({
              company_name: companyName,
              address: '東京都渋谷区',
              representative: '代表取締役 デモ太郎'
            })
            .select('id')
            .single();

          if (createCompanyError) {
            console.error('Error creating company:', createCompanyError);
            throw new Error(`Failed to create company: ${createCompanyError.message}`);
          }
          companyId = newCompany.id;
          console.log('Company created with ID:', companyId);
        } else if (companyError) {
          console.error('Error fetching company:', companyError);
          throw new Error(`Failed to fetch company: ${companyError.message}`);
        } else {
          companyId = company.id;
          console.log('Company found with ID:', companyId);
        }

        // 部署を取得または作成
        if (departmentName) {
          // まずdepartment_managementテーブルを確認
          const { data: enterpriseDept, error: enterpriseError } = await supabase
            .from('department_management')
            .select('id')
            .eq('department_name', departmentName)
            .eq('is_active', true)
            .single();
          
          if (!enterpriseError && enterpriseDept) {
            departmentId = enterpriseDept.id;
            console.log('Enterprise department found with ID:', departmentId);
          } else {
            // department_managementに見つからない場合は、従来のdepartmentsテーブルを確認
            const { data: department, error: departmentError } = await supabase
              .from('departments')
              .select('id')
              .eq('name', departmentName)
              .eq('company_id', companyId)
              .single();

            if (departmentError && departmentError.code === 'PGRST116') {
              console.log('Department not found, creating new department...');
              const { data: newDepartment, error: createDepartmentError } = await supabase
                .from('departments')
                .insert({
                  name: departmentName,
                  company_id: companyId
                })
                .select('id')
                .single();

              if (createDepartmentError) {
                console.error('Error creating department:', createDepartmentError);
                throw new Error(`Failed to create department: ${createDepartmentError.message}`);
              }
              departmentId = newDepartment.id;
              console.log('Department created with ID:', departmentId);
            } else if (departmentError) {
              console.error('Error fetching department:', departmentError);
              throw new Error(`Failed to fetch department: ${departmentError.message}`);
            } else {
              departmentId = department.id;
              console.log('Department found with ID:', departmentId);
            }
          }
        } else {
          // デフォルトの部署を取得
          const { data: defaultDept, error: defaultDeptError } = await supabase
            .from('departments')
            .select('id')
            .eq('name', '経営企画部')
            .eq('company_id', companyId)
            .single();
          
          if (!defaultDeptError && defaultDept) {
            departmentId = defaultDept.id;
          }
        }
      } catch (error) {
        console.error('Error in company/department setup:', error);
        // 会社・部署の作成に失敗した場合は、department_idをnullにしてプロフィールを作成
        console.log('Proceeding with null department_id...');
      }

      // プロフィールを作成
      console.log('Creating profile with data:', {
        id: user.id,
        full_name: fullName,
        company_name: companyName,
        position: position,
        phone_number: phoneNumber,
        email: user.email || '',
        role: userMetadata.role || 'general_user',
        plan: userMetadata.plan || 'Free',
        department_id: departmentId,
        status: 'active'
      });

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          company_name: companyName,
          position: position,
          phone_number: phoneNumber,
          email: user.email || '',
          role: userMetadata.role || 'general_user',
          plan: userMetadata.plan || 'Free',
          department_id: departmentId,
          status: 'active'
        })
        .select(`
          *,
          departments (
            id,
            name
          )
        `)
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
        console.error('Profile error details:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      console.log('Profile created successfully:', profile);

      // デフォルトの手当設定を作成
      try {
        const { error: allowanceError } = await supabase
          .from('user_allowance_settings')
          .insert({
            user_id: user.id,
            domestic_daily_allowance: 0,
            domestic_accommodation: 0,
            domestic_transportation: 0,
            overseas_daily_allowance: 0,
            overseas_accommodation: 0,
            overseas_transportation: 0,
            overseas_preparation_fee: 0
          });

        if (allowanceError) {
          console.warn('Error creating allowance settings:', allowanceError);
        } else {
          console.log('Allowance settings created successfully');
        }
      } catch (error) {
        console.warn('Error creating allowance settings:', error);
      }

      // デフォルトの通知設定を作成
      try {
        const { error: notificationError } = await supabase
          .from('user_notification_settings')
          .insert({
            user_id: user.id,
            email_notifications: true,
            push_notifications: true,
            reminder_time: '09:00:00',
            approval_only: false
          });

        if (notificationError) {
          console.warn('Error creating notification settings:', notificationError);
        } else {
          console.log('Notification settings created successfully');
        }
      } catch (error) {
        console.warn('Error creating notification settings:', error);
      }

      // 古いカラム名と新しいカラム名の両方を考慮してマッピング
      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email || '',
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        position: profile.position || '',
        phone_number: profile.phone_number || '',
        role: profile.role || 'general_user',
        plan: profile.plan || 'Free',
        department_id: profile.department_id,
        department_name: profile.departments?.name || null,
        invited_by: profile.invited_by,
        last_login_at: profile.last_login_at,
        status: profile.status || 'active',
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };

        setAuthState({ user: userProfile, isAuthenticated: true, loading: false });
        return true; // 成功
      })();
      
      // タイムアウト付きでプロフィール作成を実行
      await Promise.race([createProfilePromise, createTimeoutPromise]);
      console.log('✅ [createUserProfile] Profile creation completed successfully');
      return true;
      
    } catch (error) {
      console.error('❌ [createUserProfile] Error in createUserProfile:', error);
      console.error('🔍 [createUserProfile] Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      if (error?.message?.includes('timeout')) {
        console.error('⏰ [createUserProfile] Profile creation timed out');
      }
      
      setAuthState({ 
        user: null, 
        isAuthenticated: false, 
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      return false; // 失敗
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: getErrorMessage(error) };
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'ログインに失敗しました' };
    }
  };

  const register = async (userData: ProfileFormData): Promise<{ success: boolean; error?: string; retryAfter?: number; emailConfirmationRequired?: boolean }> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1秒

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Registration attempt ${attempt}/${MAX_RETRIES} for ${userData.email}`);

        // Supabase Authでユーザーを作成（メール確認あり）
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password!,
          options: {
            data: {
              full_name: userData.full_name,
              company_name: userData.company_name,
              position: userData.position,
              phone_number: userData.phone_number,
              department_name: userData.department_name,
              role: userData.role || 'general_user',
              plan: userData.plan || 'Free'
            }
          }
        });

        if (error) {
          console.error('Registration error:', error);
          
          // レート制限エラーの場合
          if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
            const retryAfter = extractRetryAfter(error.message) || 60; // デフォルト60秒
            
            if (attempt < MAX_RETRIES) {
              console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
              await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
              continue;
            } else {
              return { 
                success: false, 
                error: `レート制限により登録が制限されています。${retryAfter}秒後に再試行してください。`,
                retryAfter 
              };
            }
          }

          return { success: false, error: getErrorMessage(error) };
        }

        console.log('Supabase signUp result:', { data, error });
        
        // メール確認が必要な場合（data.userがnullの場合）
        if (!data.user && !error) {
          console.log('Email confirmation required - data.user is null');
          return { 
            success: true, 
            emailConfirmationRequired: true 
          };
        }

        // data.userが存在する場合でも、新規登録時は常にメール確認が必要
        if (data.user) {
          // 新規登録時は常にメール確認が必要（セキュリティのため）
          console.log('Email confirmation required - new user registration always requires email verification');
          return { 
            success: true, 
            emailConfirmationRequired: true 
          };
        }
        
        // 新規登録時は常にメール確認が必要なため、ここに到達することはない
        // 上記でemailConfirmationRequired: trueを返しているため
      } catch (error) {
        console.error(`Registration attempt ${attempt} failed:`, error);
        
        if (attempt < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          return { success: false, error: '登録に失敗しました。しばらく時間をおいてから再試行してください。' };
        }
      }
    }

    return { success: false, error: '最大再試行回数に達しました' };
  };

  // レート制限エラーから再試行時間を抽出するヘルパー関数
  const extractRetryAfter = (errorMessage: string): number | null => {
    const match = errorMessage.match(/(\d+)\s*秒|(\d+)\s*second/i);
    if (match) {
      return parseInt(match[1] || match[2], 10);
    }
    return null;
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      const currentUser = authState.user;
      if (!currentUser) {
        return { success: false, error: 'ユーザーが見つかりません' };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, error: getErrorMessage(error) };
      }

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'プロフィール更新に失敗しました' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        return { success: false, error: getErrorMessage(error) };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'パスワードリセットに失敗しました' };
    }
  };

  const resetAuthState = (): void => {
    console.log('Resetting auth state to initial state');
    setAuthState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,
      error: undefined
    });
  };

  const refreshSession = async (): Promise<void> => {
    try {
      console.log('Refreshing session...');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false,
          error: error.message
        });
        return;
      }

      if (session?.user) {
        await loadUserProfile(session.user, session);
      } else {
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
        error: 'セッションの更新に失敗しました'
      });
    }
  };

  const getAccessToken = (): string | null => {
    return authState.session?.access_token || null;
  };

  const getErrorMessage = (error: AuthError): string => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'メールアドレスまたはパスワードが正しくありません';
      case 'Email not confirmed':
        return 'メールアドレスが確認されていません';
      case 'User already registered':
        return 'このメールアドレスは既に登録されています';
      case 'Password should be at least 6 characters':
        return 'パスワードは6文字以上で入力してください';
      case 'Unable to validate email address: invalid format':
        return 'メールアドレスの形式が正しくありません';
      default:
        return error.message || 'エラーが発生しました';
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    resetAuthState,
    refreshSession,
    getAccessToken,
    userRole: authState.user?.role || 'general_user',
    userPlan: authState.user?.plan || 'Free',
    isOnboardingComplete: authState.user?.status === 'active'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
