import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, User, Calendar, MapPin, Building, MessageSquare, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApplications } from '../hooks/useApplications';
import { useNotifications } from '../hooks/useNotifications';

interface AdminApplicationDetailProps {
  onNavigate: (view: string) => void;
}

interface ApplicationData {
  id: string;
  type: 'business-trip' | 'expense';
  category: 'application' | 'settlement';
  title: string;
  applicant: string;
  department_name: string;
  amount: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  approver: string;
  purpose?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  visitTarget?: string;
  companions?: string;
  daysWaiting?: number;
  details?: {
    dailyAllowance?: number;
    transportation?: number;
    accommodation?: number;
    items?: Array<{
      category: string;
      amount: number;
      description: string;
      date: string;
      store: string;
    }>;
  };
}

function AdminApplicationDetail({ onNavigate }: AdminApplicationDetailProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);

  const { applications, updateApplication } = useApplications();
  const { createApprovalNotification } = useNotifications();

  // URLパラメータまたはpropsから選択された申請IDを取得
  const selectedApplicationId = new URLSearchParams(window.location.search).get('id') || '';

  useEffect(() => {
    if (selectedApplicationId && applications.length > 0) {
      const app = applications.find(a => a.id === selectedApplicationId);
      if (app) {
        setApplicationData({
          id: app.id,
          type: app.type === 'business_trip_request' ? 'business-trip' : 'expense',
          category: 'application',
          title: app.title,
          applicant: app.applicant_name || '',
          department_name: app.department_name || '',
          amount: app.total_amount || 0,
          submittedDate: app.submitted_at || app.created_at,
          status: app.status as 'pending' | 'approved' | 'rejected' | 'on_hold',
          approver: app.approver_name || '',
          purpose: app.metadata?.purpose,
          startDate: app.metadata?.start_date,
          endDate: app.metadata?.end_date,
          location: app.metadata?.location,
          visitTarget: app.metadata?.visit_target,
          companions: app.metadata?.companions,
          daysWaiting: app.days_waiting || 0,
          details: app.metadata?.details
        });
      }
    }
  }, [selectedApplicationId, applications]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleApprovalAction = async (action: 'approved' | 'rejected' | 'on_hold') => {
    if (!applicationData) return;
    
    if (action !== 'approved' && !comment.trim()) {
      alert('否認または保留の場合は、コメントを入力してください。');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const actionLabel = action === 'approved' ? '承認' : action === 'rejected' ? '否認' : '保留';
      
      // Supabaseで申請ステータスを更新
      await updateApplication(applicationData.id, {
        status: action,
        approved_at: action === 'approved' ? new Date().toISOString() : null,
        rejection_reason: action === 'rejected' ? comment : null,
        current_approver_id: null // 承認完了
      });

      // 通知を作成
      await createApprovalNotification(applicationData.id, action);
      
      alert(`申請を${actionLabel}しました。`);
      onNavigate('admin-application-list');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('申請の更新に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'on_hold':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
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

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600">申請データを読み込み中...</p>
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
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('admin-application-list')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">申請詳細</h1>
                </div>
              </div>

              {/* 申請詳細 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{applicationData.title}</h2>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(applicationData.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicationData.status)}`}>
                      {getStatusLabel(applicationData.status)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">申請者</p>
                        <p className="font-medium text-slate-800">{applicationData.applicant} ({applicationData.department_name})</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">申請日</p>
                        <p className="font-medium text-slate-800">{new Date(applicationData.submittedDate).toLocaleDateString('ja-JP')}</p>
                      </div>
                    </div>
                    {applicationData.startDate && applicationData.endDate && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">出張期間</p>
                          <p className="font-medium text-slate-800">
                            {applicationData.startDate} ～ {applicationData.endDate}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {applicationData.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">出張場所</p>
                          <p className="font-medium text-slate-800">{applicationData.location}</p>
                        </div>
                      </div>
                    )}
                    {applicationData.visitTarget && (
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">訪問先</p>
                          <p className="font-medium text-slate-800">{applicationData.visitTarget}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-600">予定金額</p>
                      <p className="text-2xl font-bold text-slate-800">¥{applicationData.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {applicationData.purpose && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-2">出張目的</p>
                    <p className="text-slate-800 bg-white/30 rounded-lg p-4">{applicationData.purpose}</p>
                  </div>
                )}

                {applicationData.companions && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-2">同行者</p>
                    <p className="text-slate-800 bg-white/30 rounded-lg p-4">{applicationData.companions}</p>
                  </div>
                )}

                {/* 経費内訳 */}
                {applicationData.details && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-3">経費内訳</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {applicationData.details.dailyAllowance && (
                        <div className="bg-white/30 rounded-lg p-4 text-center">
                          <p className="text-sm text-slate-600 mb-1">出張日当</p>
                          <p className="text-lg font-bold text-slate-800">¥{applicationData.details.dailyAllowance.toLocaleString()}</p>
                        </div>
                      )}
                      {applicationData.details.transportation && (
                        <div className="bg-white/30 rounded-lg p-4 text-center">
                          <p className="text-sm text-slate-600 mb-1">交通費</p>
                          <p className="text-lg font-bold text-slate-800">¥{applicationData.details.transportation.toLocaleString()}</p>
                        </div>
                      )}
                      {applicationData.details.accommodation && (
                        <div className="bg-white/30 rounded-lg p-4 text-center">
                          <p className="text-sm text-slate-600 mb-1">宿泊費</p>
                          <p className="text-lg font-bold text-slate-800">¥{applicationData.details.accommodation.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 経費項目詳細（経費申請・精算の場合） */}
                {applicationData.details?.items && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-3">経費項目詳細</p>
                    <div className="space-y-2">
                      {applicationData.details.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white/30 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-slate-800">{item.category}</p>
                            <p className="text-sm text-slate-600">{item.description}</p>
                            <p className="text-xs text-slate-500">{item.date} - {item.store}</p>
                          </div>
                          <p className="font-bold text-slate-800">¥{item.amount.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 承認待ちの場合のみ承認操作を表示 */}
              {applicationData.status === 'pending' && (
                <>
                  {/* コメント入力 */}
                  <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-slate-600" />
                      <h3 className="text-lg font-semibold text-slate-800">コメント</h3>
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                      rows={4}
                      placeholder="承認・否認・保留の理由やコメントを入力してください（否認・保留の場合は必須）"
                    />
                  </div>

                  {/* 承認アクションボタン */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleApprovalAction('approved')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>{isSubmitting ? '処理中...' : '承認'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleApprovalAction('on_hold')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span>{isSubmitting ? '処理中...' : '保留'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleApprovalAction('rejected')}
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>{isSubmitting ? '処理中...' : '否認'}</span>
                    </button>
                  </div>
                </>
              )}

              {/* 承認済み・否認・保留の場合は情報表示のみ */}
              {applicationData.status !== 'pending' && (
                <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      {getStatusIcon(applicationData.status)}
                      <h3 className="text-xl font-semibold text-slate-800">
                        この申請は{getStatusLabel(applicationData.status)}です
                      </h3>
                    </div>
                    <p className="text-slate-600">
                      承認者: {applicationData.approver}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminApplicationDetail;