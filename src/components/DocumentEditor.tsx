import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, FileText, Calendar, MapPin, Users, Building, Plus, Trash2, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DocumentEditorProps {
  onNavigate: (view: string) => void;
  documentType: 'business-report' | 'expense-report';
  businessTripId: string;
}

interface BusinessReportData {
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  location: string;
  visitTarget: string;
  companions: string;
  actionAndResults: string;
}

interface ExpenseReportData {
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  location: string;
  visitTarget: string;
  selectedExpenses: string[];
  dailyAllowance: number;
  availableExpenses: Array<{
    id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
    store: string;
    description: string;
  }>;
}

function DocumentEditor({ onNavigate, documentType, businessTripId }: DocumentEditorProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [businessReportData, setBusinessReportData] = useState<BusinessReportData>({
    title: '',
    purpose: '',
    startDate: '',
    endDate: '',
    location: '',
    visitTarget: '',
    companions: '',
    actionAndResults: ''
  });

  const [expenseReportData, setExpenseReportData] = useState<ExpenseReportData>({
    title: '',
    purpose: '',
    startDate: '',
    endDate: '',
    location: '',
    visitTarget: '',
    selectedExpenses: [],
    dailyAllowance: 0,
    availableExpenses: []
  });

  const [includeTravelExpenses, setIncludeTravelExpenses] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    // 出張申請データから自動入力
    const businessTrips = [
      {
        id: 'BT-2024-001',
        title: '東京出張',
        purpose: 'クライアント訪問および新規開拓営業',
        startDate: '2024-07-25',
        endDate: '2024-07-27',
        location: '東京都港区',
        visitTarget: '株式会社サンプル',
        companions: '田中部長',
        estimatedAmount: 52500
      }
    ];

    const trip = businessTrips.find(t => t.id === businessTripId);
    if (trip) {
      if (documentType === 'business-report') {
        setBusinessReportData({
          title: trip.title,
          purpose: trip.purpose,
          startDate: trip.startDate,
          endDate: trip.endDate,
          location: trip.location,
          visitTarget: trip.visitTarget,
          companions: trip.companions,
          actionAndResults: ''
        });
      } else if (documentType === 'expense-report') {
        // 利用可能な経費申請を取得（空の配列で初期化）
        const availableExpenses: Array<{
          id: string;
          title: string;
          amount: number;
          date: string;
          category: string;
          store: string;
          description: string;
        }> = [];

        setExpenseReportData({
          title: trip.title,
          purpose: trip.purpose,
          startDate: trip.startDate,
          endDate: trip.endDate,
          location: trip.location,
          visitTarget: trip.visitTarget,
          selectedExpenses: [],
          dailyAllowance: trip.estimatedAmount,
          availableExpenses
        });
      }
    }
  }, [businessTripId, documentType]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSave = () => {
    alert('書類が下書き保存されました！');
    onNavigate('document-management');
  };

  const handleSubmit = () => {
    if (documentType === 'business-report') {
      if (!businessReportData.actionAndResults.trim()) {
        alert('行動と成果を入力してください');
        return;
      }
      // 出張報告書を保存して出張経費精算書作成画面に遷移
      alert('出張報告書が保存されました');
      // 確実に出張経費精算書作成画面に遷移
      setTimeout(() => {
        localStorage.setItem('editingBusinessTripId', businessTripId);
        localStorage.setItem('editingDocumentType', 'expense-report');
        onNavigate('document-editor');
      }, 100);
    } else {
      if (includeTravelExpenses && expenseReportData.selectedExpenses.length === 0) {
        alert('出張経費を追加する場合は、旅費項目を選択してください');
        return;
      }
      // 出張経費精算書の場合は提出方法選択モーダルを表示
      setShowSubmissionModal(true);
    }
  };

  const toggleExpenseSelection = (expenseId: string) => {
    setExpenseReportData(prev => ({
      ...prev,
      selectedExpenses: prev.selectedExpenses.includes(expenseId)
        ? prev.selectedExpenses.filter(id => id !== expenseId)
        : [...prev.selectedExpenses, expenseId]
    }));
  };

  const getSelectedExpensesTotal = () => {
    return expenseReportData.availableExpenses
      .filter(exp => expenseReportData.selectedExpenses.includes(exp.id))
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const renderBusinessReportForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessReportData.title}
            onChange={(e) => setBusinessReportData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            訪問先（企業名等） <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessReportData.visitTarget}
            onChange={(e) => setBusinessReportData(prev => ({ ...prev, visitTarget: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          出張目的 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={businessReportData.purpose}
          onChange={(e) => setBusinessReportData(prev => ({ ...prev, purpose: e.target.value }))}
          className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            出発日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={businessReportData.startDate}
            onChange={(e) => setBusinessReportData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            帰着日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={businessReportData.endDate}
            onChange={(e) => setBusinessReportData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            出張場所 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessReportData.location}
            onChange={(e) => setBusinessReportData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            同行者
          </label>
          <input
            type="text"
            value={businessReportData.companions}
            onChange={(e) => setBusinessReportData(prev => ({ ...prev, companions: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          行動と成果 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={businessReportData.actionAndResults}
          onChange={(e) => setBusinessReportData(prev => ({ ...prev, actionAndResults: e.target.value }))}
          className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          rows={8}
          placeholder="出張で行った具体的な行動と得られた成果を詳しく記載してください"
          required
        />
      </div>
    </div>
  );

  const renderExpenseReportForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={expenseReportData.title}
            onChange={(e) => setExpenseReportData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            訪問先（企業名等） <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={expenseReportData.visitTarget}
            onChange={(e) => setExpenseReportData(prev => ({ ...prev, visitTarget: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          出張目的 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={expenseReportData.purpose}
          onChange={(e) => setExpenseReportData(prev => ({ ...prev, purpose: e.target.value }))}
          className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            出発日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={expenseReportData.startDate}
            onChange={(e) => setExpenseReportData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            帰着日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={expenseReportData.endDate}
            onChange={(e) => setExpenseReportData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          出張場所 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={expenseReportData.location}
          onChange={(e) => setExpenseReportData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          required
        />
      </div>

      {/* 旅費選択 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="include-travel-expenses"
            checked={includeTravelExpenses}
            onChange={(e) => setIncludeTravelExpenses(e.target.checked)}
            className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
          />
          <label htmlFor="include-travel-expenses" className="text-sm font-medium text-slate-700 cursor-pointer">
            出張経費を追加
          </label>
        </div>
        
        {includeTravelExpenses && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-4">
              旅費
            </label>
            
            {/* 手動入力フォーム */}
            <div className="bg-white/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-slate-800">旅費入力</h4>
                <button
                  type="button"
                  onClick={() => {
                    // 申請済経費から選択する機能
                    alert('申請済経費から選択機能を実装予定');
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg text-sm font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200"
                >
                  <span>+ 申請済経費から選択</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">項目名</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    placeholder="例：新幹線代（往復）"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">金額（円）</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">日付</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">店舗名</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    placeholder="例：JR東日本"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">説明</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    placeholder="経費の詳細説明"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-900 transition-all duration-200"
                >
                  <span>追加</span>
                </button>
              </div>
            </div>

            {/* 申請済経費から選択 */}
            <div className="space-y-3">
              {expenseReportData.availableExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    expenseReportData.selectedExpenses.includes(expense.id)
                      ? 'border-navy-500 bg-navy-50/30'
                      : 'border-white/40 bg-white/30 hover:border-white/60'
                  }`}
                  onClick={() => toggleExpenseSelection(expense.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <input
                          type="checkbox"
                          checked={expenseReportData.selectedExpenses.includes(expense.id)}
                          onChange={() => toggleExpenseSelection(expense.id)}
                          className="w-5 h-5 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                        />
                        <h4 className="font-medium text-slate-800">{expense.title}</h4>
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-100">
                          {expense.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 ml-8">
                        <div>
                          <span className="font-medium">日付:</span> {expense.date}
                        </div>
                        <div>
                          <span className="font-medium">店舗:</span> {expense.store}
                        </div>
                        <div>
                          <span className="font-medium">説明:</span> {expense.description}
                        </div>
                        <div>
                          <span className="font-medium">金額:</span> ¥{expense.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 日当 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          日当 <span className="text-red-500">*</span>
        </label>
        <div className="bg-white/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">出張申請に基づいた日当</span>
            <span className="text-2xl font-bold text-slate-800">¥{expenseReportData.dailyAllowance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 合計金額 */}
      <div className="bg-gradient-to-r from-navy-600 to-navy-800 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-navy-100 text-sm mb-1">旅費</p>
            <p className="text-2xl font-bold">¥{includeTravelExpenses ? getSelectedExpensesTotal().toLocaleString() : '0'}</p>
          </div>
          <div>
            <p className="text-navy-100 text-sm mb-1">日当</p>
            <p className="text-2xl font-bold">¥{expenseReportData.dailyAllowance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-navy-100 text-sm mb-1">合計精算額</p>
            <p className="text-3xl font-bold">¥{((includeTravelExpenses ? getSelectedExpensesTotal() : 0) + expenseReportData.dailyAllowance).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    if (documentType === 'business-report') {
      return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4">出張報告書</h1>
            <div className="text-sm text-slate-600">
              <p>作成日：{new Date().toLocaleDateString('ja-JP')}</p>
            </div>
          </div>
          
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>タイトル：</strong>{businessReportData.title}</div>
              <div><strong>訪問先：</strong>{businessReportData.visitTarget}</div>
              <div><strong>出張期間：</strong>{businessReportData.startDate} ～ {businessReportData.endDate}</div>
              <div><strong>出張場所：</strong>{businessReportData.location}</div>
              <div className="col-span-2"><strong>同行者：</strong>{businessReportData.companions || 'なし'}</div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">出張目的</h3>
              <div className="bg-slate-50 p-3 rounded">{businessReportData.purpose}</div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">行動と成果</h3>
              <div className="bg-slate-50 p-3 rounded whitespace-pre-wrap">{businessReportData.actionAndResults}</div>
            </div>
          </div>
        </div>
      );
    } else {
      const selectedExpenses = expenseReportData.availableExpenses.filter(exp => 
        expenseReportData.selectedExpenses.includes(exp.id)
      );
      
      return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4">出張経費精算書</h1>
            <div className="text-sm text-slate-600">
              <p>作成日：{new Date().toLocaleDateString('ja-JP')}</p>
            </div>
          </div>
          
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>タイトル：</strong>{expenseReportData.title}</div>
              <div><strong>訪問先：</strong>{expenseReportData.visitTarget}</div>
              <div><strong>出張期間：</strong>{expenseReportData.startDate} ～ {expenseReportData.endDate}</div>
              <div><strong>出張場所：</strong>{expenseReportData.location}</div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">出張目的</h3>
              <div className="bg-slate-50 p-3 rounded">{expenseReportData.purpose}</div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">旅費明細</h3>
              <table className="w-full border border-slate-300">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 py-2 px-3 text-left">項目</th>
                    <th className="border border-slate-300 py-2 px-3 text-left">日付</th>
                    <th className="border border-slate-300 py-2 px-3 text-left">店舗</th>
                    <th className="border border-slate-300 py-2 px-3 text-right">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="border border-slate-300 py-2 px-3">{expense.description}</td>
                      <td className="border border-slate-300 py-2 px-3">{expense.date}</td>
                      <td className="border border-slate-300 py-2 px-3">{expense.store}</td>
                      <td className="border border-slate-300 py-2 px-3 text-right">¥{expense.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-bold">日当</td>
                    <td className="border border-slate-300 py-2 px-3">-</td>
                    <td className="border border-slate-300 py-2 px-3">-</td>
                    <td className="border border-slate-300 py-2 px-3 text-right font-bold">¥{expenseReportData.dailyAllowance.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-100">
                    <td className="border border-slate-300 py-2 px-3 font-bold" colSpan={3}>合計</td>
                    <td className="border border-slate-300 py-2 px-3 text-right font-bold">
                      ¥{((includeTravelExpenses ? getSelectedExpensesTotal() : 0) + expenseReportData.dailyAllowance).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  };

  const getDocumentTitle = () => {
    return documentType === 'business-report' ? '出張報告書作成' : '出張経費精算書作成';
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

        <div className="flex h-screen relative">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="document-management" />
          </div>

          {isSidebarOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={toggleSidebar}
              />
              <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="document-management" />
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
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">プレビュー</h1>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                  {renderPreview()}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-3 bg-white/50 hover:bg-white/70 text-slate-700 rounded-lg font-medium transition-colors backdrop-blur-sm"
                  >
                    編集に戻る
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                  >
                    {documentType === 'business-report' ? (
                      <>
                        <Send className="w-5 h-5" />
                        <span>保存して出張経費精算書を作成</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>報告書・精算書を提出</span>
                      </>
                    )}
                  </button>
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
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="document-management" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="document-management" />
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
                    onClick={() => onNavigate('document-management')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{getDocumentTitle()}</h1>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>プレビュー</span>
                  </button>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                {documentType === 'business-report' ? renderBusinessReportForm() : renderExpenseReportForm()}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => onNavigate('document-management')}
                  className="px-6 py-3 bg-white/50 hover:bg-white/70 text-slate-700 rounded-lg font-medium transition-colors backdrop-blur-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white rounded-lg font-medium transition-all duration-200"
                >
                  <Save className="w-5 h-5" />
                  <span>下書き保存</span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  {documentType === 'business-report' ? (
                    <>
                      <Send className="w-5 h-5" />
                      <span>続けて出張経費精算書を作成</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>報告書・精算書を提出</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 提出方法選択モーダル */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-navy-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">提出方法を選択</h3>
              <p className="text-slate-600">報告書と精算書の提出方法を選択してください</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSubmissionModal(false);
                  alert('システムで提出されました！');
                  onNavigate('document-management');
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200"
              >
                システムで提出
              </button>
              <button
                onClick={() => {
                  setShowSubmissionModal(false);
                  alert('メールで提出されました！');
                  onNavigate('document-management');
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-900 transition-all duration-200"
              >
                メールで提出
              </button>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="w-full px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentEditor;