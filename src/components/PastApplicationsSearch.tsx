import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Calendar, User, FileText, Eye, Download, ChevronDown, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface PastApplicationsSearchProps {
  onNavigate: (view: string) => void;
}

interface Application {
  id: string;
  type: 'business-trip' | 'expense' | 'business-report' | 'expense-report';
  title: string;
  applicant: string;
  department: string;
  amount?: number;
  submittedDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  period?: { start: string; end: string; };
  location?: string;
  visitTarget?: string;
}

function PastApplicationsSearch({ onNavigate }: PastApplicationsSearchProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // サンプルデータ
  const [applications] = useState<Application[]>([
    {
      id: 'BT-2024-001',
      type: 'business-trip',
      title: '東京出張申請',
      applicant: '田中太郎',
      department: '営業部',
      amount: 52500,
      submittedDate: '2024-07-20',
      status: 'approved',
      period: { start: '2024-07-25', end: '2024-07-27' },
      location: '東京都港区',
      visitTarget: '株式会社サンプル'
    },
    {
      id: 'BR-2024-001',
      type: 'business-report',
      title: '東京出張報告書',
      applicant: '田中太郎',
      department: '営業部',
      submittedDate: '2024-07-28',
      status: 'submitted',
      period: { start: '2024-07-25', end: '2024-07-27' },
      location: '東京都港区',
      visitTarget: '株式会社サンプル'
    },
    {
      id: 'EX-2024-001',
      type: 'expense',
      title: '交通費・宿泊費精算',
      applicant: '佐藤花子',
      department: '総務部',
      amount: 12800,
      submittedDate: '2024-07-18',
      status: 'approved'
    },
    {
      id: 'ER-2024-001',
      type: 'expense-report',
      title: '東京出張経費精算書',
      applicant: '田中太郎',
      department: '営業部',
      amount: 42000,
      submittedDate: '2024-07-30',
      status: 'draft',
      period: { start: '2024-07-25', end: '2024-07-27' },
      location: '東京都港区',
      visitTarget: '株式会社サンプル'
    },
    {
      id: 'BT-2024-002',
      type: 'business-trip',
      title: '大阪出張申請',
      applicant: '鈴木次郎',
      department: '開発部',
      amount: 35000,
      submittedDate: '2024-07-15',
      status: 'rejected',
      period: { start: '2024-07-20', end: '2024-07-21' },
      location: '大阪府大阪市',
      visitTarget: '大阪支社'
    }
  ]);

  const departments = ['営業部', '総務部', '開発部', '企画部', '経理部'];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'business-trip': '出張申請',
      'expense': '経費申請',
      'business-report': '出張報告書',
      'expense-report': '出張経費精算書'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'business-trip': 'text-blue-700 bg-blue-100',
      'expense': 'text-emerald-700 bg-emerald-100',
      'business-report': 'text-purple-700 bg-purple-100',
      'expense-report': 'text-orange-700 bg-orange-100'
    };
    return colors[type as keyof typeof colors] || 'text-slate-700 bg-slate-100';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'draft': '下書き',
      'submitted': '提出済み',
      'approved': '承認済み',
      'rejected': '否認'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'text-amber-700 bg-amber-100',
      'submitted': 'text-blue-700 bg-blue-100',
      'approved': 'text-emerald-700 bg-emerald-100',
      'rejected': 'text-red-700 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-slate-700 bg-slate-100';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || app.department === departmentFilter;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const appDate = new Date(app.submittedDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = appDate >= startDate && appDate <= endDate;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment && matchesDate;
  });

  const handleExport = () => {
    alert('検索結果をCSVファイルでエクスポートします');
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('document-management')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">過去の申請検索</h1>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-900 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV出力</span>
                </button>
              </div>

              {/* 検索・フィルター */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="タイトル、申請者、IDで検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    />
                  </div>
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  >
                    <option value="all">すべての種別</option>
                    <option value="business-trip">出張申請</option>
                    <option value="expense">経費申請</option>
                    <option value="business-report">出張報告書</option>
                    <option value="expense-report">出張経費精算書</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  >
                    <option value="all">すべてのステータス</option>
                    <option value="draft">下書き</option>
                    <option value="submitted">提出済み</option>
                    <option value="approved">承認済み</option>
                    <option value="rejected">否認</option>
                  </select>
                  
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  >
                    <option value="all">すべての部署</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="flex-1 px-3 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      placeholder="開始日"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="flex-1 px-3 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      placeholder="終了日"
                    />
                  </div>
                </div>
              </div>

              {/* 検索結果 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl border border-white/30 shadow-xl">
                <div className="p-6 border-b border-white/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">検索結果</h2>
                    <span className="text-sm text-slate-600">{filteredApplications.length}件見つかりました</span>
                  </div>
                </div>

                <div className="divide-y divide-white/20">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 text-lg font-medium mb-2">申請が見つかりません</p>
                      <p className="text-slate-500">検索条件を変更してお試しください</p>
                    </div>
                  ) : (
                    filteredApplications.map((app) => (
                      <div key={app.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800">{app.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(app.type)}`}>
                                {getTypeLabel(app.type)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                {getStatusLabel(app.status)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>{app.applicant} ({app.department})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(app.submittedDate).toLocaleDateString('ja-JP')}</span>
                              </div>
                              {app.amount && (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">金額:</span>
                                  <span>¥{app.amount.toLocaleString()}</span>
                                </div>
                              )}
                              {app.period && (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">期間:</span>
                                  <span>{app.period.start} ～ {app.period.end}</span>
                                </div>
                              )}
                            </div>

                            {/* 詳細情報（展開可能） */}
                            <button
                              onClick={() => toggleExpanded(app.id)}
                              className="flex items-center space-x-2 text-navy-600 hover:text-navy-800 text-sm font-medium transition-colors"
                            >
                              {expandedItems.includes(app.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <span>詳細を{expandedItems.includes(app.id) ? '閉じる' : '表示'}</span>
                            </button>

                            {expandedItems.includes(app.id) && (
                              <div className="mt-4 p-4 bg-white/30 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  {app.location && (
                                    <div>
                                      <span className="font-medium text-slate-700">出張場所:</span>
                                      <p className="text-slate-600">{app.location}</p>
                                    </div>
                                  )}
                                  {app.visitTarget && (
                                    <div>
                                      <span className="font-medium text-slate-700">訪問先:</span>
                                      <p className="text-slate-600">{app.visitTarget}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => alert('詳細表示画面に移動します')}
                              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-colors"
                              title="詳細表示"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => alert('PDFをダウンロードします')}
                              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-colors"
                              title="ダウンロード"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PastApplicationsSearch;