import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  type: 'email' | 'push';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'approval' | 'reminder' | 'system' | 'update';
  related_application_id: string | null;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (fetchError) {
        throw fetchError;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('通知の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    if (!user) return;

    try {
      const { data, error: createError } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          user_id: user.id,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchNotifications();
      return data;
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('通知の作成に失敗しました');
      throw err;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('通知の既読更新に失敗しました');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (updateError) {
        throw updateError;
      }

      await fetchNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('通知の一括既読更新に失敗しました');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('通知の削除に失敗しました');
    }
  };

  const createApprovalNotification = async (applicationId: string, action: 'approved' | 'rejected' | 'returned') => {
    const actionLabels = {
      approved: '承認',
      rejected: '否認',
      returned: '差し戻し'
    };

    return createNotification({
      type: 'email',
      title: `申請が${actionLabels[action]}されました`,
      message: `申請が${actionLabels[action]}されました。詳細を確認してください。`,
      read: false,
      category: 'approval',
      related_application_id: applicationId
    });
  };

  const createReminderNotification = async (applicationId: string, message: string) => {
    return createNotification({
      type: 'email',
      title: '承認リマインダー',
      message,
      read: false,
      category: 'reminder',
      related_application_id: applicationId
    });
  };

  const createSystemNotification = async (title: string, message: string) => {
    return createNotification({
      type: 'email',
      title,
      message,
      read: false,
      category: 'system',
      related_application_id: null
    });
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createApprovalNotification,
    createReminderNotification,
    createSystemNotification
  };
}
