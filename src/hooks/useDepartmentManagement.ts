import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DepartmentManagement {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  department_name: string;
  description?: string;
  manager_id?: string;
  max_members: number;
  is_active: boolean;
  created_by: string;
  manager?: {
    id: string;
    full_name: string;
    email: string;
  };
  created_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
  member_count?: number;
}

export interface UserInvitation {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  department_id?: string;
  email: string;
  full_name?: string;
  position?: string;
  role: 'admin' | 'department_admin' | 'approver' | 'general_user';
  invited_by: string;
  invitation_token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  accepted_at?: string;
  declined_at?: string;
  department?: {
    id: string;
    department_name: string;
  };
  invited_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface DepartmentMembership {
  id: string;
  created_at: string;
  user_id: string;
  department_id: string;
  joined_at: string;
  left_at?: string;
  is_active: boolean;
  user?: {
    id: string;
    full_name: string;
    email: string;
    position: string;
  };
  department?: {
    id: string;
    department_name: string;
    description?: string;
  };
}

export const useDepartmentManagement = () => {
  const [departments, setDepartments] = useState<DepartmentManagement[]>([]);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [memberships, setMemberships] = useState<DepartmentMembership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 部署一覧を取得
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('department_management')
        .select(`
          *,
          manager:profiles!department_management_manager_id_fkey(id, full_name, email),
          created_by_user:profiles!department_management_created_by_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 各部署のメンバー数を取得
      const departmentsWithMemberCount = await Promise.all(
        data.map(async (dept) => {
          const { count } = await supabase
            .from('department_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('department_id', dept.id)
            .eq('is_active', true);

          return {
            ...dept,
            member_count: count || 0
          };
        })
      );

      setDepartments(departmentsWithMemberCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : '部署の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 招待一覧を取得
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_invitations')
        .select(`
          *,
          department:department_management(id, department_name),
          invited_by_user:profiles!user_invitations_invited_by_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '招待の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // メンバーシップ一覧を取得
  const fetchMemberships = async (departmentId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('department_memberships')
        .select(`
          *,
          user:profiles!department_memberships_user_id_fkey(id, full_name, email, position),
          department:department_management(id, department_name, description)
        `)
        .eq('is_active', true)
        .order('joined_at', { ascending: false });

      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMemberships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メンバーシップの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 部署を作成
  const createDepartment = async (departmentData: {
    department_name: string;
    description?: string;
    manager_id?: string;
    max_members?: number;
  }) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('ユーザーが認証されていません');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.user.id)
        .single();

      if (!profile) throw new Error('プロフィールが見つかりません');

      const { data, error } = await supabase
        .from('department_management')
        .insert({
          company_id: profile.company_id,
          department_name: departmentData.department_name,
          description: departmentData.description,
          manager_id: departmentData.manager_id,
          max_members: departmentData.max_members || 100,
          created_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchDepartments();
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : '部署の作成に失敗しました');
      return { success: false, error: err instanceof Error ? err.message : '部署の作成に失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  // 部署を更新
  const updateDepartment = async (id: string, updates: Partial<DepartmentManagement>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('department_management')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchDepartments();
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : '部署の更新に失敗しました');
      return { success: false, error: err instanceof Error ? err.message : '部署の更新に失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  // 部署を削除
  const deleteDepartment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('department_management')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchDepartments();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : '部署の削除に失敗しました');
      return { success: false, error: err instanceof Error ? err.message : '部署の削除に失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  // ユーザーを招待
  const inviteUser = async (invitationData: {
    email: string;
    full_name?: string;
    position?: string;
    role?: 'admin' | 'department_admin' | 'approver' | 'general_user';
    department_id?: string;
  }) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('ユーザーが認証されていません');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.user.id)
        .single();

      if (!profile) throw new Error('プロフィールが見つかりません');

      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          company_id: profile.company_id,
          department_id: invitationData.department_id,
          email: invitationData.email,
          full_name: invitationData.full_name,
          position: invitationData.position,
          role: invitationData.role || 'general_user',
          invited_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchInvitations();
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ユーザーの招待に失敗しました');
      return { success: false, error: err instanceof Error ? err.message : 'ユーザーの招待に失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  // 招待をキャンセル
  const cancelInvitation = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchInvitations();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : '招待のキャンセルに失敗しました');
      return { success: false, error: err instanceof Error ? err.message : '招待のキャンセルに失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  // メンバーを部署に追加
  const addMemberToDepartment = async (userId: string, departmentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('department_memberships')
        .insert({
          user_id: userId,
          department_id: departmentId
        })
        .select()
        .single();

      if (error) throw error;

      await fetchMemberships();
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メンバーの追加に失敗しました');
      return { success: false, error: err instanceof Error ? err.message : 'メンバーの追加に失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  // メンバーを部署から削除
  const removeMemberFromDepartment = async (membershipId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('department_memberships')
        .update({
          is_active: false,
          left_at: new Date().toISOString()
        })
        .eq('id', membershipId);

      if (error) throw error;

      await fetchMemberships();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メンバーの削除に失敗しました');
      return { success: false, error: err instanceof Error ? err.message : 'メンバーの削除に失敗しました' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchInvitations();
    fetchMemberships();
  }, []);

  return {
    departments,
    invitations,
    memberships,
    loading,
    error,
    fetchDepartments,
    fetchInvitations,
    fetchMemberships,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    inviteUser,
    cancelInvitation,
    addMemberToDepartment,
    removeMemberFromDepartment
  };
};
