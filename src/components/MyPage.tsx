import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, Bell, Users, HelpCircle, Edit, Save, Eye, EyeOff, Link } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUserProfile } from './UserProfileProvider';

interface MyPageProps {
  onNavigate: (view: string) => void;
}

interface UserProfile {
  name: string;
  position: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  allowances: {
    domestic: {
      dailyAllowance: number;
      accommodation: number;
      transportation: number;
      accommodationDisabled: boolean;
      transportationDisabled: boolean;
    };
    overseas: {
      dailyAllowance: number;
      accommodation: number;
      transportation: number;
      preparationFee: number;
      accommodationDisabled: boolean;
      transportationDisabled: boolean;
      preparationFeeDisabled: boolean;
    };
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: string;
  approvalOnly: boolean;
}

function MyPage({ onNavigate }: MyPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { hasPermission, userRole, userPlan } = useUserProfile();
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '山田太郎',
    position: '代表取締役',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    company: '株式会社サンプル',
    department: '経営企画部',
    allowances: {
      domestic: {
        dailyAllowance: 5000,
        accommodation: 10000,
        transportation: 2000,
        accommodationDisabled: false,
        transportationDisabled: false
      },
      overseas: {
        dailyAllowance: 10000,
        accommodation: 15000,
        transportation: 3000,
        preparationFee: 5000,
        accommodationDisabled: false,
        transportationDisabled: false,
        preparationFeeDisabled: false
      }
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: '09:00',
    approvalOnly: false
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [allowanceTab, setAllowanceTab] = useState<'domestic' | 'overseas'>('domestic');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileSave = () => {
    // プロフィール情報をローカルストレージに保存
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    alert('プロフィールが更新されました');
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  const handleNotificationSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    alert('通知設定が更新されました');
  };

  const handlePlanChange = (newPlan: string) => {
    const updatedProfile = { ...userProfile, currentPlan: newPlan };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    alert(`プランが${newPlan}に変更されました`);
  };

  const tabs = [
    { id: 'profile', label: 'プロフィール', icon: User },
    { id: 'allowances', label: '日当設定', icon: Settings },
    { id: 'notifications', label: '通知設定', icon: Bell },
    { id: 'accounting', label: '会計ソフト設定', icon: Link, permission: 'accounting_software' },
    { id: 'users', label: 'ユーザー管理', icon: Users, permission: 'user_management' },
    { id: 'plan', label: 'プラン管理', icon: CreditCard, permission: 'plan_management' }
  ].filter(tab => !tab.permission || hasPermission(tab.permission));

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">氏名</label>
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">役職</label>
          <input
            type="text"
            value={userProfile.position}
            onChange={(e) => setUserProfile(prev => ({ ...prev, position: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
            placeholder="例：代表取締役、部長、課長など"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">メールアドレス</label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">電話番号</label>
          <input
            type="tel"
            value={userProfile.phone}
            onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">会社名</label>
          <input
            type="text"
            value={userProfile.company}
            onChange={(e) => setUserProfile(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">部署</label>
          <input
            type="text"
            value={userProfile.department}
            onChange={(e) => setUserProfile(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          />
        </div>
      </div>

      {/* パスワード変更セクション */}
      <div className="border-t border-white/30 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">パスワード変更</h3>
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>パスワード変更</span>
          </button>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleProfileSave}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
        >
          <Save className="w-5 h-5" />
          <span>保存</span>
        </button>
      </div>
    </div>
  );

  const renderAllowancesTab = () => (
    <div className="space-y-6">
      {/* タブナビゲーション */}
      <div className="flex space-x-1 bg-white/30 rounded-lg p-1">
        <button
          onClick={() => setAllowanceTab('domestic')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            allowanceTab === 'domestic'
              ? 'bg-navy-600 text-white shadow-lg'
              : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
          }`}
        >
          国内出張
        </button>
        <button
          onClick={() => setAllowanceTab('overseas')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            allowanceTab === 'overseas'
              ? 'bg-navy-600 text-white shadow-lg'
              : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
          }`}
        >
          海外出張
        </button>
      </div>

      {/* 国内出張設定 */}
      {allowanceTab === 'domestic' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">国内出張日当設定</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 出張日当 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">出張日当（円）</label>
              <input
                type="number"
                value={userProfile.allowances.domestic.dailyAllowance}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    domestic: { 
                      ...prev.allowances.domestic, 
                      dailyAllowance: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                placeholder="5000"
              />
              <p className="text-xs text-slate-500 mt-1">1日あたりの出張日当</p>
            </div>

            {/* 宿泊料 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">宿泊料（円）</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.allowances.domestic.accommodationDisabled}
                    onChange={(e) => {
                      const disabled = e.target.checked;
                      setUserProfile(prev => ({ 
                        ...prev, 
                        allowances: { 
                          ...prev.allowances, 
                          domestic: { 
                            ...prev.allowances.domestic, 
                            accommodationDisabled: disabled,
                            accommodation: disabled ? 0 : prev.allowances.domestic.accommodation
                          }
                        }
                      }));
                    }}
                    className="w-4 h-4 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                  />
                  <span className="text-xs text-slate-600">日当を使用しない</span>
                </label>
              </div>
              <input
                type="number"
                value={userProfile.allowances.domestic.accommodationDisabled ? 0 : userProfile.allowances.domestic.accommodation}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    domestic: { 
                      ...prev.allowances.domestic, 
                      accommodation: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                disabled={userProfile.allowances.domestic.accommodationDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl ${
                  userProfile.allowances.domestic.accommodationDisabled
                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'bg-white/50 border-white/40 text-slate-700'
                }`}
                placeholder={userProfile.allowances.domestic.accommodationDisabled ? '実費精算' : '10000'}
              />
              <p className="text-xs text-slate-500 mt-1">1泊あたりの宿泊料</p>
            </div>

            {/* 交通費 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">交通費（円）</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.allowances.domestic.transportationDisabled}
                    onChange={(e) => {
                      const disabled = e.target.checked;
                      setUserProfile(prev => ({ 
                        ...prev, 
                        allowances: { 
                          ...prev.allowances, 
                          domestic: { 
                            ...prev.allowances.domestic, 
                            transportationDisabled: disabled,
                            transportation: disabled ? 0 : prev.allowances.domestic.transportation
                          }
                        }
                      }));
                    }}
                    className="w-4 h-4 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                  />
                  <span className="text-xs text-slate-600">日当を使用しない</span>
                </label>
              </div>
              <input
                type="number"
                value={userProfile.allowances.domestic.transportationDisabled ? 0 : userProfile.allowances.domestic.transportation}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    domestic: { 
                      ...prev.allowances.domestic, 
                      transportation: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                disabled={userProfile.allowances.domestic.transportationDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl ${
                  userProfile.allowances.domestic.transportationDisabled
                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'bg-white/50 border-white/40 text-slate-700'
                }`}
                placeholder={userProfile.allowances.domestic.transportationDisabled ? '実費精算' : '2000'}
              />
              <p className="text-xs text-slate-500 mt-1">1日あたりの交通費</p>
            </div>
          </div>
        </div>
      )}

      {/* 海外出張設定 */}
      {allowanceTab === 'overseas' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">海外出張日当設定</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 出張日当 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">出張日当（円）</label>
              <input
                type="number"
                value={userProfile.allowances.overseas.dailyAllowance}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    overseas: { 
                      ...prev.allowances.overseas, 
                      dailyAllowance: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
                placeholder="10000"
              />
              <p className="text-xs text-slate-500 mt-1">1日あたりの出張日当</p>
            </div>

            {/* 宿泊料 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">宿泊料（円）</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.allowances.overseas.accommodationDisabled}
                    onChange={(e) => {
                      const disabled = e.target.checked;
                      setUserProfile(prev => ({ 
                        ...prev, 
                        allowances: { 
                          ...prev.allowances, 
                          overseas: { 
                            ...prev.allowances.overseas, 
                            accommodationDisabled: disabled,
                            accommodation: disabled ? 0 : prev.allowances.overseas.accommodation
                          }
                        }
                      }));
                    }}
                    className="w-4 h-4 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                  />
                  <span className="text-xs text-slate-600">日当を使用しない</span>
                </label>
              </div>
              <input
                type="number"
                value={userProfile.allowances.overseas.accommodationDisabled ? 0 : userProfile.allowances.overseas.accommodation}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    overseas: { 
                      ...prev.allowances.overseas, 
                      accommodation: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                disabled={userProfile.allowances.overseas.accommodationDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl ${
                  userProfile.allowances.overseas.accommodationDisabled
                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'bg-white/50 border-white/40 text-slate-700'
                }`}
                placeholder={userProfile.allowances.overseas.accommodationDisabled ? '実費精算' : '15000'}
              />
              <p className="text-xs text-slate-500 mt-1">1泊あたりの宿泊料</p>
            </div>

            {/* 交通費 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">交通費（円）</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.allowances.overseas.transportationDisabled}
                    onChange={(e) => {
                      const disabled = e.target.checked;
                      setUserProfile(prev => ({ 
                        ...prev, 
                        allowances: { 
                          ...prev.allowances, 
                          overseas: { 
                            ...prev.allowances.overseas, 
                            transportationDisabled: disabled,
                            transportation: disabled ? 0 : prev.allowances.overseas.transportation
                          }
                        }
                      }));
                    }}
                    className="w-4 h-4 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                  />
                  <span className="text-xs text-slate-600">日当を使用しない</span>
                </label>
              </div>
              <input
                type="number"
                value={userProfile.allowances.overseas.transportationDisabled ? 0 : userProfile.allowances.overseas.transportation}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    overseas: { 
                      ...prev.allowances.overseas, 
                      transportation: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                disabled={userProfile.allowances.overseas.transportationDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl ${
                  userProfile.allowances.overseas.transportationDisabled
                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'bg-white/50 border-white/40 text-slate-700'
                }`}
                placeholder={userProfile.allowances.overseas.transportationDisabled ? '実費精算' : '3000'}
              />
              <p className="text-xs text-slate-500 mt-1">1日あたりの交通費</p>
            </div>

            {/* 支度料 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">支度料（円）</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.allowances.overseas.preparationFeeDisabled}
                    onChange={(e) => {
                      const disabled = e.target.checked;
                      setUserProfile(prev => ({ 
                        ...prev, 
                        allowances: { 
                          ...prev.allowances, 
                          overseas: { 
                            ...prev.allowances.overseas, 
                            preparationFeeDisabled: disabled,
                            preparationFee: disabled ? 0 : prev.allowances.overseas.preparationFee
                          }
                        }
                      }));
                    }}
                    className="w-4 h-4 text-navy-600 bg-white/50 border-white/40 rounded focus:ring-navy-400 focus:ring-2"
                  />
                  <span className="text-xs text-slate-600">使用しない</span>
                </label>
              </div>
              <input
                type="number"
                value={userProfile.allowances.overseas.preparationFeeDisabled ? 0 : userProfile.allowances.overseas.preparationFee}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  allowances: { 
                    ...prev.allowances, 
                    overseas: { 
                      ...prev.allowances.overseas, 
                      preparationFee: parseInt(e.target.value) || 0 
                    }
                  }
                }))}
                disabled={userProfile.allowances.overseas.preparationFeeDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl ${
                  userProfile.allowances.overseas.preparationFeeDisabled
                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'bg-white/50 border-white/40 text-slate-700'
                }`}
                placeholder={userProfile.allowances.overseas.preparationFeeDisabled ? '使用しない' : '5000'}
              />
              <p className="text-xs text-slate-500 mt-1">出張準備にかかる支度料</p>
            </div>
          </div>
        </div>
      )}

      {/* 計算例 */}
      <div className="bg-white/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">日当計算例</h3>
        {allowanceTab === 'domestic' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center bg-white/20 rounded-lg p-4">
              <p className="text-slate-600 mb-2">国内日帰り出張</p>
              <p className="text-xl font-bold text-slate-800">
                ¥{(
                  userProfile.allowances.domestic.dailyAllowance +
                  (userProfile.allowances.domestic.transportationDisabled ? 0 : userProfile.allowances.domestic.transportation)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                日当 + {userProfile.allowances.domestic.transportationDisabled ? '交通費実費' : '交通費日当'}
              </p>
            </div>
            <div className="text-center bg-white/20 rounded-lg p-4">
              <p className="text-slate-600 mb-2">国内1泊2日出張</p>
              <p className="text-xl font-bold text-slate-800">
                ¥{(
                  userProfile.allowances.domestic.dailyAllowance * 2 +
                  (userProfile.allowances.domestic.transportationDisabled ? 0 : userProfile.allowances.domestic.transportation * 2) +
                  (userProfile.allowances.domestic.accommodationDisabled ? 0 : userProfile.allowances.domestic.accommodation)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                日当×2 + {userProfile.allowances.domestic.transportationDisabled ? '交通費実費' : '交通費日当×2'} + {userProfile.allowances.domestic.accommodationDisabled ? '宿泊費実費' : '宿泊料'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center bg-white/20 rounded-lg p-4">
              <p className="text-slate-600 mb-2">海外日帰り出張</p>
              <p className="text-xl font-bold text-slate-800">
                ¥{(
                  userProfile.allowances.overseas.dailyAllowance +
                  (userProfile.allowances.overseas.transportationDisabled ? 0 : userProfile.allowances.overseas.transportation) +
                  (userProfile.allowances.overseas.preparationFeeDisabled ? 0 : userProfile.allowances.overseas.preparationFee)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                日当 + {userProfile.allowances.overseas.transportationDisabled ? '交通費実費' : '交通費日当'} + {userProfile.allowances.overseas.preparationFeeDisabled ? '' : '支度料'}
              </p>
            </div>
            <div className="text-center bg-white/20 rounded-lg p-4">
              <p className="text-slate-600 mb-2">海外2泊3日出張</p>
              <p className="text-xl font-bold text-slate-800">
                ¥{(
                  userProfile.allowances.overseas.dailyAllowance * 3 +
                  (userProfile.allowances.overseas.transportationDisabled ? 0 : userProfile.allowances.overseas.transportation * 3) +
                  (userProfile.allowances.overseas.accommodationDisabled ? 0 : userProfile.allowances.overseas.accommodation * 2) +
                  (userProfile.allowances.overseas.preparationFeeDisabled ? 0 : userProfile.allowances.overseas.preparationFee)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                日当×3 + {userProfile.allowances.overseas.transportationDisabled ? '交通費実費' : '交通費日当×3'} + {userProfile.allowances.overseas.accommodationDisabled ? '宿泊費実費' : '宿泊料×2'} + {userProfile.allowances.overseas.preparationFeeDisabled ? '' : '支度料'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleProfileSave}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
        >
          <Save className="w-5 h-5" />
          <span>保存</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-800">メール通知</h3>
            <p className="text-sm text-slate-600">申請状況や承認通知をメールで受信</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-800">プッシュ通知</h3>
            <p className="text-sm text-slate-600">ブラウザでのプッシュ通知を受信</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-600"></div>
          </label>
        </div>

        <div className="p-4 bg-white/30 rounded-lg">
          <h3 className="font-medium text-slate-800 mb-3">リマインド時間</h3>
          <select
            value={notificationSettings.reminderTime}
            onChange={(e) => setNotificationSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
            className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-400 backdrop-blur-xl"
          >
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-800">承認通知のみ</h3>
            <p className="text-sm text-slate-600">承認が必要な通知のみ受信</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.approvalOnly}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, approvalOnly: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNotificationSave}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
        >
          <Save className="w-5 h-5" />
          <span>保存</span>
        </button>
      </div>
    </div>
  );

  const renderAccountingTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">会計ソフト設定</h3>
        <p className="text-slate-600">会計ソフト連携機能は現在開発中です</p>
      </div>

      <div className="text-center">
        <div className="bg-slate-100 rounded-lg p-8">
          <Link className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">この機能は今後のアップデートで提供予定です</p>
        </div>
      </div>

      <div className="bg-blue-50/50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-3">会計ソフト連携のメリット</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>出張費の仕訳が自動で作成されます</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>手動での入力作業が不要になります</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>経理業務の効率化が図れます</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>入力ミスを防ぐことができます</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">ユーザー管理</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200">
          <Users className="w-4 h-4" />
          <span>ユーザー招待</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/30 border-b border-white/30">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-700">氏名</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">メール</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">役割</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">ステータス</th>
              <th className="text-center py-3 px-4 font-medium text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/20">
              <td className="py-3 px-4 text-slate-800">山田太郎</td>
              <td className="py-3 px-4 text-slate-700">yamada@example.com</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-red-700 bg-red-100">管理者</span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-100">アクティブ</span>
              </td>
              <td className="py-3 px-4 text-center">
                <button className="text-slate-600 hover:text-slate-800">編集</button>
              </td>
            </tr>
            <tr className="border-b border-white/20">
              <td className="py-3 px-4 text-slate-800">佐藤花子</td>
              <td className="py-3 px-4 text-slate-700">sato@example.com</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-100">承認者</span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-100">アクティブ</span>
              </td>
              <td className="py-3 px-4 text-center">
                <button className="text-slate-600 hover:text-slate-800">編集</button>
              </td>
            </tr>
            <tr className="border-b border-white/20">
              <td className="py-3 px-4 text-slate-800">田中次郎</td>
              <td className="py-3 px-4 text-slate-700">tanaka@example.com</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-slate-700 bg-slate-100">一般</span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-amber-700 bg-amber-100">招待中</span>
              </td>
              <td className="py-3 px-4 text-center">
                <button className="text-slate-600 hover:text-slate-800">編集</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlanTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">現在のプラン</h3>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-full font-medium">
          <CreditCard className="w-5 h-5 mr-2" />
          Pro プラン
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/30 rounded-xl p-6 border border-white/30">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Free</h4>
          <div className="text-3xl font-bold text-slate-800 mb-2">¥0<span className="text-sm font-normal">/月</span></div>
          <p className="text-sm text-slate-600 mb-4">ユーザー上限：1名まで</p>
          <ul className="space-y-2 text-sm text-slate-600 mb-6">
            <li>• 出張旅費規程の自動生成</li>
            <li>• 節税シミュレーション</li>
          </ul>
          <button className="w-full py-2 px-4 bg-slate-200 text-slate-600 rounded-lg cursor-not-allowed">
            無料プラン
          </button>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-navy-600/20 to-navy-800/20 rounded-xl p-6 border-2 border-navy-600/50 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-navy-600 to-navy-800 text-white px-4 py-1 rounded-full text-xs font-medium">
              現在のプラン
            </span>
          </div>
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Pro</h4>
          <div className="text-3xl font-bold text-slate-800 mb-2">¥9,800<span className="text-sm font-normal">/月</span></div>
          <p className="text-sm text-slate-600 mb-4">ユーザー上限：3名まで</p>
          <ul className="space-y-2 text-sm text-slate-600 mb-6">
            <li>• 全機能利用可能</li>
            <li>• ワンタイム承認</li>
            <li>• IPFS保存（証憑の改ざん防止）</li>
            <li>• API連携</li>
          </ul>
          <button className="w-full py-2 px-4 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg">
            現在のプラン
          </button>
        </div>

        <div className="backdrop-blur-xl bg-white/30 rounded-xl p-6 border border-white/30">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Enterprise</h4>
          <div className="text-3xl font-bold text-slate-800 mb-2">¥15,800<span className="text-sm font-normal">/月</span></div>
          <p className="text-sm text-slate-600 mb-4">ユーザー上限：無制限</p>
          <ul className="space-y-2 text-sm text-slate-600 mb-6">
            <li>• Pro機能すべて</li>
            <li>• 組織細分化（部署・拠点ごとの管理）</li>
            <li>• 第二管理者設定</li>
            <li>• 承認フロー自由設定</li>
          </ul>
          <button className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-900 transition-all duration-200">
            アップグレード
          </button>
        </div>
      </div>

      <div className="bg-white/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">請求履歴</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div>
              <p className="font-medium text-slate-800">2024年7月分</p>
              <p className="text-sm text-slate-600">Pro プラン</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-slate-800">¥9,800</p>
              <button className="text-sm text-navy-600 hover:text-navy-800">領収書DL</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div>
              <p className="font-medium text-slate-800">2024年6月分</p>
              <p className="text-sm text-slate-600">Pro プラン</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-slate-800">¥9,800</p>
              <button className="text-sm text-navy-600 hover:text-navy-800">領収書DL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="flex h-screen relative">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="my-page" />
        </div>

        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="my-page" />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
          
          <div className="flex-1 overflow-auto p-4 lg:p-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-8">マイページ（設定）</h1>

              {/* タブナビゲーション */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl border border-white/30 shadow-xl mb-6">
                <div className="flex flex-wrap border-b border-white/30">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'text-navy-800 border-b-2 border-navy-600 bg-white/20'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* タブコンテンツ */}
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-6 border border-white/30 shadow-xl">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'allowances' && renderAllowancesTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'accounting' && renderAccountingTab()}
                {activeTab === 'users' && (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">ユーザー管理</h3>
                    <p className="text-slate-600 mb-6">チームメンバーの招待と管理を行います</p>
                    <button
                      onClick={() => onNavigate('user-management')}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-800 text-white rounded-lg font-medium hover:from-navy-700 hover:to-navy-900 transition-all duration-200 mx-auto"
                    >
                      <Users className="w-5 h-5" />
                      <span>ユーザー管理画面を開く</span>
                    </button>
                  </div>
                )}
                {activeTab === 'plan' && renderPlanTab()}
              </div>
            </div>
          </div>

          {/* パスワード変更モーダル */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">パスワード変更</h3>
                <p className="text-slate-600 mb-6">
                  セキュリティのため、パスワード変更はメール経由で行います。
                  登録済みのメールアドレスにパスワードリセット用のリンクを送信いたします。
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      onNavigate('password-reset');
                    }}
                    className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
                  >
                    リセットメールを送信
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPage;