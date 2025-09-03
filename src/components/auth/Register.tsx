import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, User, Building, Phone, Briefcase, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { type ProfileFormData } from '../../lib/supabase';

interface RegisterProps {
  onNavigate: (view: string) => void;
}

function Register({ onNavigate }: RegisterProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company_name: '',
    position: '',
    phone_number: '',
    department_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { register: registerUser, loading } = useAuth();

  // レート制限のカウントダウン
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setTimeout(() => {
        setRetryAfter(retryAfter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (retryAfter === 0) {
      setRetryAfter(null);
      setIsRetrying(false);
    }
  }, [retryAfter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsRetrying(false);

    // バリデーション
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    // 必須フィールドのバリデーション
    if (!formData.email || !formData.password || !formData.full_name || !formData.company_name || !formData.position || !formData.phone_number || !formData.department_name) {
      setError('すべての項目を入力してください');
      return;
    }

    const result = await registerUser(formData);
    
    console.log('Register result:', result);

    if (result.success) {
      if (result.emailConfirmationRequired) {
        // メール確認が必要な場合
        console.log('Navigating to email confirmation page...');
        onNavigate('email-confirmation');
      } else {
        // 即座にログインできる場合
        console.log('Navigating to register success page...');
        onNavigate('register-success');
      }
    } else {
      console.log('Registration failed:', result.error);
      setError(result.error || '登録に失敗しました');
      if (result.retryAfter) {
        setRetryAfter(result.retryAfter);
        setIsRetrying(true);
      }
    }
  };

  const handleRetry = () => {
    setError('');
    setIsRetrying(false);
    setRetryAfter(null);
    handleSubmit(new Event('submit') as any);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">新規登録</h1>
            <p className="text-slate-600 mt-2">アカウントを作成して始めましょう</p>
          </div>

          {/* メインカード */}
          <div className="backdrop-blur-xl bg-white/20 rounded-xl p-8 border border-white/30 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* エラーメッセージ */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* レート制限メッセージ */}
              {isRetrying && retryAfter && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        レート制限により登録が制限されています。
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        再試行可能まで: {formatTime(retryAfter)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="example@company.com"
                  required
                />
              </div>

              {/* パスワード */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="8文字以上で入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* パスワード確認 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  パスワード確認
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="パスワードを再入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 氏名 */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  氏名
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="山田 太郎"
                  required
                />
              </div>

              {/* 会社名 */}
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  会社名
                </label>
                <input
                  type="text"
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="株式会社サンプル"
                  required
                />
              </div>

              {/* 役職 */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  役職
                </label>
                <input
                  type="text"
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="営業部長"
                  required
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  電話番号
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="03-1234-5678"
                  required
                />
              </div>

              {/* 部署 */}
              <div>
                <label htmlFor="department_name" className="block text-sm font-medium text-slate-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  部署
                </label>
                <input
                  type="text"
                  id="department_name"
                  value={formData.department_name}
                  onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="例：営業部、開発部、人事部など"
                  required
                />
              </div>

              {/* 登録ボタン */}
              <button
                type="submit"
                disabled={loading || isRetrying}
                className="w-full py-3 px-4 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    登録中...
                  </div>
                ) : isRetrying ? (
                  <div className="flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-2" />
                    再試行待機中...
                  </div>
                ) : (
                  'アカウントを作成'
                )}
              </button>

              {/* 再試行ボタン */}
              {isRetrying && retryAfter === 0 && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    再試行
                  </div>
                </button>
              )}
            </form>

            {/* ログインリンク */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                既にアカウントをお持ちですか？{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-navy-600 hover:text-navy-800 font-medium"
                >
                  ログイン
                </button>
              </p>
            </div>
          </div>

          {/* 戻るボタン */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              トップページに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;