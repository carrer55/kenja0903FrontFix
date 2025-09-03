import React from 'react';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

interface EmailConfirmationProps {
  onNavigate: (view: string) => void;
}

function EmailConfirmation({ onNavigate }: EmailConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <div className="w-full h-24 mx-auto mb-6 flex items-center justify-center">
              <img 
                src="/賢者の精算Logo2_Transparent_NoBuffer copy.png" 
                alt="賢者の精算ロゴ" 
                className="h-full object-contain"
              />
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="backdrop-blur-xl bg-white/20 rounded-xl p-8 border border-white/30 shadow-2xl">
            {/* アイコン */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-200/50">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
            </div>

            {/* タイトル */}
            <h1 className="text-2xl font-bold text-slate-800 text-center mb-4">
              仮登録が完了しました
            </h1>

            {/* 説明文 */}
            <div className="text-center mb-8">
              <p className="text-slate-600 mb-4">
                ご登録いただいたメールアドレスに確認メールを送信いたしました。
              </p>
              <p className="text-slate-600 mb-4">
                メール内のURLをクリックして、本登録を完了してください。
              </p>
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>注意:</strong> メールが届かない場合は、迷惑メールフォルダもご確認ください。
                </p>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('login')}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors font-medium shadow-lg"
              >
                <span>ログインページに戻る</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigate('landing')}
                className="w-full px-6 py-3 border border-white/40 text-slate-700 rounded-lg hover:bg-white/20 transition-colors font-medium backdrop-blur-sm"
              >
                TOPページに戻る
              </button>
            </div>

            {/* ヘルプテキスト */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                メール確認についてご不明な点がございましたら、
                <br />
                サポートまでお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmation;
