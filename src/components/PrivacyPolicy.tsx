import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, Lock, Users, Globe, Calendar } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate: (view: string) => void;
}

function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  const [selectedSection, setSelectedSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '概要', icon: Shield },
    { id: 'collection', label: '情報収集', icon: Eye },
    { id: 'usage', label: '利用目的', icon: Users },
    { id: 'sharing', label: '第三者提供', icon: Globe },
    { id: 'security', label: 'セキュリティ', icon: Lock },
    { id: 'rights', label: 'お客様の権利', icon: Users },
    { id: 'contact', label: 'お問い合わせ', icon: Users }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">プライバシーポリシー概要</h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          株式会社賢者の精算（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、
          個人情報保護法その他の関連法令を遵守し、適切な取り扱いを行います。
        </p>
      </div>

      <div className="bg-blue-50/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">基本方針</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>お客様の個人情報は、明確な目的のもとでのみ収集・利用いたします</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>収集した個人情報は適切に管理し、不正アクセス・漏洩を防止します</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>法令に基づく場合を除き、同意なく第三者に提供することはありません</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>お客様からの開示・訂正・削除等の要求に適切に対応いたします</span>
          </li>
        </ul>
      </div>

      <div className="bg-white/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">最終更新日</h3>
        </div>
        <p className="text-slate-600">2024年7月1日</p>
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">個人情報の収集</h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          当社では、サービス提供に必要な範囲で以下の個人情報を収集いたします。
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">収集する情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">アカウント情報</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• 氏名</li>
                <li>• メールアドレス</li>
                <li>• 電話番号</li>
                <li>• 会社名・部署名</li>
                <li>• 役職</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">利用情報</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• 申請データ（出張・経費申請の内容）</li>
                <li>• 領収書・証憑書類</li>
                <li>• システム利用ログ</li>
                <li>• IPアドレス・ブラウザ情報</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">収集方法</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">直接収集</h4>
              <p className="text-sm text-slate-600">
                アカウント登録時、申請作成時、設定変更時など、
                お客様が直接入力された情報を収集します。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">自動収集</h4>
              <p className="text-sm text-slate-600">
                サービス利用時のアクセスログ、操作履歴、
                技術的情報を自動的に収集します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">個人情報の利用目的</h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          収集した個人情報は、以下の目的でのみ利用いたします。
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            title: 'サービスの提供・運営',
            items: [
              'アカウント管理・認証',
              '申請処理・承認ワークフロー',
              '精算処理・支払い管理',
              'レポート・統計の生成'
            ]
          },
          {
            title: 'カスタマーサポート',
            items: [
              'お問い合わせ対応',
              '技術サポート',
              '利用方法のご案内',
              'トラブルシューティング'
            ]
          },
          {
            title: 'サービス改善',
            items: [
              '機能改善・新機能開発',
              'ユーザビリティ向上',
              'システム最適化',
              '品質向上'
            ]
          },
          {
            title: 'セキュリティ・コンプライアンス',
            items: [
              '不正利用の防止・検知',
              'セキュリティ監視',
              '法令遵守の確認',
              '監査対応'
            ]
          }
        ].map((category, index) => (
          <div key={index} className="bg-white/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-navy-600 rounded-full"></span>
                  <span className="text-slate-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRights = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">お客様の権利</h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          お客様は、ご自身の個人情報について以下の権利を有しています。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: '開示請求権',
            description: 'ご自身の個人情報の利用状況について開示を求める権利',
            icon: Eye
          },
          {
            title: '訂正・削除権',
            description: '個人情報の訂正・削除を求める権利',
            icon: Lock
          },
          {
            title: '利用停止権',
            description: '個人情報の利用停止を求める権利',
            icon: Shield
          },
          {
            title: 'データポータビリティ権',
            description: '個人情報の移転を求める権利',
            icon: Globe
          }
        ].map((right, index) => {
          const Icon = right.icon;
          return (
            <div key={index} className="bg-white/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="w-6 h-6 text-navy-600" />
                <h3 className="text-lg font-semibold text-slate-800">{right.title}</h3>
              </div>
              <p className="text-slate-600 text-sm">{right.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">権利行使の方法</h3>
        <div className="space-y-3 text-slate-700">
          <p>上記の権利を行使される場合は、以下の連絡先までお問い合わせください：</p>
          <div className="bg-white/50 rounded-lg p-4">
            <p><strong>メール:</strong> privacy@kenjano-seisan.com</p>
            <p><strong>電話:</strong> 03-1234-5678（平日 9:00-18:00）</p>
            <p><strong>郵送:</strong> 〒100-0005 東京都千代田区丸の内1-1-1 丸の内ビル10F</p>
          </div>
          <p className="text-sm text-slate-600">
            ※ご本人確認のため、身分証明書の提示をお願いする場合があります。
          </p>
        </div>
      </div>
    </div>
  );

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 pt-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                プライバシーポリシー
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              お客様の個人情報保護に関する当社の取り組み
            </p>
          </div>

          {/* シンプルなコンテンツ表示 */}
          <div className="space-y-12">
            {/* プライバシーポリシー概要 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">プライバシーポリシー概要</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  株式会社賢者の精算（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、
                  個人情報保護法その他の関連法令を遵守し、適切な取り扱いを行います。
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">基本方針</h3>
                  <ul className="space-y-2 text-white">
                    <li>• お客様の個人情報は、明確な目的のもとでのみ収集・利用いたします</li>
                    <li>• 収集した個人情報は適切に管理し、不正アクセス・漏洩を防止します</li>
                    <li>• 法令に基づく場合を除き、同意なく第三者に提供することはありません</li>
                    <li>• お客様からの開示・訂正・削除等の要求に適切に対応いたします</li>
                  </ul>
                </div>
                
                <p className="text-white/80">最終更新日：2024年7月1日</p>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">個人情報の収集</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  当社では、サービス提供に必要な範囲で以下の個人情報を収集いたします。
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">収集する情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-white mb-3">アカウント情報</h4>
                      <ul className="space-y-1 text-white">
                        <li>• 氏名</li>
                        <li>• メールアドレス</li>
                        <li>• 電話番号</li>
                        <li>• 会社名・部署名</li>
                        <li>• 役職</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">利用情報</h4>
                      <ul className="space-y-1 text-white">
                        <li>• 申請データ（出張・経費申請の内容）</li>
                        <li>• 領収書・証憑書類</li>
                        <li>• システム利用ログ</li>
                        <li>• IPアドレス・ブラウザ情報</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">収集方法</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">直接収集</h4>
                      <p className="text-white">
                        アカウント登録時、申請作成時、設定変更時など、
                        お客様が直接入力された情報を収集します。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">自動収集</h4>
                      <p className="text-white">
                        サービス利用時のアクセスログ、操作履歴、
                        技術的情報を自動的に収集します。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">利用目的</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  収集した個人情報は、以下の目的でのみ利用いたします。
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">サービス提供・運営</h3>
                    <ul className="space-y-1 text-white">
                      <li>• アカウント管理・認証</li>
                      <li>• 申請処理・承認ワークフロー</li>
                      <li>• 精算処理・支払い管理</li>
                      <li>• レポート・統計の生成</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">カスタマーサポート</h3>
                    <ul className="space-y-1 text-white">
                      <li>• お問い合わせ対応</li>
                      <li>• 技術サポート</li>
                      <li>• 利用方法のご案内</li>
                      <li>• トラブルシューティング</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">サービス改善</h3>
                    <ul className="space-y-1 text-white">
                      <li>• 機能改善・新機能開発</li>
                      <li>• ユーザビリティ向上</li>
                      <li>• システム最適化</li>
                      <li>• 品質向上</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">セキュリティ・コンプライアンス</h3>
                    <ul className="space-y-1 text-white">
                      <li>• 不正利用の防止・検知</li>
                      <li>• セキュリティ監視</li>
                      <li>• 法令遵守の確認</li>
                      <li>• 監査対応</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">お客様の権利</h2>
              <div className="space-y-6 text-white">
                <p className="text-lg leading-relaxed">
                  お客様は、ご自身の個人情報について以下の権利を有しています。
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">開示請求権</h3>
                    <p className="text-white">ご自身の個人情報の利用状況について開示を求める権利</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">訂正・削除権</h3>
                    <p className="text-white">個人情報の訂正・削除を求める権利</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">利用停止権</h3>
                    <p className="text-white">個人情報の利用停止を求める権利</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">データポータビリティ権</h3>
                    <p className="text-white">個人情報の移転を求める権利</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-3">権利行使の方法</h3>
                  <div className="text-white">
                    <p className="mb-4">上記の権利を行使される場合は、以下の連絡先までお問い合わせください：</p>
                    <div className="space-y-2">
                      <p><strong className="text-white">メール:</strong> privacy@kenjano-seisan.com</p>
                      <p><strong className="text-white">電話:</strong> 03-1234-5678（平日 9:00-18:00）</p>
                      <p><strong className="text-white">郵送:</strong> 〒100-0005 東京都千代田区丸の内1-1-1 丸の内ビル10F</p>
                    </div>
                    <p className="text-sm text-white/80 mt-4">
                      ※ご本人確認のため、身分証明書の提示をお願いする場合があります。
                    </p>
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

export default PrivacyPolicy;