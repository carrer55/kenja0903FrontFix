import React, { useState } from 'react';
import { CheckCircle, X, FileText, Calculator, ArrowRight, Sparkles } from 'lucide-react';

interface PostTripNotificationProps {
  tripTitle: string;
  tripId: string;
  endDate: string;
  onCreateReport: () => void;
  onDismiss: () => void;
}

function PostTripNotification({ 
  tripTitle, 
  tripId, 
  endDate, 
  onCreateReport, 
  onDismiss 
}: PostTripNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  const handleCreateReport = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onCreateReport();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
    }`}>
      <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 rounded-xl p-6 border border-emerald-300/30 shadow-2xl max-w-sm w-full relative overflow-hidden">
        {/* 装飾的な背景エフェクト */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-emerald-300/15 to-emerald-500/15 rounded-full translate-y-8 -translate-x-8"></div>
        
        {/* 閉じるボタン */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-white/20 rounded-full transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          {/* アイコンとタイトル */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-800">出張お疲れ様でした！</h3>
              <p className="text-sm text-slate-600">{tripTitle}</p>
            </div>
          </div>

          {/* メッセージ */}
          <div className="mb-6">
            <p className="text-slate-700 text-sm leading-relaxed">
              出張報告書と精算書を作成して、精算しましょう。
            </p>
            <p className="text-xs text-slate-500 mt-2">
              終了日: {new Date(endDate).toLocaleDateString('ja-JP')}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            <button
              onClick={handleCreateReport}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>報告書を作成する</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDismiss}
              className="w-full px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/20 rounded-lg text-sm transition-all duration-200"
            >
              あとで作成する
            </button>
          </div>
        </div>

        {/* アニメーション用の装飾 */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-emerald-600/5 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}

export default PostTripNotification;