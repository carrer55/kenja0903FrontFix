import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  Calculator,
  Sparkles,
  Play,
  ChevronDown,
  Menu,
  X,
  Globe,
  Award,
  Clock,
  BarChart3,
  User
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: '簡単操作',
      description: '複雑な出張申請、精算手続きをAIで自動入力補助。より簡単に、よりシンプルに手続きが可能。',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      icon: FileText,
      title: 'OCR自動読み取り',
      description: '領収書をスマホで撮影するだけで、店舗名・日付・金額を自動で読み取り。手入力の手間を大幅削減。',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Calculator,
      title: '自動計算エンジン',
      description: '出張期間や役職に応じて日当・交通費・宿泊費を自動計算。計算ミスを防ぎ、業務効率を向上。',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      icon: Users,
      title: '規程自動生成',
      description: '法令に準拠した出張旅費規程をガイドに従って作成。Word・PDF形式での出力も可能。',
      gradient: 'from-green-400 to-teal-500'
    },
    {
      icon: TrendingUp,
      title: '節税シミュレーション',
      description: '出張日当制度導入による節税効果を詳細にシミュレーション。年間数十万円の節税も可能。',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: Shield,
      title: 'セキュア承認フロー',
      description: '多段階承認ワークフローとリマインド機能で、確実で透明性の高い承認プロセスを実現。',
      gradient: 'from-red-400 to-rose-500'
    }
  ];

  const testimonials = [
    {
      name: '田中 太郎',
      position: '代表取締役',
      company: '株式会社テックイノベーション',
      content: '導入後、経理業務の効率が3倍向上しました。特にOCR機能は革命的で、領収書の手入力作業がほぼゼロになりました。',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    },
    {
      name: '佐藤 花子',
      position: '経理部長',
      company: '株式会社グローバルソリューションズ',
      content: '節税シミュレーション機能で年間200万円の節税効果を確認できました。規程作成も簡単で、法令遵守も安心です。',
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    },
    {
      name: '鈴木 次郎',
      position: 'CFO',
      company: '株式会社フューチャーテック',
      content: 'ペーパーレス化が完全に実現し、承認プロセスも透明化されました。従業員の満足度も大幅に向上しています。',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '¥0',
      period: '/月',
      description: 'スタートアップや小規模チーム向け',
      features: [
        'ユーザー数：1名まで',
        '出張旅費規程の自動生成',
        '節税シミュレーション',
        '基本的な申請・承認機能',
        'メールサポート'
      ],
      buttonText: '無料で始める',
      buttonStyle: 'bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900',
      popular: false
    },
    {
      name: 'Pro',
      price: '¥9,800',
      period: '/月',
      description: '成長企業向けの完全機能',
      features: [
        'ユーザー数：3名まで',
        '全機能利用可能',
        'OCR自動読み取り',
        'ワンタイム承認',
        'IPFS保存（証憑の改ざん防止）',
        'API連携',
        'チャットサポート'
      ],
      buttonText: '今だけ 7日間の無料トライアル',
      buttonStyle: 'bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '¥15,800',
      period: '/月',
      description: '大企業向けエンタープライズ',
      features: [
        'ユーザー数：無制限',
        'Pro機能すべて',
        '組織細分化（部署・拠点ごとの管理）',
        '第二管理者設定',
        '承認フロー自由設定',
        'カスタム統合',
        '専任サポート'
      ],
      buttonText: 'お問い合わせ',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900',
      popular: false
    }
  ];

  const stats = [
    { number: '95%', label: '業務時間削減', icon: Clock },
    { number: '99.9%', label: '信頼性', icon: Shield },
    { number: '3倍', label: '業務効率向上', icon: TrendingUp },
    { number: '200万円', label: '平均年間節税額', icon: Calculator }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-indigo-600/20"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        {/* Floating particles */}
        <div className="absolute inset-0">
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/IconOnly_Transparent_NoBuffer.LPver.png" 
                  alt="賢者の精算アイコン" 
                  className="h-12 w-auto object-contain"
                />
                <span className="text-2xl font-bold text-white">賢者の精算</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                機能
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                料金
              </button>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors font-medium">導入事例</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors font-medium">お問い合わせ</a>
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                ログイン
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-slate-900/95 border-b border-white/20">
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-white/80 hover:text-white transition-colors font-medium py-2 text-left w-full"
              >
                機能
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-white/80 hover:text-white transition-colors font-medium py-2 text-left w-full"
              >
                料金
              </button>
              <a href="#testimonials" className="block text-white/80 hover:text-white transition-colors font-medium py-2">導入事例</a>
              <a href="#contact" className="block text-white/80 hover:text-white transition-colors font-medium py-2">お問い合わせ</a>
              <button
                onClick={() => onNavigate('login')}
                className="w-full px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-full font-semibold shadow-xl transition-all duration-300"
              >
                ログイン
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-400/30 mb-8">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">AI搭載の次世代精算システム</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                賢者の精算
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              出張旅費精算を革新する、AI搭載のオールインワンソリューション。
              <br />
              AIで賢く効率化し、
              <span className="text-emerald-300 font-semibold">年間200万円以上の節税効果</span>を実現。
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => onNavigate('register')}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
              >
                <span>無料ではじめる</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => onNavigate('login')}
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
              >
                <User className="w-5 h-5" />
                <span>ログイン</span>
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>即日利用開始</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>専任サポート付き</span>
              </div>
            </div>
          </div>

          {/* Hero Stats - Reduced top margin */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/70 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                革新的な機能
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              最新のAI技術と直感的なUXで、従来の精算業務を根本から変革します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-3xl transition-shadow duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                お客様の声
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              ご利用いただいているお客様が業務効率化や節税を実現しています。
            </p>
          </div>

          <div className="relative">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  
                  <div>
                    <div className="text-lg font-bold text-white">{testimonials[activeTestimonial].name}</div>
                    <div className="text-emerald-300 font-medium">{testimonials[activeTestimonial].position}</div>
                    <div className="text-white/60">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial indicators */}
              <div className="flex justify-center space-x-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-emerald-400 scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                シンプルな料金体系
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              企業規模や利用用途に応じた最適なプランをご用意。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 transform hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-navy-500/30 to-purple-500/30 border-navy-400/50 shadow-2xl shadow-navy-500/25' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-navy-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                      最人気
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/70 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative">
                  {plan.name === 'Pro' && (
                    <div className="absolute -top-3 -right-3">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl animate-pulse z-50 relative">
                          今だけ
                        </div>
                        {/* 吹き出しの矢印 */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-red-500 z-50"></div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => onNavigate('register')}
                    className={`w-full px-6 py-4 ${plan.buttonStyle} text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    {plan.name === 'Pro' ? '7日間の無料トライアル' : plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-white/60 mb-4">すべてのプランに含まれる基本機能</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <span>• SSL暗号化通信</span>
              <span>• 自動バックアップ</span>
              <span>• 24時間監視</span>
              <span>• 法令準拠サポート</span>
              <span>• モバイル対応</span>
            </div>
          </div>

          {/* 初期設定オプション - Reduced top margin */}
          <div className="mt-16">
            <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl p-8 border border-amber-400/30 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    初期設定オプション
                  </span>
                </h3>
                <div className="text-4xl font-bold text-white mb-4">¥50,000</div>
                <p className="text-white/80 text-lg max-w-3xl mx-auto">
                  税理士連携、各種日当設定、規程作成の法令準拠サポートによって安心、安全の運用が可能
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">税理士連携</h4>
                  <p className="text-white/70 text-sm">専門家による法令準拠チェックと最適化提案</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">各種日当設定</h4>
                  <p className="text-white/70 text-sm">役職・地域別の最適な日当額設定と自動計算</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">規程作成サポート</h4>
                  <p className="text-white/70 text-sm">法令準拠した出張旅費規程の作成と運用支援</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  初期設定オプションで始める
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/IconOnly_Transparent_NoBuffer.LPver.png" 
                  alt="賢者の精算アイコン" 
                  className="h-12 w-auto object-contain"
                />
                <span className="text-xl lg:text-2xl font-bold text-white">賢者の精算</span>
              </div>
              <p className="text-white/70 mb-6 max-w-sm lg:max-w-md text-sm lg:text-base">
                出張精算に特化した革新的なソリューション。
                AI技術で効率化と節税効果を同時に実現。
              </p>
              <div className="flex space-x-4">
                <button className="w-9 h-9 lg:w-10 lg:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">X (Twitter)</span>
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button className="w-9 h-9 lg:w-10 lg:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base lg:text-lg font-bold text-white mb-4 lg:mb-6">製品</h3>
              <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-white/70">
                <li>
                  <button 
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors text-left"
                  >
                    機能一覧
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors text-left"
                  >
                    料金プラン
                  </button>
                </li>
                <li><button onClick={() => onNavigate('api-documentation')} className="hover:text-white transition-colors text-left">API ドキュメント</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base lg:text-lg font-bold text-white mb-4 lg:mb-6">サポート</h3>
              <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-white/70">
                <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left">ヘルプセンター</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors text-left">お問い合わせ</button></li>
                <li>
                  <button 
                    onClick={() => {
                      const element = document.querySelector('.mt-20');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    導入支援
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-10 lg:mt-12 pt-6 lg:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-white/60">
                <button onClick={() => onNavigate('company-info')} className="hover:text-white transition-colors">会社概要</button>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors">プライバシーポリシー</button>
                <button onClick={() => onNavigate('terms-of-service')} className="hover:text-white transition-colors">利用規約</button>
                <button onClick={() => onNavigate('security')} className="hover:text-white transition-colors">セキュリティ</button>
              </div>
              <div className="text-center md:text-right">
            <p className="text-white/60">
              © 2025 賢者の精算. All rights reserved. | 
              <span className="ml-2">Powered by AI & Innovation</span>
            </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {scrollY > 500 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <ChevronDown className="w-6 h-6 rotate-180" />
        </button>
      )}
    </div>
  );
}

export default LandingPage;