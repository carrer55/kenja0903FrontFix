import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Application {
  id: string;
  created_at: string;
  updated_at: string;
  applicant_id: string;
  department_id: string;
  title: string;
  type: 'business_trip_request' | 'expense_request' | 'business_report' | 'expense_report';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'returned' | 'on_hold' | 'completed';
  total_amount: number | null;
  current_approver_id: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  priority: 'high' | 'medium' | 'low';
  days_waiting: number | null;
  metadata: any | null;
  // 関連データ
  applicant_name?: string;
  department_name?: string;
  approver_name?: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchApplications = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_applicant_id_fkey (
            full_name
          ),
          departments!applications_department_id_fkey (
            department_name
          ),
          approver:profiles!applications_current_approver_id_fkey (
            full_name
          ),
          business_trip_details (*),
          expense_details (
            *,
            expense_items (*)
          ),
          attachments (*)
        `)
        .order('created_at', { ascending: false });

      // 権限に応じてフィルタリング
      if (userRole === 'general_user') {
        query = query.eq('applicant_id', user.id);
      } else if (userRole === 'department_admin') {
        query = query.eq('department_id', user.department_id);
      } else if (userRole === 'approver') {
        query = query.or(`applicant_id.eq.${user.id},current_approver_id.eq.${user.id},department_id.eq.${user.department_id}`);
      }
      // adminは全ての申請を表示

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const formattedApplications: Application[] = data?.map(app => ({
        ...app,
        applicant_name: app.profiles?.full_name,
        department_name: app.departments?.department_name || app.department_management?.department_name,
        approver_name: app.approver?.full_name
      })) || [];

      setApplications(formattedApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('申請データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'applicant_name' | 'department_name' | 'approver_name'>) => {
    if (!user) throw new Error('ユーザーが認証されていません');

    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from('applications')
        .insert({
          ...applicationData,
          applicant_id: user.id,
          department_id: user.department_id || '550e8400-e29b-41d4-a716-446655440001'
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchApplications(); // リストを更新
      return data;
    } catch (err) {
      console.error('Error creating application:', err);
      setError('申請の作成に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchApplications(); // リストを更新
      return data;
    } catch (err) {
      console.error('Error updating application:', err);
      setError('申請の更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchApplications(); // リストを更新
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('申請の削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id: string, comment?: string) => {
    const result = await updateApplication(id, {
      status: 'approved',
      approved_at: new Date().toISOString(),
      current_approver_id: user?.id || null
    });

    // 承認ログを記録
    if (result && user) {
      await supabase
        .from('approval_logs')
        .insert({
          application_id: id,
          approver_id: user.id,
          action: 'approved',
          comment: comment || null,
          previous_status: 'pending',
          new_status: 'approved'
        });
    }

    return result;
  };

  const rejectApplication = async (id: string, reason: string) => {
    const result = await updateApplication(id, {
      status: 'rejected',
      rejection_reason: reason,
      current_approver_id: user?.id || null
    });

    // 否認ログを記録
    if (result && user) {
      await supabase
        .from('approval_logs')
        .insert({
          application_id: id,
          approver_id: user.id,
          action: 'rejected',
          comment: reason,
          previous_status: 'pending',
          new_status: 'rejected'
        });
    }

    return result;
  };

  const submitApplication = async (id: string) => {
    const result = await updateApplication(id, {
      status: 'pending',
      submitted_at: new Date().toISOString()
    });

    // 提出ログを記録
    if (result && user) {
      await supabase
        .from('approval_logs')
        .insert({
          application_id: id,
          approver_id: user.id,
          action: 'submitted',
          comment: null,
          previous_status: 'draft',
          new_status: 'pending'
        });
    }

    return result;
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, userRole]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    approveApplication,
    rejectApplication,
    submitApplication
  };
}
