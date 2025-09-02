import React from 'react';
import { ArrowLeft, Building, MapPin, Phone, Mail, Users, Calendar, Award } from 'lucide-react';

interface CompanyInfoProps {
  onNavigate: (view: string) => void;
}

function CompanyInfo({ onNavigate }: CompanyInfoProps) {
  const companyData = {
    name: '株式会社賢者の精算',
    englishName: 'Kenja no Seisan Co., Ltd.',
    established: '2023年4月1日',
    capital: '1,000万円',
    employees: '25名',
    ceo: '代表取締役 山田太郎',
    address: '東京都千代田区丸の内1-1-1 丸の内ビル10F',
    phone: '03-1234-5678',
    email: 'info@kenjano-seisan.com',
    business: [
      '出張旅費精算システムの開発・運営',
      'AI技術を活用した業務効率化ソリューション',
      '税務・会計システムの企画・開発',
      'クラウドサービスの提供'
    ],
    mission: 'AI技術で企業の精算業務を革新し、効率化と節税効果を同時に実現する',
    vision: '全ての企業が簡単で正確な精算業務を行える世界を創造する',
    values: [
      '革新性 - 最新技術で業務を革新',
      '信頼性 - 確実で安全なシステム提供',
      '効率性 - 無駄を省いた最適化',
      '透明性 - 明確で分かりやすい運営'
    ]
  };

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
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                会社概要
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              AI技術で企業の精算業務を革新する、賢者の精算について
            </p>
          </div>

          {/* シンプルなコンテンツ表示 */}
          <div className="space-y-12">
            {/* 会社概要 */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">{companyData.name}</h2>
              <p className="text-xl text-white mb-8">{companyData.englishName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">設立</h3>
                  <p className="text-white">{companyData.established}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">資本金</h3>
                  <p className="text-white">{companyData.capital}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">従業員数</h3>
                  <p className="text-white">{companyData.employees}</p>
                </div>
              </div>
            </div>

            {/* ミッション・ビジョン */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">ミッション</h3>
                <p className="text-white leading-relaxed text-lg">{companyData.mission}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">ビジョン</h3>
                <p className="text-white leading-relaxed text-lg">{companyData.vision}</p>
              </div>
            </div>

            {/* 企業価値観 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">企業価値観</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyData.values.map((value, index) => (
                  <div key={index} className="text-white text-lg">
                    • {value}
                  </div>
                ))}
              </div>
            </div>

            {/* 事業内容 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">事業内容</h3>
              <div className="space-y-4">
                {companyData.business.map((item, index) => (
                  <div key={index} className="text-white text-lg">
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 連絡先情報 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">連絡先</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">所在地</h4>
                    <p className="text-white">{companyData.address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">代表者</h4>
                    <p className="text-white">{companyData.ceo}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">電話番号</h4>
                    <p className="text-white">{companyData.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">メールアドレス</h4>
                    <p className="text-white">{companyData.email}</p>
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

export default CompanyInfo;