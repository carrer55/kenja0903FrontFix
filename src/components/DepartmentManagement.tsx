import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Mail, 
  UserPlus, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useDepartmentManagement, type DepartmentManagement, type UserInvitation } from '../hooks/useDepartmentManagement';
import { useAuth } from '../contexts/AuthContext';

interface DepartmentManagementProps {
  onNavigate: (view: string) => void;
}

function DepartmentManagement({ onNavigate }: DepartmentManagementProps) {
  const { user, userRole, userPlan } = useAuth();
  const {
    departments,
    invitations,
    memberships,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    inviteUser,
    cancelInvitation,
    removeMemberFromDepartment
  } = useDepartmentManagement();

  const [activeTab, setActiveTab] = useState<'departments' | 'invitations' | 'members'>('departments');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentManagement | null>(null);

  // 新規部署作成フォーム
  const [newDepartment, setNewDepartment] = useState({
    department_name: '',
    description: '',
    max_members: 100
  });

  // ユーザー招待フォーム
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    full_name: '',
    position: '',
    role: 'general_user' as 'admin' | 'department_admin' | 'approver' | 'general_user',
    department_id: ''
  });

  // Enterpriseプランの管理者のみアクセス可能
  if (userPlan !== 'Enterprise' || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">アクセス権限がありません</h2>
          <p className="text-slate-600 mb-4">
            Enterpriseプランの管理者のみが部署管理機能にアクセスできます。
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createDepartment(newDepartment);
    if (result.success) {
      setShowCreateModal(false);
      setNewDepartment({ department_name: '', description: '', max_members: 100 });
    } else {
      alert(result.error);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await inviteUser(newInvitation);
    if (result.success) {
      setShowInviteModal(false);
      setNewInvitation({
        email: '',
        full_name: '',
        position: '',
        role: 'general_user',
        department_id: ''
      });
    } else {
      alert(result.error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (confirm('この部署を削除しますか？この操作は取り消せません。')) {
      const result = await deleteDepartment(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleCancelInvitation = async (id: string) => {
    if (confirm('この招待をキャンセルしますか？')) {
      const result = await cancelInvitation(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleRemoveMember = async (membershipId: string) => {
    if (confirm('このメンバーを部署から削除しますか？')) {
      const result = await removeMemberFromDepartment(membershipId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '招待中';
      case 'accepted': return '承認済み';
      case 'declined': return '拒否';
      case 'expired': return '期限切れ';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">部署管理</h1>
              <p className="text-slate-600">Enterpriseプランでの部署とユーザー管理</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>部署作成</span>
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>ユーザー招待</span>
              </button>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/30 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'departments'
                  ? 'bg-navy-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
              }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              部署一覧
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'invitations'
                  ? 'bg-navy-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              招待管理
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'members'
                  ? 'bg-navy-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              メンバー管理
            </button>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 部署一覧タブ */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">読み込み中...</p>
              </div>
            ) : (
              departments.map((department) => (
                <div key={department.id} className="bg-white/50 backdrop-blur-xl rounded-lg p-6 border border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">{department.department_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          department.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {department.is_active ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </div>
                      {department.description && (
                        <p className="text-slate-600 mb-2">{department.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {department.member_count || 0} / {department.max_members} メンバー
                        </span>
                        {department.manager && (
                          <span>管理者: {department.manager.full_name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingDepartment(department)}
                        className="p-2 text-slate-600 hover:text-navy-600 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 招待管理タブ */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">読み込み中...</p>
              </div>
            ) : (
              invitations.map((invitation) => (
                <div key={invitation.id} className="bg-white/50 backdrop-blur-xl rounded-lg p-6 border border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{invitation.full_name || invitation.email}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                          {getStatusText(invitation.status)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>メール: {invitation.email}</p>
                        {invitation.position && <p>役職: {invitation.position}</p>}
                        {invitation.department_name && <p>部署: {invitation.department_name}</p>}
                        <p>招待者: {invitation.invited_by_user?.full_name}</p>
                        <p>有効期限: {new Date(invitation.expires_at).toLocaleDateString('ja-JP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {invitation.status === 'pending' && (
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          キャンセル
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* メンバー管理タブ */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">読み込み中...</p>
              </div>
            ) : (
              memberships.map((membership) => (
                <div key={membership.id} className="bg-white/50 backdrop-blur-xl rounded-lg p-6 border border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{membership.user?.full_name}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          アクティブ
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>メール: {membership.user?.email}</p>
                        <p>役職: {membership.user?.position}</p>
                        <p>部署: {membership.department?.department_name || membership.department?.name}</p>
                        <p>参加日: {new Date(membership.joined_at).toLocaleDateString('ja-JP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRemoveMember(membership.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 部署作成モーダル */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">新規部署作成</h2>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">部署名</label>
                  <input
                    type="text"
                    value={newDepartment.department_name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, department_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">説明</label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">最大メンバー数</label>
                  <input
                    type="number"
                    value={newDepartment.max_members}
                    onChange={(e) => setNewDepartment({ ...newDepartment, max_members: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
                  >
                    作成
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ユーザー招待モーダル */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">ユーザー招待</h2>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">メールアドレス</label>
                  <input
                    type="email"
                    value={newInvitation.email}
                    onChange={(e) => setNewInvitation({ ...newInvitation, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">氏名</label>
                  <input
                    type="text"
                    value={newInvitation.full_name}
                    onChange={(e) => setNewInvitation({ ...newInvitation, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">役職</label>
                  <input
                    type="text"
                    value={newInvitation.position}
                    onChange={(e) => setNewInvitation({ ...newInvitation, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">役割</label>
                  <select
                    value={newInvitation.role}
                    onChange={(e) => setNewInvitation({ ...newInvitation, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  >
                    <option value="general_user">一般ユーザー</option>
                    <option value="approver">承認者</option>
                    <option value="department_admin">部門管理者</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">部署</label>
                  <select
                    value={newInvitation.department_id}
                    onChange={(e) => setNewInvitation({ ...newInvitation, department_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  >
                    <option value="">部署を選択</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    招待
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentManagement;
