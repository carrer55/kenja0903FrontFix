import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  position: string | null;
  phone: string | null;
  role: 'admin' | 'department_admin' | 'approver' | 'general_user';
  plan: 'Free' | 'Pro' | 'Enterprise';
  departmentId?: string;
  departmentName?: string;
  createdAt: string;
  invitedBy?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string; data?: UserProfile }>;
  loading: boolean;
  userRole: 'admin' | 'department_admin' | 'approver' | 'general_user';
  userPlan: 'Free' | 'Pro' | 'Enterprise';
  hasPermission: (permission: string) => boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile, loading, userRole, userPlan } = useAuth();

  const profile = user ? {
    id: user.id,
    email: user.email,
    name: user.name,
    company: user.company,
    position: user.position,
    phone: user.phone,
    role: user.role,
    plan: user.plan,
    departmentId: user.departmentId,
    departmentName: user.departmentName,
    createdAt: user.createdAt,
    invitedBy: user.invitedBy
  } : null;

  // 権限チェック関数
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const { role, plan } = user;
    
    switch (permission) {
      case 'user_management':
        return role === 'admin';
      case 'plan_management':
        return role === 'admin';
      case 'accounting_software':
        return role === 'admin';
      case 'tax_simulation':
        return role === 'admin';
      case 'travel_regulation_management':
        return role === 'admin';
      case 'department_management':
        return role === 'admin' || (role === 'department_admin' && plan === 'Enterprise');
      case 'approval_actions':
        return role === 'admin' || role === 'department_admin' || role === 'approver';
      case 'view_all_applications':
        return role === 'admin';
      case 'view_department_applications':
        return role === 'admin' || role === 'department_admin';
      default:
        return true; // デフォルトは許可
    }
  };
  return (
    <UserProfileContext.Provider value={{ 
      profile, 
      updateProfile, 
      loading, 
      userRole, 
      userPlan, 
      hasPermission 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}