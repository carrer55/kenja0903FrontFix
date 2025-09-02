import React, { useState } from 'react';
import { FileText, Calendar, MapPin, Building, Users, CheckCircle, Clock, AlertTriangle, Plus, Eye, Edit } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DocumentManagementProps {
  onNavigate: (view: string, documentType?: string) => void;
}

interface BusinessTrip {
  id: string;
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  location: string;
  visitTarget: string;
  companions: string;
  estimatedAmount: number;
  status: 'approved' | 'completed';
  hasReport: boolean;
  hasExpenseReport: boolean;
  reportSubmitted: boolean;
  expenseReportSubmitted: boolean;
}

function DocumentManagement({ onNavigate }: DocumentManagementProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false);
  const [showExpenseCompleteModal, setShowExpenseCompleteModal] = useState(false);
  const [currentBusinessTripId, setCurrentBusinessTripId] = useState('');

  // サンプルデータ
  const [businessTrips, setBusinessTrips] = useState<BusinessTrip[]>([
    {
      id: 'BT-2024-001',
      title: '東京出張',
      purpose: 'クライアント訪問および新規開拓営業',
      startDate: '2024-07-25',
      endDate: '2024-07-27',
      location: '東京都港区',
      visitTarget: '株式会社サンプル',
      companions: '田中部長',
      estimatedAmount: 52500,
      status: 'completed',
      hasReport: false,
      hasExpenseReport: false,
      reportSubmitted: false,
      expenseReportSubmitted: false
    },
    {
      id: 'BT-2024-002',
      title: '大阪出張',
      purpose: '支社会議参加',
      startDate: '2024-07-20',
      endDate: '2024-07-21',
      location: '大阪府大阪市',
      visitTarget: '大阪支社',
      companions: '',
      estimatedAmount: 35000,
      status: 'completed',
      hasReport: true,
      hasExpenseReport: false,
      reportSubmitted: false,
      expenseReportSubmitted: false
    },
    {
      id: 'BT-2024-003',
      title: '福岡出張',
      purpose: '新規事業説明会',
      startDate: '2024-08-05',
      endDate: '2024-08-06',
      location: '福岡県福岡市',
      visitTarget: '九州商事株式会社',
      companions: '佐藤課長、鈴木主任',
      estimatedAmount: 45000,
      status: 'completed',
      hasReport: true,
      hasExpenseReport: true,
      reportSubmitted: false,
      expenseReportSubmitted: false
    },
    {
      id: 'BT-2024-004',
      title: '名古屋出張',
      purpose: 'システム導入支援',
      startDate: '2024-07-10',
      endDate: '2024-07-12',
      location: '愛知県名古屋市',
      visitTarget: '中部システム株式会社',
      companions: '',
      estimatedAmount: 38000,
      status: 'completed',
      hasReport: true,
      hasExpenseReport: true,
      reportSubmitted: true,
      expenseReportSubmitted: true
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 各カードの件数を計算
  const reportCreationCount = businessTrips.filter(trip => 
    trip.status === 'completed' && !trip.hasReport
  ).length;

  const expenseReportCreationCount = businessTrips.filter(trip => 
    trip.hasReport && !trip.hasExpenseReport
  ).length;

  const submittedCount = businessTrips.filter(trip => 
    trip.reportSubmitted && trip.expenseReportSubmitted
  ).length;

  const createBusinessReport = (businessTripId: string) => {
    localStorage.setItem('editingBusinessTripId', businessTripId);
    localStorage.setItem('editingDocumentType', 'business-report');
    onNavigate('document-editor');
  };

  const createExpenseReport = (businessTripId: string) => {
    localStorage.setItem('editingBusinessTripId', businessTripId);
    localStorage.setItem('editingDocumentType', 'expense-report');
    onNavigate('document-editor');
  };

  const handleReportComplete = (businessTripId: string) => {
    // 出張報告書作成完了時の処理
    setBusinessTrips(prev => prev.map(trip => 
      trip.id === businessTripId ? { ...trip, hasReport: true } : trip
    ));
    setCurrentBusinessTripId(businessTripId);
    setShowReportCompleteModal(true);
  };

  const handleExpenseReportComplete = (businessTripId: string) => {
    // 出張経費精算書作成完了時の処理
    setBusinessTrips(prev => prev.map(trip => 
      trip.id === businessTripId ? { ...trip, hasExpenseReport: true } : trip
    ));
    setCurrentBusinessTripId(businessTripId);
    setShowExpenseCompleteModal(true);
  };

  const handleProceedToExpenseReport = () => {
    setShowReportCompleteModal(false);
    createExpenseReport(currentBusinessTripId);
  };

  const handleSubmitDocuments = () => {
    setShowExpenseCompleteModal(false);
    setBusinessTrips(prev => prev.map(trip => 
      trip.id === currentBusinessTripId 
        ? { ...trip, reportSubmitted: true, expenseReportSubmitted: true } 
        : trip
    ));
    alert('報告書と精算書が提出されました！');
  };

  const handleLaterAction = (modalType: 'report' | 'expense') => {
    if (modalType === 'report') {
      setShowReportCompleteModal(false);
    } else {
      setShowExpenseCompleteModal(false);
    }
  };

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
            <div className="max-w-7xl mx-auto">
              {/* ヘッダー */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">出張精算</h1>
                <p className="text-slate-600">出張報告書と経費精算書の作成・管理</p>
              </div>

              {/* 3つのメインカード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 報告書作成カード */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl text-center hover:bg-white/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">報告書作成</h3>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">{reportCreationCount}件</p>
                  <p className="text-sm text-slate-600">精算書作成可能</p>
                </div>

                {/* 精算書作成カード */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl text-center hover:bg-white/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">精算書作成</h3>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{expenseReportCreationCount}件</p>
                  <p className="text-sm text-slate-600">提出待ち</p>
                </div>

                {/* 提出済カード */}
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl text-center hover:bg-white/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">提出済</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">{submittedCount}件</p>
                  <p className="text-sm text-slate-600">承認待ち・完了</p>
                </div>
              </div>

              {/* 報告書作成が必要な出張一覧 */}
              {reportCreationCount > 0 && (
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">報告書作成</h2>
                        <p className="text-slate-600 text-sm">報告書作成が必要な出張</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessTrips.filter(trip => trip.status === 'completed' && !trip.hasReport).map((trip) => (
                      <div
                        key={trip.id}
                        className="backdrop-blur-xl bg-white/30 rounded-lg p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/40 cursor-pointer"
                        onClick={() => createBusinessReport(trip.id)}
                      >
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-800 mb-1">{trip.title}</h3>
                          <div className="flex items-center space-x-2 text-xs text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>{trip.startDate} ～ {trip.endDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{trip.location}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-500 mb-3">
                          <p className="truncate">{trip.purpose}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-100">
                            報告書未作成
                          </span>
                          <Plus className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 精算書作成が必要な出張一覧 */}
              {expenseReportCreationCount > 0 && (
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">精算書作成</h2>
                        <p className="text-slate-600 text-sm">精算書作成が必要な出張</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessTrips.filter(trip => trip.hasReport && !trip.hasExpenseReport).map((trip) => (
                      <div
                        key={trip.id}
                        className="backdrop-blur-xl bg-white/30 rounded-lg p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/40 cursor-pointer"
                        onClick={() => createExpenseReport(trip.id)}
                      >
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-800 mb-1">{trip.title}</h3>
                          <div className="flex items-center space-x-2 text-xs text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>{trip.startDate} ～ {trip.endDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                            <Building className="w-3 h-3" />
                            <span>{trip.visitTarget}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-500 mb-3">
                          <p>予定日当: ¥{trip.estimatedAmount.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-amber-700 bg-amber-100">
                            精算書未作成
                          </span>
                          <Plus className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 提出済一覧 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">提出済</h2>
                      <p className="text-slate-600 text-sm">承認待ち・承認完了の書類</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('past-applications-search')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    <span>過去の申請を確認する</span>
                  </button>
                </div>

                {submittedCount > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessTrips.filter(trip => trip.reportSubmitted && trip.expenseReportSubmitted).map((trip) => (
                      <div
                        key={trip.id}
                        className="backdrop-blur-xl bg-white/30 rounded-lg p-4 border border-white/30 shadow-lg"
                      >
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-800 mb-1">{trip.title}</h3>
                          <div className="flex items-center space-x-2 text-xs text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>{trip.startDate} ～ {trip.endDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                            <Building className="w-3 h-3" />
                            <span>{trip.visitTarget}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-500 mb-3">
                          <p>予定日当: ¥{trip.estimatedAmount.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-700 bg-purple-100">
                            提出済
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('プレビュー画面に移動します');
                            }}
                            className="p-1 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-medium mb-2">提出済みの書類はありません</p>
                    <p className="text-slate-500">報告書と精算書を作成・提出すると、ここに表示されます</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 出張報告書完了モーダル */}
      {showReportCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">出張報告書作成完了</h3>
              <p className="text-slate-600">続けて出張経費精算書を作成しますか？</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleProceedToExpenseReport}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-900 transition-all duration-200"
              >
                出張経費精算書の作成に進む
              </button>
              <button
                onClick={() => handleLaterAction('report')}
                className="w-full px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200"
              >
                あとで作成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 出張経費精算書完了モーダル */}
      {showExpenseCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">出張経費精算書作成完了</h3>
              <p className="text-slate-600">報告書と精算書を提出しますか？</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmitDocuments}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
              >
                報告書と精算書を提出
              </button>
              <button
                onClick={() => handleLaterAction('expense')}
                className="w-full px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200"
              >
                あとで提出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentManagement;