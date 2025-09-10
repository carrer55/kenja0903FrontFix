import React, { useState } from 'react';
import { Save, Download, FileText, Calendar, MapPin, Calculator, Plus, Trash2, ArrowLeft, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface TravelRegulationCreationProps {
  onNavigate: (view: string) => void;
}

interface Position {
  id: string;
  name: string;
  domesticDailyAllowance: number;
  domesticAccommodation: number;
  domesticTransportation: number;
  overseasDailyAllowance: number;
  overseasAccommodation: number;
  overseasTransportation: number;
  overseasPreparationFee: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  representative: string;
  establishedDate: string;
  revision: number;
}

interface RegulationData {
  companyInfo: CompanyInfo;
  distanceThreshold: number;
  positions: Position[];
  isTransportationRealExpense: boolean;
  isAccommodationRealExpense: boolean;
  usePreparationFee: boolean;
  customArticles: {
    article1: string;
    article2: string;
    article3: string;
    article4: string;
    article5: string;
    article6: string;
    article7: string;
    article8: string;
    article9: string;
    article10: string;
    article11: string;
  };
}

function TravelRegulationCreation({ onNavigate }: TravelRegulationCreationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [allowanceTab, setAllowanceTab] = useState<'domestic' | 'overseas'>('domestic');
  
  const [data, setData] = useState<RegulationData>({
    companyInfo: {
      name: '',
      address: '',
      representative: '',
      establishedDate: new Date().toISOString().split('T')[0],
      revision: 1
    },
    distanceThreshold: 50,
    positions: [
      { 
        id: '1', 
        name: '代表取締役', 
        domesticDailyAllowance: 8000, 
        domesticAccommodation: 15000, 
        domesticTransportation: 3000,
        overseasDailyAllowance: 15000,
        overseasAccommodation: 25000,
        overseasTransportation: 5000,
        overseasPreparationFee: 10000
      },
      { 
        id: '2', 
        name: '取締役', 
        domesticDailyAllowance: 7000, 
        domesticAccommodation: 12000, 
        domesticTransportation: 2500,
        overseasDailyAllowance: 12000,
        overseasAccommodation: 20000,
        overseasTransportation: 4000,
        overseasPreparationFee: 8000
      },
      { 
        id: '3', 
        name: '執行役員', 
        domesticDailyAllowance: 6000, 
        domesticAccommodation: 10000, 
        domesticTransportation: 2000,
        overseasDailyAllowance: 10000,
        overseasAccommodation: 15000,
        overseasTransportation: 3000,
        overseasPreparationFee: 6000
      },
      { 
        id: '4', 
        name: '従業員', 
        domesticDailyAllowance: 5000, 
        domesticAccommodation: 8000, 
        domesticTransportation: 1500,
        overseasDailyAllowance: 8000,
        overseasAccommodation: 12000,
        overseasTransportation: 2500,
        overseasPreparationFee: 5000
      }
    ],
    isTransportationRealExpense: false,
    isAccommodationRealExpense: false,
    usePreparationFee: true,
    customArticles: {
      article1: 'この規程は、役員または従業員が社命により、出張する場合の、旅費について定めたものである。',
      article2: 'この規程は、役員及び全ての従業員について適用する。',
      article3: 'この規程に基づく旅費とは、出張日当、交通費、宿泊料、支度料の四種とし、その支給基準は第７条規定のとおりとする。ただし、交通費及び宿泊料についてはそれぞれ実費精算とすることができる。',
      article4: '出張とは、従業員が自宅または通常の勤務地を起点として、片道（　　）ｋｍ以上の目的地に移動し、職務を遂行するものをいう。',
      article5: '従業員が出張を行う場合は、事前に所属長の承認を得なければならない。ただし、緊急の場合は事後承認とすることができる。',
      article6: '出張は、以下のとおり区分する。\n１　国内出張\n　国内出張とは、日本国内の用務先に赴く出張であり、所属長（または代表者）が認めたものとする。当日中に帰着することが可能なものは、日帰り出張として出張日当と交通費日当（実費精算可）、宿泊を伴う出張は、出張日当と交通費日当（実費精算可）、宿泊日当（実費精算可）を第７条に定める旅費を支給する。日帰り出張は1日、1泊2日は2日と日数を計算する。\n２　海外出張\n　海外出張とは、日本国外の地域への宿泊を伴う出張であり、所属長（または代表者）が認めたものとする。出張日当と交通費日当（実費精算可）、宿泊日当（実費精算可）に加えて、支度料を第７条に定める旅費を支給する。',
      article7: '旅費は、以下のとおり役職に応じて支給する。',
      article8: '利用する交通手段は、原則として、鉄道、船舶、飛行機、バスとする。\n２　前項に関わらず、会社が必要と認めた場合は、タクシーまたは社有の自動車を利用できるものとする。',
      article9: '旅費は、原則として出張終了後に精算により支給する。ただし、必要に応じて概算払いを行うことができる。',
      article10: '本規程の改廃は、取締役会の決議により行う。',
      article11: '本規程は、令和　年　月　日より実施する。'
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      name: '新しい役職',
      domesticDailyAllowance: 0,
      domesticAccommodation: 0,
      domesticTransportation: 0,
      overseasDailyAllowance: 0,
      overseasAccommodation: 0,
      overseasTransportation: 0,
      overseasPreparationFee: 0
    };
    setData(prev => ({
      ...prev,
      positions: [...prev.positions, newPosition]
    }));
  };

  const updatePosition = (id: string, field: keyof Position, value: any) => {
    setData(prev => ({
      ...prev,
      positions: prev.positions.map(pos => 
        pos.id === id ? { ...pos, [field]: value } : pos
      )
    }));
  };

  const removePosition = (id: string) => {
    if (data.positions.length > 1) {
      setData(prev => ({
        ...prev,
        positions: prev.positions.filter(pos => pos.id !== id)
      }));
    }
  };

  const updateArticle4WithDistance = () => {
    setData(prev => ({
      ...prev,
      customArticles: {
        ...prev.customArticles,
        article4: `出張とは、従業員が自宅または通常の勤務地を起点として、片道（${prev.distanceThreshold}）ｋｍ以上の目的地に移動し、職務を遂行するものをいう。`
      }
    }));
  };

  const updateArticle11WithDate = () => {
    const date = new Date(data.companyInfo.establishedDate);
    const era = date.getFullYear() >= 2019 ? '令和' : '平成';
    const eraYear = date.getFullYear() >= 2019 ? date.getFullYear() - 2018 : date.getFullYear() - 1988;
    
    setData(prev => ({
      ...prev,
      customArticles: {
        ...prev.customArticles,
        article11: `本規程は、${era}${eraYear}年${date.getMonth() + 1}月${date.getDate()}日より実施する。`
      }
    }));
  };

  const handleSave = () => {
    const savedRegulations = JSON.parse(localStorage.getItem('travelRegulations') || '[]');
    
    const newRegulation = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      version: `v${data.companyInfo.revision}.0`,
      status: 'active'
    };
    
    savedRegulations.push(newRegulation);
    localStorage.setItem('travelRegulations', JSON.stringify(savedRegulations));
    
    alert('出張規程が保存されました！');
    onNavigate('travel-regulation-management');
  };

  const generateDocument = (format: 'word' | 'pdf') => {
    alert(`${format.toUpperCase()}ファイルを生成中...`);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">会社情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            会社名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.companyInfo.name}
            onChange={(e) => setData(prev => ({ 
              ...prev, 
              companyInfo: { ...prev.companyInfo, name: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            placeholder="株式会社サンプル"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            代表者名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.companyInfo.representative}
            onChange={(e) => setData(prev => ({ 
              ...prev, 
              companyInfo: { ...prev.companyInfo, representative: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            placeholder="代表取締役 山田太郎"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            住所 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.companyInfo.address}
            onChange={(e) => setData(prev => ({ 
              ...prev, 
              companyInfo: { ...prev.companyInfo, address: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            placeholder="東京都千代田区丸の内1-1-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            制定日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={data.companyInfo.establishedDate}
            onChange={(e) => {
              setData(prev => ({ 
                ...prev, 
                companyInfo: { ...prev.companyInfo, establishedDate: e.target.value }
              }));
              // 日付変更時に第11条を自動更新
              setTimeout(() => updateArticle11WithDate(), 0);
            }}
            onBlur={updateArticle11WithDate}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">改訂版</label>
          <input
            type="number"
            value={data.companyInfo.revision}
            onChange={(e) => setData(prev => ({ 
              ...prev, 
              companyInfo: { ...prev.companyInfo, revision: parseInt(e.target.value) || 1 }
            }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            min="1"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">基本設定</h2>
      
      {/* 出張の定義 */}
      <div className="bg-white/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">出張の定義</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            出張の距離基準 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={data.distanceThreshold}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setData(prev => ({ ...prev, distanceThreshold: value }));
              }}
              onBlur={updateArticle4WithDistance}
              className="w-32 px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
              min="1"
              required
            />
            <span className="text-slate-700 font-medium">km以上</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            この距離以上の移動を出張として定義します
          </p>
        </div>
      </div>

      {/* 実費精算設定 */}
      <div className="bg-white/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">実費精算設定</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.isTransportationRealExpense}
              onChange={(e) => setData(prev => ({ ...prev, isTransportationRealExpense: e.target.checked }))}
              className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
            />
            <div>
              <span className="text-slate-700 font-medium">交通費を実費精算とする</span>
              <p className="text-xs text-slate-500">チェックすると交通費は実際にかかった費用を精算します</p>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.isAccommodationRealExpense}
              onChange={(e) => setData(prev => ({ ...prev, isAccommodationRealExpense: e.target.checked }))}
              className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
            />
            <div>
              <span className="text-slate-700 font-medium">宿泊料を実費精算とする</span>
              <p className="text-xs text-slate-500">チェックすると宿泊料は実際にかかった費用を精算します</p>
            </div>
          </label>
        </div>
      </div>

      {/* 海外出張設定 */}
      <div className="bg-white/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">海外出張設定</h3>
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!data.usePreparationFee}
              onChange={(e) => setData(prev => ({ ...prev, usePreparationFee: !e.target.checked }))}
              className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2 mt-0.5"
            />
            <div className="text-sm text-slate-700">
              <span>支度料を使用しない</span>
              <p className="text-xs text-slate-500">チェックすると支度料は0円として設定されます</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">旅費一覧表設定</h2>
        <button
          type="button"
          onClick={addPosition}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>役職追加</span>
        </button>
      </div>

      {/* タブナビゲーション */}
      <div className="flex space-x-1 bg-white/30 rounded-lg p-1 mb-6">
        <button
          onClick={() => setAllowanceTab('domestic')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            allowanceTab === 'domestic'
              ? 'bg-navy-600 text-white shadow-lg'
              : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
          }`}
        >
          国内出張
        </button>
        <button
          onClick={() => setAllowanceTab('overseas')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            allowanceTab === 'overseas'
              ? 'bg-navy-600 text-white shadow-lg'
              : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
          }`}
        >
          海外出張
        </button>
      </div>

      {/* 国内出張設定 */}
      {allowanceTab === 'domestic' && (
        <div className="bg-white/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">国内出張旅費設定</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">役職</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">出張日当</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    {data.isAccommodationRealExpense ? '宿泊料(実費)' : '宿泊料'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    {data.isTransportationRealExpense ? '交通費(実費)' : '交通費'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((position) => (
                  <tr key={position.id} className="border-b border-white/20">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={position.name}
                        onChange={(e) => updatePosition(position.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.domesticDailyAllowance}
                        onChange={(e) => updatePosition(position.id, 'domesticDailyAllowance', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 text-center"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.domesticAccommodation}
                        onChange={(e) => updatePosition(position.id, 'domesticAccommodation', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-navy-400 ${
                          data.isAccommodationRealExpense 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                            : 'bg-white/50 border-white/40 text-slate-700'
                        }`}
                        disabled={data.isAccommodationRealExpense}
                        placeholder={data.isAccommodationRealExpense ? '実費' : '0'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.domesticTransportation}
                        onChange={(e) => updatePosition(position.id, 'domesticTransportation', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-navy-400 ${
                          data.isTransportationRealExpense 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                            : 'bg-white/50 border-white/40 text-slate-700'
                        }`}
                        disabled={data.isTransportationRealExpense}
                        placeholder={data.isTransportationRealExpense ? '実費' : '0'}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {data.positions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePosition(position.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 海外出張設定 */}
      {allowanceTab === 'overseas' && (
        <div className="bg-white/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">海外出張旅費設定</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">役職</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">出張日当</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    {data.isAccommodationRealExpense ? '宿泊料(実費)' : '宿泊料'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">支度料</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    {data.isTransportationRealExpense ? '交通費(実費)' : '交通費'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((position) => (
                  <tr key={position.id} className="border-b border-white/20">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={position.name}
                        onChange={(e) => updatePosition(position.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.overseasDailyAllowance}
                        onChange={(e) => updatePosition(position.id, 'overseasDailyAllowance', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 text-center"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.overseasAccommodation}
                        onChange={(e) => updatePosition(position.id, 'overseasAccommodation', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-navy-400 ${
                          data.isAccommodationRealExpense 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                            : 'bg-white/50 border-white/40 text-slate-700'
                        }`}
                        disabled={data.isAccommodationRealExpense}
                        placeholder={data.isAccommodationRealExpense ? '実費' : '0'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.overseasPreparationFee}
                        onChange={(e) => updatePosition(position.id, 'overseasPreparationFee', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-navy-400 ${
                          !data.usePreparationFee 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                            : 'bg-white/50 border-white/40 text-slate-700'
                        }`}
                        disabled={!data.usePreparationFee}
                        placeholder={!data.usePreparationFee ? '使用しない' : '0'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={position.overseasTransportation}
                        onChange={(e) => updatePosition(position.id, 'overseasTransportation', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-navy-400 ${
                          data.isTransportationRealExpense 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                            : 'bg-white/50 border-white/40 text-slate-700'
                        }`}
                        disabled={data.isTransportationRealExpense}
                        placeholder={data.isTransportationRealExpense ? '実費' : '0'}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {data.positions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePosition(position.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">条文カスタマイズ</h2>
      
      <div className="space-y-6">
        {[
          { key: 'article1', title: '第１条（目的）' },
          { key: 'article2', title: '第２条（適用範囲）' },
          { key: 'article3', title: '第３条（旅費の種類）' },
          { key: 'article4', title: '第４条（出張の定義）' },
          { key: 'article5', title: '第５条（出張の承認）' },
          { key: 'article6', title: '第６条（出張の区分）' },
          { key: 'article7', title: '第７条（旅費一覧）' },
          { key: 'article8', title: '第８条（交通機関）' },
          { key: 'article9', title: '第９条（旅費の支給方法）' },
          { key: 'article10', title: '第１０条（規程の改廃）' },
          { key: 'article11', title: '第１１条（附則）' }
        ].map(({ key, title }) => (
          <div key={key} className="bg-white/30 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">{title}</label>
            <textarea
              value={data.customArticles[key as keyof typeof data.customArticles]}
              onChange={(e) => setData(prev => ({ 
                ...prev, 
                customArticles: { 
                  ...prev.customArticles, 
                  [key]: e.target.value 
                }
              }))}
              className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl text-sm"
              rows={key === 'article6' ? 8 : key === 'article8' ? 3 : 2}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">出張旅費規程</h2>
        <div className="text-right text-slate-600 text-sm">
          <p>{data.companyInfo.address}</p>
          <p className="font-semibold text-lg mt-2">{data.companyInfo.name}</p>
          <p>{data.companyInfo.representative}</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-lg p-8 text-slate-800 text-sm leading-relaxed">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">（目的）</h3>
            <p>第１条　{data.customArticles.article1}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（適用範囲）</h3>
            <p>第２条　{data.customArticles.article2}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（旅費の種類）</h3>
            <p>第３条　{data.customArticles.article3}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（出張の定義）</h3>
            <p>第４条　{data.customArticles.article4.replace('（　　）', `（${data.distanceThreshold}）`)}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（出張の承認）</h3>
            <p>第５条　{data.customArticles.article5}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（出張の区分）</h3>
            <p className="whitespace-pre-line">第６条　{data.customArticles.article6}</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">（旅費一覧）</h3>
            <p className="mb-4">第７条　{data.customArticles.article7}</p>
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 py-2 px-3 text-center" rowSpan={2}>役職</th>
                    <th className="border border-slate-300 py-2 px-3 text-center" colSpan={3}>国内出張</th>
                    <th className="border border-slate-300 py-2 px-3 text-center" colSpan={4}>海外出張</th>
                  </tr>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 py-1 px-2 text-center">出張日当</th>
                    <th className="border border-slate-300 py-1 px-2 text-center">宿泊料</th>
                    <th className="border border-slate-300 py-1 px-2 text-center">交通費</th>
                    <th className="border border-slate-300 py-1 px-2 text-center">出張日当</th>
                    <th className="border border-slate-300 py-1 px-2 text-center">宿泊料</th>
                    <th className="border border-slate-300 py-1 px-2 text-center">交通費</th>
                    <th className="border border-slate-300 py-1 px-2 text-center">支度料</th>
                  </tr>
                </thead>
                <tbody>
                  {data.positions.map((position) => (
                    <tr key={position.id}>
                      <td className="border border-slate-300 py-2 px-3 font-medium">{position.name}</td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {position.domesticDailyAllowance.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {data.isAccommodationRealExpense ? '実費' : position.domesticAccommodation.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {data.isTransportationRealExpense ? '実費' : position.domesticTransportation.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {position.overseasDailyAllowance.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {data.isAccommodationRealExpense ? '実費' : position.overseasAccommodation.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {data.isTransportationRealExpense ? '実費' : position.overseasTransportation.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-center">
                        {data.usePreparationFee ? position.overseasPreparationFee.toLocaleString() : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-right mt-2 text-xs">（円）</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（交通機関）</h3>
            <p className="whitespace-pre-line">第８条　{data.customArticles.article8}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（旅費の支給方法）</h3>
            <p>第９条　{data.customArticles.article9}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（規程の改廃）</h3>
            <p>第１０条　{data.customArticles.article10}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">（附則）</h3>
            <p>第１１条　{data.customArticles.article11}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return data.companyInfo.name && data.companyInfo.representative && data.companyInfo.address;
      case 2:
        return data.distanceThreshold > 0;
      case 3:
        return data.positions.every(pos => pos.name && pos.domesticDailyAllowance >= 0);
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

        <div className="flex h-screen relative">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="travel-regulation-creation" />
          </div>

          {isSidebarOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={toggleSidebar}
              />
              <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="travel-regulation-creation" />
              </div>
            </>
          )}

          <div className="flex-1 flex flex-col min-w-0">
            <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
            
            <div className="flex-1 overflow-auto p-4 lg:p-6 relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>編集に戻る</span>
                    </button>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">規程プレビュー</h1>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => generateDocument('word')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-200"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Word生成</span>
                    </button>
                    <button
                      onClick={() => generateDocument('pdf')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF生成</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Save className="w-5 h-5" />
                      <span>規程を保存</span>
                    </button>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-8 border border-white/30 shadow-xl">
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="travel-regulation-creation" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="travel-regulation-creation" />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
          
          <div className="flex-1 overflow-auto p-4 lg:p-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('travel-regulation-management')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">出張規程作成</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-600">
                    ステップ {currentStep}/4
                  </div>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>プレビュー</span>
                  </button>
                </div>
              </div>

              {/* 進捗ゲージ */}
              <div className="w-full bg-white/30 rounded-full h-2 backdrop-blur-sm mb-8">
                <div 
                  className="bg-gradient-to-r from-navy-600 to-navy-800 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>

              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 lg:p-8 border border-white/30 shadow-xl mb-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </div>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentStep === 1
                      ? 'bg-white/30 text-slate-400 cursor-not-allowed'
                      : 'bg-white/50 hover:bg-white/70 text-slate-700 backdrop-blur-sm'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>戻る</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!isStepComplete()}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      !isStepComplete()
                        ? 'bg-white/30 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white shadow-lg'
                    }`}
                  >
                    <span>次へ</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
                  >
                    <Eye className="w-5 h-5" />
                    <span>プレビュー</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelRegulationCreation;