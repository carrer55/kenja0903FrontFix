import React from 'react';
import StatsCards from './StatsCards';
import QuickActions from './QuickActions';
import RecentApplications from './RecentApplications';
import PostTripNotification from './PostTripNotification';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../hooks/useApplications';

interface MainContentProps {
  onNavigate: (view: string) => void;
  onShowDetail: (type: 'business-trip' | 'expense', id: string) => void;
}

function MainContent({ onNavigate, onShowDetail }: MainContentProps) {
  const [showPostTripNotification, setShowPostTripNotification] = React.useState(true);
  const { userRole } = useAuth();
  const { applications } = useApplications();
  
  const isAdmin = userRole === 'admin' || userRole === 'department_admin';

  // 出張終了後の通知判定（Supabaseデータから取得）
  const completedTrip = applications.find(app => 
    app.type === 'business_trip_request' && 
    app.status === 'completed' &&
    new Date(app.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 過去7日以内
  );

  const handleCreateReport = () => {
    if (completedTrip) {
      onNavigate('document-editor');
      setShowPostTripNotification(false);
    }
  };
  return (
    <>
      {/* 出張終了後の通知 */}
      {showPostTripNotification && completedTrip && (
        <PostTripNotification
          tripTitle={completedTrip.title}
          tripId={completedTrip.id}
          endDate={completedTrip.created_at}
          onCreateReport={handleCreateReport}
          onDismiss={() => setShowPostTripNotification(false)}
        />
      )}
      
      <div className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">ダッシュボード</h1>
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
            >
              <span>管理者ダッシュボード</span>
            </button>
          )}
        </div>
        
        <StatsCards />
        <QuickActions onNavigate={onNavigate} />
        
        <RecentApplications onShowDetail={onShowDetail} onNavigate={onNavigate} />
      </div>
    </div>
    </>
  );
}

export default MainContent;