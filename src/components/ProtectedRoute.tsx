import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'department_admin' | 'approver' | 'general_user';
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, userRole } = useAuth();

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">アクセス権限がありません</h1>
          <p className="text-slate-600 mb-6">このページにアクセスするにはログインが必要です</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
          >
            ログインページへ
          </button>
        </div>
      </div>
    );
  }

  // 権限チェック
  if (requiredRole) {
    const roleHierarchy = {
      'general_user': 0,
      'approver': 1,
      'department_admin': 2,
      'admin': 3
    };

    const userRoleLevel = roleHierarchy[userRole];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">権限が不足しています</h1>
            <p className="text-slate-600 mb-6">
              このページにアクセスするには{requiredRole}以上の権限が必要です
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              前のページに戻る
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// HOC版のProtectedRoute
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'admin' | 'department_admin' | 'approver' | 'general_user'
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
