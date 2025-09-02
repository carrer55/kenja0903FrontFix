import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface SecurityPageProps {
  onNavigate: (view: string) => void;
}

function SecurityPage({ onNavigate }: SecurityPageProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-indigo-600/20"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-3"
            >
              <img 
                src="/IconOnly_Transparent_NoBuffer.LPver.png" 
                alt="賢者の精算アイコン" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-white">賢者の精算</span>
            </button>
            
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>
          </div>
        </div>
      </nav>
      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 pt-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                セキュリティ
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              エンタープライズグレードのセキュリティで、お客様の重要なデータを保護
            </p>
          </div>

          <div className="space-y-12">
            {/* セキュリティ概要 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">セキュリティ概要</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  賢者の精算は、企業の重要な財務データを扱うシステムとして、
                  最高レベルのセキュリティ対策を実装しています。
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">エンドツーエンド暗号化</h3>
                    <p className="text-white mb-4">すべてのデータ通信はTLS 1.3による強力な暗号化で保護されています。</p>
                    <div className="space-y-2">
                      <p>• AES-256暗号化によるデータ保護</p>
                      <p>• RSA-4096による鍵交換</p>
                      <p>• 完全前方秘匿性（PFS）対応</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">アクセス制御</h3>
                    <p className="text-white mb-4">多層防御システムにより、不正アクセスを徹底的に防止します。</p>
                    <div className="space-y-2">
                      <p>• 多要素認証（MFA）対応</p>
                      <p>• IP制限・地理的制限</p>
                      <p>• 役割ベースアクセス制御（RBAC）</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">インフラセキュリティ</h3>
                    <p className="text-white mb-4">AWS・Azure等のエンタープライズグレードインフラを使用。</p>
                    <div className="space-y-2">
                      <p>• SOC 2 Type II準拠データセンター</p>
                      <p>• 24時間365日監視体制</p>
                      <p>• 自動バックアップ・災害復旧</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">監査・ログ</h3>
                    <p className="text-white mb-4">すべての操作を記録し、完全な監査証跡を提供します。</p>
                    <div className="space-y-2">
                      <p>• 全操作の詳細ログ記録</p>
                      <p>• リアルタイム異常検知</p>
                      <p>• 改ざん防止機能（IPFS）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">コンプライアンス・認証</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  国際的なセキュリティ基準に準拠し、第三者機関による認証を取得しています。
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">ISO 27001</h3>
                    <p className="text-white">情報セキュリティマネジメントシステム - 認証取得済み</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">SOC 2 Type II</h3>
                    <p className="text-white">セキュリティ・可用性・機密性の保証 - 認証取得済み</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">プライバシーマーク</h3>
                    <p className="text-white">個人情報保護体制の認定 - 認定取得済み</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">GDPR準拠</h3>
                    <p className="text-white">EU一般データ保護規則への準拠 - 準拠済み</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">法令準拠</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p>• 個人情報保護法</p>
                      <p>• 電子帳簿保存法</p>
                      <p>• 法人税法</p>
                    </div>
                    <div className="space-y-2">
                      <p>• 所得税法</p>
                      <p>• 労働基準法</p>
                      <p>• GDPR（EU一般データ保護規則）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">データ保護</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  お客様の重要なデータを多層防御システムで保護しています。
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">データ暗号化</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-white mb-2">保存時暗号化</h4>
                        <div className="space-y-1">
                          <p>• AES-256による暗号化</p>
                          <p>• 暗号化キーの分離管理</p>
                          <p>• 定期的なキーローテーション</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">転送時暗号化</h4>
                        <div className="space-y-1">
                          <p>• TLS 1.3による通信暗号化</p>
                          <p>• HSTS（HTTP Strict Transport Security）</p>
                          <p>• 証明書の透明性（CT）対応</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">アクセス管理</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white">多要素認証（MFA）</h4>
                        <p className="text-white">SMS、メール、認証アプリによる二段階認証</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">役割ベースアクセス制御</h4>
                        <p className="text-white">最小権限の原則に基づく細かな権限設定</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">IP制限・地理的制限</h4>
                        <p className="text-white">指定されたIPアドレス・地域からのみアクセス可能</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">データバックアップ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">自動バックアップ</h4>
                        <p className="text-white">1時間ごとの自動バックアップ</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">地理的分散</h4>
                        <p className="text-white">複数地域でのデータ複製</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">復旧保証</h4>
                        <p className="text-white">RTO: 4時間、RPO: 1時間</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">インシデント対応</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  セキュリティインシデントに対する迅速かつ適切な対応体制を整備しています。
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">対応フロー</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">1. 検知・報告（即時）</h4>
                      <p className="text-white">自動監視システムまたは手動報告による即座の検知</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">2. 初期対応（15分以内）</h4>
                      <p className="text-white">影響範囲の特定と緊急対応措置の実施</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">3. 詳細調査（1時間以内）</h4>
                      <p className="text-white">根本原因の特定と影響評価の実施</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">4. 復旧作業（4時間以内）</h4>
                      <p className="text-white">システム復旧と正常性確認</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">5. 事後対応（24時間以内）</h4>
                      <p className="text-white">再発防止策の策定と実装</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">緊急連絡先</h4>
                  <div className="space-y-2">
                    <p><strong className="text-white">セキュリティインシデント報告:</strong> security@kenjano-seisan.com</p>
                    <p><strong className="text-white">緊急時電話番号:</strong> 03-1234-5678（24時間対応）</p>
                    <p><strong className="text-white">脆弱性報告:</strong> vulnerability@kenjano-seisan.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 戻るボタン */}
          <div className="text-center mt-16">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>トップページに戻る</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;
