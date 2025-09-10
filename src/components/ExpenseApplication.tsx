import React, { useState } from 'react';
import { Save, Upload, Camera, FileText, Plus, Trash2, CheckCircle, Edit } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface ExpenseApplicationProps {
  onNavigate: (view: 'dashboard' | 'business-trip' | 'expense') => void;
}

interface ExpenseItem {
  id: string;
  category: string;
  date: string;
  amount: number;
  description: string;
  store: string;
  receipt?: File;
  ocrResult?: {
    store: string;
    date: string;
    amount: number;
    confidence: number;
  };
  ocrProcessed: boolean;
}

function ExpenseApplication({ onNavigate }: ExpenseApplicationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<string>('');
  const [ocrResult, setOcrResult] = useState({
    store: '',
    date: '',
    amount: 0,
    confidence: 0
  });
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const categories = ['旅費交通費', '接待交際費', '通信費', '消耗品費', '広告宣伝費', '福利厚生費', '雑費（その他）'];

  const createNewExpenseFromOCR = (file: File) => {
    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      category: '交通費',
      date: '',
      amount: 0,
      description: '',
      store: '',
      receipt: file,
      ocrProcessed: false
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense.id;
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: any) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleReceiptUpload = (file: File) => {
    const expenseId = createNewExpenseFromOCR(file);
    setCurrentExpenseId(expenseId);
    setIsProcessingOCR(true);
    
    // OCR処理をシミュレート
    setTimeout(() => {
      const mockOCRResult = {
        store: generateMockStoreName(),
        date: generateMockDate(),
        amount: Math.floor(Math.random() * 10000) + 500,
        confidence: Math.floor(Math.random() * 30) + 70 // 70-99%の信頼度
      };
      
      setOcrResult(mockOCRResult);
      setIsProcessingOCR(false);
      setShowOCRModal(true);
    }, 2000);
  };

  const generateMockStoreName = () => {
    const stores = [
      'セブンイレブン 新宿店',
      'ファミリーマート 渋谷店',
      'JR東日本',
      'タクシー会社',
      'ホテルニューオータニ',
      'スターバックス 丸の内店',
      'ガソリンスタンド ENEOS',
      'コンビニエンスストア'
    ];
    return stores[Math.floor(Math.random() * stores.length)];
  };

  const generateMockDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const date = new Date(today.getTime() - randomDays * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  };

  const confirmOCRResult = () => {
    updateExpense(currentExpenseId, 'ocrResult', ocrResult);
    updateExpense(currentExpenseId, 'date', ocrResult.date);
    updateExpense(currentExpenseId, 'amount', ocrResult.amount);
    updateExpense(currentExpenseId, 'store', ocrResult.store);
    updateExpense(currentExpenseId, 'ocrProcessed', true);
    
    // カテゴリの自動推定
    const storeName = ocrResult.store.toLowerCase();
    let suggestedCategory = '雑費（その他）';
    if (storeName.includes('jr') || storeName.includes('タクシー') || storeName.includes('電車') || storeName.includes('新幹線') || storeName.includes('バス')) {
      suggestedCategory = '旅費交通費';
    } else if (storeName.includes('ホテル') || storeName.includes('宿泊') || storeName.includes('旅館')) {
      suggestedCategory = '旅費交通費';
    } else if (storeName.includes('レストラン') || storeName.includes('居酒屋') || storeName.includes('カフェ') || storeName.includes('料理')) {
      suggestedCategory = '接待交際費';
    } else if (storeName.includes('docomo') || storeName.includes('au') || storeName.includes('softbank') || storeName.includes('通信')) {
      suggestedCategory = '通信費';
    } else if (storeName.includes('文具') || storeName.includes('オフィス') || storeName.includes('用品')) {
      suggestedCategory = '消耗品費';
    } else if (storeName.includes('広告') || storeName.includes('宣伝') || storeName.includes('印刷')) {
      suggestedCategory = '広告宣伝費';
    } else if (storeName.includes('健康') || storeName.includes('福利') || storeName.includes('保険')) {
      suggestedCategory = '福利厚生費';
    }
    updateExpense(currentExpenseId, 'category', suggestedCategory);
    
    setShowOCRModal(false);
  };

  const editOCRResult = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense?.ocrResult) {
      setCurrentExpenseId(expenseId);
      setOcrResult(expense.ocrResult);
      setShowOCRModal(true);
    }
  };

  const handleCameraCapture = () => {
    // カメラ機能をシミュレート
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 背面カメラを使用
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleReceiptUpload(file);
      }
    };
    input.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleReceiptUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (expenses.length === 0) {
      alert('経費項目を追加してください');
      return;
    }

    const unprocessedExpenses = expenses.filter(e => !e.ocrProcessed);
    if (unprocessedExpenses.length > 0) {
      alert('OCR処理が完了していない項目があります');
      return;
    }

    console.log('経費申請データ:', expenses);
    alert('経費申請が送信されました！');
    onNavigate('dashboard');
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="expense" />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="expense" />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
          
          <div className="flex-1 overflow-auto p-4 lg:p-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-8">経費申請</h1>

              {/* 領収書アップロード（メイン機能） */}
              {expenses.length === 0 && (
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-8 border border-white/30 shadow-xl mb-6">
                  <div className="text-center mb-6">
                    <Upload className="w-16 h-16 text-navy-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-800 mb-2">領収書をアップロードして開始</h2>
                    <p className="text-slate-600">領収書の写真を撮影するか、ファイルをアップロードしてください</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleCameraCapture}
                      className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Camera className="w-12 h-12 mb-3" />
                      <span className="text-lg">カメラで撮影</span>
                      <span className="text-sm text-emerald-100 mt-1">領収書を撮影してOCR処理</span>
                    </button>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload-main"
                      />
                      <label
                        htmlFor="file-upload-main"
                        className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-navy-600 to-navy-800 hover:from-navy-700 hover:to-navy-900 text-white rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 cursor-pointer h-full"
                      >
                        <Upload className="w-12 h-12 mb-3" />
                        <span className="text-lg">ファイルアップロード</span>
                        <span className="text-sm text-navy-100 mt-1">画像・PDFファイルを選択</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR処理中の表示 */}
              {isProcessingOCR && (
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-8 border border-white/30 shadow-xl mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center animate-pulse">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">OCR処理中...</h3>
                    <p className="text-slate-600">領収書から情報を読み取っています</p>
                  </div>
                </div>
              )}

              {/* 経費項目一覧 */}
              {expenses.length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-slate-800">経費項目一覧</h2>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleCameraCapture}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-900 transition-all duration-200"
                        >
                          <Camera className="w-4 h-4" />
                          <span>追加撮影</span>
                        </button>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload-additional"
                          />
                          <label
                            htmlFor="file-upload-additional"
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>追加アップロード</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="bg-white/30 rounded-lg p-6 backdrop-blur-sm border border-white/20">
                          {/* OCR結果表示 */}
                          {expense.ocrResult && (
                            <div className="mb-4 p-4 bg-emerald-50/50 border border-emerald-200/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  <span className="font-medium text-emerald-800">OCR読み取り完了</span>
                                  <span className="text-xs text-emerald-600">
                                    信頼度: {expense.ocrResult.confidence}%
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => editOCRResult(expense.id)}
                                  className="flex items-center space-x-1 px-3 py-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50 rounded transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span className="text-xs">修正</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-emerald-600 font-medium">店舗名:</span>
                                  <p className="text-slate-700">{expense.ocrResult.store}</p>
                                </div>
                                <div>
                                  <span className="text-emerald-600 font-medium">日付:</span>
                                  <p className="text-slate-700">{expense.ocrResult.date}</p>
                                </div>
                                <div>
                                  <span className="text-emerald-600 font-medium">金額:</span>
                                  <p className="text-slate-700">¥{expense.ocrResult.amount.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 領収書プレビュー */}
                          {expense.receipt && (
                            <div className="mb-4 p-4 bg-white/30 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-slate-600" />
                                  <div>
                                    <p className="font-medium text-slate-800">{expense.receipt.name}</p>
                                    <p className="text-xs text-slate-600">
                                      {(expense.receipt.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                {!expense.ocrProcessed && (
                                  <div className="flex items-center space-x-2 text-amber-600">
                                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm">処理中...</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 入力フォーム */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                種別 <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={expense.category}
                                onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                                className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl text-sm"
                                required
                              >
                                {categories.map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                日付 <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={expense.date}
                                onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                                className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                金額（円） <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={expense.amount || ''}
                                onChange={(e) => updateExpense(expense.id, 'amount', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                                placeholder="0"
                                required
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeExpense(expense.id)}
                                className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>削除</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                店舗名・企業名
                              </label>
                              <input
                                type="text"
                                value={expense.store}
                                onChange={(e) => updateExpense(expense.id, 'store', e.target.value)}
                                className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                                placeholder="店舗名や企業名"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                説明・備考
                              </label>
                              <input
                                type="text"
                                value={expense.description}
                                onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                                placeholder="経費の詳細を入力してください"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 合計金額 */}
                    {expenses.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-navy-600 to-navy-800 rounded-lg text-white">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium">合計金額</span>
                          <span className="text-2xl font-bold">¥{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-navy-100 mt-1">
                          {expenses.length}件の経費項目
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 送信ボタン */}
                  {expenses.length > 0 && (
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => onNavigate('dashboard')}
                        className="px-6 py-3 bg-white/50 hover:bg-white/70 text-slate-700 rounded-lg font-medium transition-colors backdrop-blur-sm"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                      >
                        <Save className="w-5 h-5" />
                        <span>申請を送信</span>
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OCR結果確認・修正モーダル */}
      {showOCRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">OCR読み取り結果の確認</h3>
            <p className="text-sm text-slate-600 mb-4">
              読み取り結果を確認し、必要に応じて修正してください
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">店舗名・企業名</label>
                <input
                  type="text"
                  value={ocrResult.store}
                  onChange={(e) => setOcrResult(prev => ({ ...prev, store: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">日付</label>
                <input
                  type="date"
                  value={ocrResult.date}
                  onChange={(e) => setOcrResult(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">金額（円）</label>
                <input
                  type="number"
                  value={ocrResult.amount}
                  onChange={(e) => setOcrResult(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                />
              </div>
              
              {ocrResult.confidence < 80 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-700 text-sm">
                    <span className="font-medium">注意:</span> 
                    読み取り精度が{ocrResult.confidence}%です。内容をよく確認してください。
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  // OCR結果を破棄して項目を削除
                  removeExpense(currentExpenseId);
                  setShowOCRModal(false);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={confirmOCRResult}
                className="px-6 py-2 bg-navy-600 hover:bg-navy-700 text-white rounded-lg transition-colors"
              >
                確定して追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseApplication;