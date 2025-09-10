import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Mail, Edit, Trash2, Shield, Users, Building, Search, Filter } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUserProfile } from './UserProfileProvider';

interface UserManagementProps {
  onNavigate: (view: string) => void;
}

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'department_admin' | 'approver' | 'general_user';
  plan: 'Free' | 'Pro' | 'Enterprise';
  department?: string;
  departmentId?: string;
  status: 'active' | 'invited' | 'inactive';
  invitedAt?: string;
  lastLogin?: string;
  invitedBy: string;
}

interface InviteForm {
  email: string;
  role: 'department_admin' | 'approver' | 'general_user';
  department: string;
  departmentId: string;
  customMessage: string;
}

function UserManagement({ onNavigate }: UserManagementProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { userPlan, profile } = useUserProfile();

  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: '',
    role: 'general_user',
    department: '',
    departmentId: '',
    customMessage: ''
  });

  // サンプルデータ
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([
    {
      id: '1',
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'admin',
      plan: userPlan,
      status: 'active',
      lastLogin: '2024-07-20T10:00:00Z',
      invitedBy: 'システム'
    },
    {
      id: '2',
      name: '佐藤花子',
      email: 'sato@example.com',
      role: 'approver',
      plan: userPlan,
      department: '総務部',
      departmentId: 'dept-001',
      status: 'active',
      lastLogin: '2024-07-19T15:30:00Z',
      invitedBy: '山田太郎'
    },
    {
      id: '3',
      name: '田中次郎',
      email: 'tanaka@example.com',
      role: 'general_user',
      plan: userPlan,
      department: '営業部',
      departmentId: 'dept-002',
      status: 'invited',
      invitedAt: '2024-07-18T09:00:00Z',
      invitedBy: '山田太郎'
    }
  ]);

  const departments = [
    { id: 'dept-001', name: '総務部' },
    { id: 'dept-002', name: '営業部' },
    { id: 'dept-003', name: '開発部' },
    { id: 'dept-004', name: '企画部' },
    { id: 'dept-005', name: '経理部' }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      'admin': '管理者',
      'department_admin': '部門管理者',
      'approver': '承認者',
      'general_user': '一般ユーザー'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'admin': 'text-red-700 bg-red-100',
      'department_admin': 'text-purple-700 bg-purple-100',
      'approver': 'text-blue-700 bg-blue-100',
      'general_user': 'text-slate-700 bg-slate-100'
    };
    return colors[role as keyof typeof colors] || 'text-slate-700 bg-slate-100';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'active': 'アクティブ',
      'invited': '招待中',
      'inactive': '無効'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'text-emerald-700 bg-emerald-100',
      'invited': 'text-amber-700 bg-amber-100',
      'inactive': 'text-slate-700 bg-slate-100'
    };
    return colors[status as keyof typeof colors] || 'text-slate-700 bg-slate-100';
  };

  const getAvailableRoles = () => {
    if (userPlan === 'Enterprise') {
      return [
        { value: 'department_admin', label: '部門管理者' },
        { value: 'approver', label: '承認者' },
        { value: 'general_user', label: '一般ユーザー' }
      ];
    } else {
      return [
        { value: 'approver', label: '承認者' },
        { value: 'general_user', label: '一般ユーザー' }
      ];
    }
  };

  const filteredUsers = teamUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteUser = () => {
    if (!inviteForm.email || !inviteForm.role) {
      alert('必須項目を入力してください');
      return;
    }

    if (inviteForm.role === 'department_admin' && !inviteForm.departmentId) {
      alert('部門管理者の場合は部署を選択してください');
      return;
    }

    const newUser: TeamUser = {
      id: Date.now().toString(),
      name: inviteForm.email.split('@')[0], // 仮の名前
      email: inviteForm.email,
      role: inviteForm.role,
      plan: userPlan,
      department: departments.find(d => d.id === inviteForm.departmentId)?.name,
      departmentId: inviteForm.departmentId || undefined,
      status: 'invited',
      invitedAt: new Date().toISOString(),
      invitedBy: profile?.name || 'システム'
    };

    setTeamUsers(prev => [...prev, newUser]);
    setInviteForm({
      email: '',
      role: 'general_user',
      department: '',
      departmentId: '',
      customMessage: ''
    });
    setShowInviteModal(false);
    alert('招待メールを送信しました');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('このユーザーを削除してもよろしいですか？')) {
      setTeamUsers(prev => prev.filter(user => user.id !== userId));
      alert('ユーザーが削除されました');
    }
  };

  const handleResendInvite = (userId: string) => {
    alert('招待メールを再送信しました');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="user-management" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="user-management" />
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
                    onClick={() => onNavigate('my-page')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>戻る</span>
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">ユーザー管理</h1>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>ユーザー招待</span>
                </button>
              </div>

              {/* プラン情報 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 border border-white/30 shadow-xl mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <h3 className="font-semibold text-slate-800">現在のプラン: {userPlan}</h3>
                      <p className="text-sm text-slate-600">
                        {userPlan === 'Enterprise' ? 'ユーザー数無制限・部門管理者機能利用可能' : 
                         userPlan === 'Pro' ? 'ユーザー数3名まで' : 'ユーザー数1名まで'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">利用中: {teamUsers.filter(u => u.status === 'active').length}名</p>
                    <p className="text-sm text-slate-600">招待中: {teamUsers.filter(u => u.status === 'invited').length}名</p>
                  </div>
                </div>
              </div>

              {/* フィルター */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 border border-white/30 shadow-xl mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="名前、メールアドレスで検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  >
                    <option value="all">すべての役割</option>
                    <option value="admin">管理者</option>
                    {userPlan === 'Enterprise' && <option value="department_admin">部門管理者</option>}
                    <option value="approver">承認者</option>
                    <option value="general_user">一般ユーザー</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                  >
                    <option value="all">すべてのステータス</option>
                    <option value="active">アクティブ</option>
                    <option value="invited">招待中</option>
                    <option value="inactive">無効</option>
                  </select>
                </div>
              </div>

              {/* ユーザー一覧 */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl border border-white/30 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/30 border-b border-white/30">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-slate-700">ユーザー</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700">役割</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700">部署</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700">ステータス</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700">最終ログイン</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700">招待者</th>
                        <th className="text-center py-4 px-6 font-medium text-slate-700">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500">
                            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                              ? '条件に一致するユーザーが見つかりません' 
                              : 'ユーザーがいません'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium text-slate-800">{user.name}</p>
                                <p className="text-sm text-slate-600">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-700">{user.department || '未設定'}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {getStatusLabel(user.status)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-600 text-sm">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ja-JP') : '未ログイン'}
                            </td>
                            <td className="py-4 px-6 text-slate-600 text-sm">{user.invitedBy}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center space-x-2">
                                {user.status === 'invited' && (
                                  <button
                                    onClick={() => handleResendInvite(user.id)}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50/30 rounded-lg transition-colors"
                                    title="招待再送信"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/30 rounded-lg transition-colors"
                                  title="編集"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {user.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50/30 rounded-lg transition-colors"
                                    title="削除"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ユーザー招待モーダル */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">ユーザー招待</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  役割 <span className="text-red-500">*</span>
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ 
                    ...prev, 
                    role: e.target.value as 'department_admin' | 'approver' | 'general_user',
                    departmentId: e.target.value !== 'department_admin' ? '' : prev.departmentId
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                  required
                >
                  {getAvailableRoles().map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              {(inviteForm.role === 'department_admin' || inviteForm.role === 'approver' || inviteForm.role === 'general_user') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    部署 {inviteForm.role === 'department_admin' && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={inviteForm.departmentId}
                    onChange={(e) => setInviteForm(prev => ({ 
                      ...prev, 
                      departmentId: e.target.value,
                      department: departments.find(d => d.id === e.target.value)?.name || ''
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                    required={inviteForm.role === 'department_admin'}
                  >
                    <option value="">部署を選択</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">カスタムメッセージ</label>
                <textarea
                  value={inviteForm.customMessage}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, customMessage: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400"
                  rows={3}
                  placeholder="招待メールに含める追加メッセージ（任意）"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleInviteUser}
                className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white rounded-lg transition-colors"
              >
                招待を送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;