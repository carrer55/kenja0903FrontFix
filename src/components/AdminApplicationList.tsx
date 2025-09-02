import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Calendar, User, Eye, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AdminApplicationListProps {
  onNavigate: (view: string) => void;
}

interface Application {
  id: string;
  type: 'business-trip' | 'expense';
  category: 'application' | 'settlement';
  title: string;
  applicant: string;
  department: string;
  amount: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  approver: string;
  purpose?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  daysWaiting?: number;
}

function AdminApplicationList({ onNavigate }: AdminApplicationListProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // ローカルストレージから選択されたカテゴリとステータスを取得
  const selectedCategory = localStorage.getItem('adminSelectedCategory') as 'application' | 'settlement' || 'application';
  const selectedStatus = localStorage.getItem('adminSelectedStatus') as 'pending' | 'approved' || 'pending';

  const applications: Application[] = [
    {
      id: 'BT-2024-001',
      type: 'business-trip',
      category: 'application',
      title: '東京出張申請',
      applicant: '田中太郎',
      department: '営業部',
      amount: 52500,
      submittedDate: '2024-07-20',
      status: 'pending',
      approver: '佐藤部長',
      purpose: 'クライアント訪問および新規開拓営業',
      startDate: '2024-07-25',
      endDate: '2024-07-27',
      location: '東京都港区',
      daysWaiting: 3
    },
    {
      id: 'BT-2024-002',
      type: 'business-trip',
      category: 'application',
      title: '大阪出張申請',
      applicant: '鈴木次郎',
      department: '開発部',
      amount: 35000,
      submittedDate: '2024-07-15',
      status: 'approved',
      approver: '山田経理',
      purpose: '支社会議参加',
      startDate: '2024-07-20',
      endDate: '2024-07-21',
      location: '大阪府大阪市'
    },
    {
      id: 'EX-2024-001',
      type: 'expense',
      category: 'application',
      title: '交通費申請',
      applicant: '佐藤花子',
      department: '総務部',
      amount: 12800,
      submittedDate: '2024-07-18',
      status: 'pending',
      approver: '田中部長',
      daysWaiting: 5
    },
    {
      id: 'ST-2024-001',
      type: 'business-trip',
      category: 'settlement',
      title: '東京出張精算',
      applicant: '高橋美咲',
      department: '企画部',
      amount: 48500,
      submittedDate: '2024-07-10',
      status: 'pending',
      approver: '鈴木取締役',
      daysWaiting: 13
    },
    {
      id: 'ST-2024-002',
      type: 'expense',
      category: 'settlement',
      title: '会議費精算',
      applicant: '伊藤健一',
      department: '営業部',
      amount: 8500,
      submittedDate: '2024-07-05',
      status: 'approved',
      approver: '佐藤部長'
    }
  ];

  const departments = ['営業部', '総務部', '開発部', '企画部', '経理部'];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'on_hold':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': '承認待ち',
      'approved': '承認済み',
      'rejected': '否認',
      'on_hold': '保留'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'text-amber-700 bg-amber-100',
      'approved': 'text-emerald-700 bg-emerald-100',
      'rejected': 'text-red-700 bg-red-100',
      'on_hold': 'text-orange-700 bg-orange-100'
    };
    return colors[status as keyof typeof colors] || 'text-slate-700 bg-slate-100';
  };

  const getTypeLabel = (type: string) => {
    return type === 'business-trip' ? '出張' : '経費';
  };

  const getCategoryLabel = (category: string) => {
    return category === 'application' ? '申請' : '精算';
  };

  const getPageTitle = () => {
    const categoryLabel = getCategoryLabel(selectedCategory);
    const statusLabel = getStatusLabel(selectedStatus);
    return `${categoryLabel} - ${statusLabel}`;
  };

  const filteredApplications = applications.filter(app => {
    // 部門管理者の場合は自部署のみ表示
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const currentUserRole = userProfile.role;
    const userDepartment = userProfile.departmentName;
    
    if (currentUserRole === 'department_admin' && userDepartment && app.department !== userDepartment) {
      return false;
    }
    
    const matchesCategory = app.category === selectedCategory;
    const matchesStatus = app.status === selectedStatus;
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || app.department === departmentFilter;
    
    return matchesCategory && matchesStatus && matchesSearch && matchesDepartment;
  });

  const handleApplicationClick = (applicationId: string) => {
    localStorage.setItem('adminSelectedApplication', applicationId);
    onNavigate('admin-application-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="admin-dashboard" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="admin-dashboard" />
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
                    onClick={() => onNavigate('admin-dashboard')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{getPageTitle()}</h1>
                </div>
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
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 申請一覧 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl border border-white/30 shadow-xl">
                <div className="p-6 border-b border-white/30">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {getPageTitle()} ({filteredApplications.length}件)
                  </h2>
                </div>

                <div className="divide-y divide-white/20">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg ${
                        selectedCategory === 'application' 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-800' 
                          : 'bg-gradient-to-br from-purple-600 to-purple-800'
                      }`}>
                        {selectedCategory === 'application' ? (
                          <FileText className="w-8 h-8 text-white" />
                        ) : (
                          <Receipt className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <p className="text-slate-600 text-lg font-medium mb-2">
                        {getPageTitle()}がありません
                      </p>
                      <p className="text-slate-500">新しい{getCategoryLabel(selectedCategory)}が提出されると、ここに表示されます</p>
                    </div>
                  ) : (
                    filteredApplications.map((app) => (
                      <div 
                        key={app.id} 
                        className="p-6 hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={() => handleApplicationClick(app.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800">{app.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.type === 'business-trip' ? 'text-blue-700 bg-blue-100' : 'text-emerald-700 bg-emerald-100'
                              }`}>
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
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">金額:</span>
                                <span className="font-bold text-slate-900">¥{app.amount.toLocaleString()}</span>
                              </div>
                              {selectedStatus === 'pending' && app.daysWaiting && (
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

                            {app.purpose && (
                              <p className="text-sm text-slate-600 mb-2">
                                <span className="font-medium">目的:</span> {app.purpose}
                              </p>
                            )}

                            {app.startDate && app.endDate && (
                              <p className="text-sm text-slate-600">
                                <span className="font-medium">期間:</span> {app.startDate} ～ {app.endDate}
                                {app.location && <span className="ml-4"><span className="font-medium">場所:</span> {app.location}</span>}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplicationClick(app.id);
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

export default AdminApplicationList;