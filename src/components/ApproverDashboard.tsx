import React, { useState } from 'react';
import { Clock, CheckCircle, Pause, Eye, User, Calendar, Building, Filter, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface ApproverDashboardProps {
  onNavigate: (view: string) => void;
  onShowDetail: (type: 'business-trip' | 'expense', id: string) => void;
}

interface Application {
  id: string;
  type: 'business-trip' | 'expense';
  title: string;
  applicant: string;
  department: string;
  amount: number;
  submittedDate: string;
  status: 'pending' | 'on_hold' | 'approved';
  priority: 'high' | 'medium' | 'low';
  daysWaiting: number;
}

function ApproverDashboard({ onNavigate, onShowDetail }: ApproverDashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<'pending' | 'on_hold' | 'approved'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // サンプルデータ
  const applications: Application[] = [
    {
      id: 'BT-2024-001',
      type: 'business-trip',
      title: '東京出張申請',
      applicant: '田中太郎',
      department: '営業部',
      amount: 52500,
      submittedDate: '2024-07-20',
      status: 'pending',
      priority: 'high',
      daysWaiting: 3
    },
    {
      id: 'EX-2024-001',
      type: 'expense',
      title: '交通費・宿泊費精算',
      applicant: '佐藤花子',
      department: '総務部',
      amount: 12800,
      submittedDate: '2024-07-18',
      status: 'pending',
      priority: 'medium',
      daysWaiting: 5
    },
    {
      id: 'BT-2024-002',
      type: 'business-trip',
      title: '大阪出張申請',
      applicant: '鈴木次郎',
      department: '開発部',
      amount: 35000,
      submittedDate: '2024-07-15',
      status: 'on_hold',
      priority: 'low',
      daysWaiting: 8
    },
    {
      id: 'EX-2024-002',
      type: 'expense',
      title: '会議費精算',
      applicant: '高橋美咲',
      department: '企画部',
      amount: 8500,
      submittedDate: '2024-07-10',
      status: 'approved',
      priority: 'medium',
      daysWaiting: 0
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getApplicationsByStatus = (status: 'pending' | 'on_hold' | 'approved') => {
    return applications.filter(app => app.status === status);
  };

  const filteredApplications = getApplicationsByStatus(selectedCard).filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || app.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-amber-700 bg-amber-100';
      case 'low':
        return 'text-slate-700 bg-slate-100';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      'high': '高',
      'medium': '中',
      'low': '低'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const getTypeLabel = (type: string) => {
    return type === 'business-trip' ? '出張申請' : '経費申請';
  };

  const getCardConfig = (status: 'pending' | 'on_hold' | 'approved') => {
    const configs = {
      pending: {
        title: '承認待ち申請',
        icon: Clock,
        color: 'from-amber-600 to-amber-800',
        bgColor: 'from-amber-500/20 to-amber-700/20',
        borderColor: 'border-amber-300/50',
        count: getApplicationsByStatus('pending').length
      },
      on_hold: {
        title: '保留',
        icon: Pause,
        color: 'from-orange-600 to-orange-800',
        bgColor: 'from-orange-500/20 to-orange-700/20',
        borderColor: 'border-orange-300/50',
        count: getApplicationsByStatus('on_hold').length
      },
      approved: {
        title: '承認済申請',
        icon: CheckCircle,
        color: 'from-emerald-600 to-emerald-800',
        bgColor: 'from-emerald-500/20 to-emerald-700/20',
        borderColor: 'border-emerald-300/50',
        count: getApplicationsByStatus('approved').length
      }
    };
    return configs[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="dashboard" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="dashboard" />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
          
          <div className="flex-1 overflow-auto p-4 lg:p-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">承認者ダッシュボード</h1>
                <p className="text-slate-600">承認が必要な申請を確認・処理してください</p>
              </div>

              {/* 承認カード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {(['pending', 'on_hold', 'approved'] as const).map((status) => {
                  const config = getCardConfig(status);
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={status}
                      onClick={() => setSelectedCard(status)}
                      className={`backdrop-blur-xl bg-gradient-to-br ${config.bgColor} rounded-xl p-6 border-2 ${
                        selectedCard === status ? config.borderColor : 'border-white/30'
                      } shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-slate-800">{config.count}</p>
                          <p className="text-sm text-slate-600">件</p>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">{config.title}</h3>
                    </div>
                  );
                })}
              </div>

              {/* フィルター */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 border border-white/30 shadow-xl mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="申請者、タイトル、IDで検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    />
                  </div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  >
                    <option value="all">すべての部署</option>
                    <option value="営業部">営業部</option>
                    <option value="総務部">総務部</option>
                    <option value="開発部">開発部</option>
                    <option value="企画部">企画部</option>
                    <option value="経理部">経理部</option>
                  </select>
                </div>
              </div>

              {/* 申請一覧 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl border border-white/30 shadow-xl">
                <div className="p-6 border-b border-white/30">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {getCardConfig(selectedCard).title} ({filteredApplications.length}件)
                  </h2>
                </div>

                <div className="divide-y divide-white/20">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getCardConfig(selectedCard).color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        {React.createElement(getCardConfig(selectedCard).icon, { className: "w-8 h-8 text-white" })}
                      </div>
                      <p className="text-slate-600 text-lg font-medium mb-2">
                        {selectedCard === 'pending' ? '承認待ちの申請はありません' :
                         selectedCard === 'on_hold' ? '保留中の申請はありません' :
                         '承認済みの申請はありません'}
                      </p>
                      <p className="text-slate-500">新しい申請が提出されると、ここに表示されます</p>
                    </div>
                  ) : (
                    filteredApplications.map((app) => (
                      <div 
                        key={app.id} 
                        className="p-6 hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={() => onShowDetail(app.type, app.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800">{app.title}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-100">
                                {getTypeLabel(app.type)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(app.priority)}`}>
                                優先度: {getPriorityLabel(app.priority)}
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
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">金額:</span>
                                <span className="font-bold text-slate-900">¥{app.amount.toLocaleString()}</span>
                              </div>
                              {selectedCard === 'pending' && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span className={`font-medium ${
                                    app.daysWaiting > 7 ? 'text-red-600' : 
                                    app.daysWaiting > 3 ? 'text-amber-600' : 'text-slate-600'
                                  }`}>
                                    {app.daysWaiting}日経過
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowDetail(app.type, app.id);
                              }}
                              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-colors"
                              title="詳細表示"
                            >
                              <Eye className="w-4 h-4" />
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

export default ApproverDashboard;