import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, TrendingUp, FileText, UserPlus, Home } from 'lucide-react';

interface LandingTaxSimulationProps {
  onNavigate: (view: string) => void;
}

interface SimulationData {
  age: string;
  domesticAllowance: number;
  overseasAllowance: number;
  annualIncome: number;
  domesticTrips: number;
  overseasTrips: number;
  hasAllowanceSystem: boolean;
}

function LandingTaxSimulation({ onNavigate }: LandingTaxSimulationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [data, setData] = useState<SimulationData>({
    age: '',
    domesticAllowance: 0,
    overseasAllowance: 0,
    annualIncome: 0,
    domesticTrips: 0,
    overseasTrips: 0,
    hasAllowanceSystem: false
  });

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTax = () => {
    // 介護保険料フラグ
    const needsCareInsurance = ['40〜49歳', '50〜59歳', '60〜64歳'].includes(data.age);
    
    // A. 現在の手取り金額計算
    const healthInsurance = data.annualIncome * 0.0494;
    const pension = data.annualIncome * 0.0915;
    const employment = data.annualIncome * 0.003;
    const careInsurance = needsCareInsurance ? data.annualIncome * 0.0159 : 0;
    
    // 所得税計算（累進税率）
    const calculateIncomeTax = (income: number) => {
      if (income <= 1950000) return income * 0.05;
      if (income <= 3300000) return 97500 + (income - 1950000) * 0.1;
      if (income <= 6950000) return 232500 + (income - 3300000) * 0.2;
      if (income <= 9000000) return 962500 + (income - 6950000) * 0.23;
      if (income <= 18000000) return 1434000 + (income - 9000000) * 0.33;
      if (income <= 40000000) return 4404000 + (income - 18000000) * 0.4;
      return 13204000 + (income - 40000000) * 0.45;
    };

    const incomeTaxA = calculateIncomeTax(data.annualIncome);
    const residentTaxA = data.annualIncome * 0.1;
    
    const currentTakeHome = data.annualIncome - healthInsurance - pension - employment - careInsurance - incomeTaxA - residentTaxA;

    // B. 出張日当導入後の計算
    const nonTaxableAllowance = (data.domesticAllowance * data.domesticTrips) + (data.overseasAllowance * data.overseasTrips);
    const newTaxableIncome = data.annualIncome - nonTaxableAllowance;
    
    const newHealthInsurance = newTaxableIncome * 0.0494;
    const newPension = newTaxableIncome * 0.0915;
    const newEmployment = newTaxableIncome * 0.003;
    const newCareInsurance = needsCareInsurance ? newTaxableIncome * 0.0159 : 0;
    const newIncomeTax = calculateIncomeTax(newTaxableIncome);
    const newResidentTax = newTaxableIncome * 0.1;
    
    const newTakeHome = newTaxableIncome - newHealthInsurance - newPension - newEmployment - newCareInsurance - newIncomeTax - newResidentTax + nonTaxableAllowance;

    return {
      currentTakeHome,
      newTakeHome,
      difference: newTakeHome - currentTakeHome,
      details: {
        current: {
          income: data.annualIncome,
          healthInsurance,
          pension,
          employment,
          careInsurance,
          incomeTax: incomeTaxA,
          residentTax: residentTaxA,
          nonTaxableAllowance: 0
        },
        new: {
          income: newTaxableIncome,
          healthInsurance: newHealthInsurance,
          pension: newPension,
          employment: newEmployment,
          careInsurance: newCareInsurance,
          incomeTax: newIncomeTax,
          residentTax: newResidentTax,
          nonTaxableAllowance
        }
      }
    };
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setShowResult(false);
    setData({
      age: '',
      domesticAllowance: 0,
      overseasAllowance: 0,
      annualIncome: 0,
      domesticTrips: 0,
      overseasTrips: 0,
      hasAllowanceSystem: false
    });
  };

  const result = showResult ? calculateTax() : null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Q1. 年齢区分を選択してください</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['20〜29歳', '30〜39歳', '40〜49歳', '50〜59歳', '60〜64歳', '65歳以上'].map((age) => (
                <button
                  key={age}
                  onClick={() => setData(prev => ({ ...prev, age }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    data.age === age
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                      : 'border-white/30 bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Q2. 出張日当額を入力してください</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  国内日当（円）
                </label>
                <input
                  type="number"
                  value={data.domesticAllowance || ''}
                  onChange={(e) => setData(prev => ({ ...prev, domesticAllowance: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  海外日当（円）
                </label>
                <input
                  type="number"
                  value={data.overseasAllowance || ''}
                  onChange={(e) => setData(prev => ({ ...prev, overseasAllowance: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Q3. 年間所得を入力してください</h2>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                年間所得（円）
              </label>
              <input
                type="number"
                value={data.annualIncome || ''}
                onChange={(e) => setData(prev => ({ ...prev, annualIncome: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                placeholder="10000000"
              />
              {data.annualIncome > 0 && (
                <p className="text-sm text-white/70 mt-2">
                  ¥{data.annualIncome.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Q4. 年間出張回数を入力してください</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  国内出張（日数）
                </label>
                <input
                  type="number"
                  value={data.domesticTrips || ''}
                  onChange={(e) => setData(prev => ({ ...prev, domesticTrips: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  海外出張（日数）
                </label>
                <input
                  type="number"
                  value={data.overseasTrips || ''}
                  onChange={(e) => setData(prev => ({ ...prev, overseasTrips: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Q5. 現在、出張日当制度を導入していますか？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setData(prev => ({ ...prev, hasAllowanceSystem: true }))}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  data.hasAllowanceSystem === true
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                    : 'border-white/30 bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-medium">YES</div>
                  <div className="text-sm text-white/60 mt-1">導入済み</div>
                </div>
              </button>
              <button
                onClick={() => setData(prev => ({ ...prev, hasAllowanceSystem: false }))}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  data.hasAllowanceSystem === false
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                    : 'border-white/30 bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">❌</div>
                  <div className="font-medium">NO</div>
                  <div className="text-sm text-white/60 mt-1">未導入</div>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              シミュレーション結果
            </span>
          </h2>
          <p className="text-xl text-white/80">出張日当制度導入による節税効果をご確認ください</p>
        </div>

        {/* 比較表示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20 shadow-xl text-center">
            <h3 className="text-lg font-semibold text-white/80 mb-2">現在の手取り金額</h3>
            <p className="text-3xl font-bold text-white">¥{Math.round(result.currentTakeHome).toLocaleString()}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20 shadow-xl text-center">
            <h3 className="text-lg font-semibold text-white/80 mb-2">出張日当導入後</h3>
            <p className="text-3xl font-bold text-emerald-400">¥{Math.round(result.newTakeHome).toLocaleString()}</p>
          </div>
          <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl p-6 border border-white/20 shadow-xl text-center text-white">
            <h3 className="text-lg font-semibold mb-2">年間節税効果</h3>
            <p className="text-4xl font-bold">+¥{Math.round(result.difference).toLocaleString()}</p>
          </div>
        </div>

        {/* 詳細比較表 */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">詳細比較表</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left py-3 px-4 font-medium text-white/80">項目</th>
                  <th className="text-right py-3 px-4 font-medium text-white/80">導入前手取り</th>
                  <th className="text-right py-3 px-4 font-medium text-white/80">導入後手取り</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">年間所得</td>
                  <td className="py-3 px-4 text-right text-white">¥{result.details.current.income.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-white">¥{result.details.new.income.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">健康保険料</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.current.healthInsurance).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.new.healthInsurance).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">厚生年金保険料</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.current.pension).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.new.pension).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">雇用保険料</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.current.employment).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.new.employment).toLocaleString()}</td>
                </tr>
                {result.details.current.careInsurance > 0 && (
                  <tr className="border-b border-white/20">
                    <td className="py-3 px-4 text-white/80">介護保険料</td>
                    <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.current.careInsurance).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.new.careInsurance).toLocaleString()}</td>
                  </tr>
                )}
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">所得税</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.current.incomeTax).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.new.incomeTax).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">住民税</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.current.residentTax).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-400">-¥{Math.round(result.details.new.residentTax).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-3 px-4 text-white/80">非課税出張日当</td>
                  <td className="py-3 px-4 text-right text-white/60">―</td>
                  <td className="py-3 px-4 text-right text-emerald-400">+¥{Math.round(result.details.new.nonTaxableAllowance).toLocaleString()}</td>
                </tr>
                <tr className="border-t-2 border-emerald-400 bg-emerald-500/20">
                  <td className="py-4 px-4 font-bold text-white">手取り金額</td>
                  <td className="py-4 px-4 text-right font-bold text-white">¥{Math.round(result.currentTakeHome).toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-400">¥{Math.round(result.newTakeHome).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* フォローアップ */}
        {!data.hasAllowanceSystem && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 rounded-xl p-8 border border-emerald-300/30 shadow-xl">
            <div className="text-center mb-6">
              <TrendingUp className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                出張旅費規程の導入でこの金額差！
              </h3>
              <p className="text-white/80 text-lg">Proプランで今すぐ始めよう！</p>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-bold text-lg transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>戻る</span>
          </button>
          
          <button
            onClick={resetSimulation}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Calculator className="w-5 h-5" />
            <span>もう一度シミュレーションする</span>
          </button>
          
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            <span>Proプランで節税をはじめる</span>
          </button>
        </div>
      </div>
    );
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return data.age !== '';
      case 2: return data.domesticAllowance > 0 || data.overseasAllowance > 0;
      case 3: return data.annualIncome > 0;
      case 4: return data.domesticTrips > 0 || data.overseasTrips > 0;
      case 5: return data.hasAllowanceSystem !== undefined;
      default: return false;
    }
  };

  if (showResult) {
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

        <div className="relative z-10 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderResult()}
          </div>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => onNavigate('landing')}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-medium transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>戻る</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <Calculator className="w-4 h-4" />
                <span>ステップ {currentStep}/5</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  節税シミュレーション
                </span>
              </h1>
              <p className="text-xl text-white/80">
                出張日当制度導入による節税効果を計算します
              </p>
            </div>
            
            {/* 進捗ゲージ */}
            <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
            {renderStep()}
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border border-white/30'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!isStepComplete()}
                className={`flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                  isStepComplete()
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <span>次へ</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepComplete()}
                className={`flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                  isStepComplete()
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span>結果を見る</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingTaxSimulation;