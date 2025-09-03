import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserAllowanceSettings {
  user_id: string;
  domestic_daily_allowance: number;
  domestic_accommodation: number;
  domestic_transportation: number;
  domestic_accommodation_disabled: boolean;
  domestic_transportation_disabled: boolean;
  overseas_daily_allowance: number;
  overseas_accommodation: number;
  overseas_transportation: number;
  overseas_preparation_fee: number;
  overseas_accommodation_disabled: boolean;
  overseas_transportation_disabled: boolean;
  overseas_preparation_fee_disabled: boolean;
}

export interface UserNotificationSettings {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  reminder_time: string;
  approval_only: boolean;
}

export function useUserSettings() {
  const [allowanceSettings, setAllowanceSettings] = useState<UserAllowanceSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<UserNotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserSettings = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // 手当設定を取得
      const { data: allowanceData, error: allowanceError } = await supabase
        .from('user_allowance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (allowanceError && allowanceError.code !== 'PGRST116') {
        throw allowanceError;
      }

      // 通知設定を取得
      const { data: notificationData, error: notificationError } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (notificationError && notificationError.code !== 'PGRST116') {
        throw notificationError;
      }

      setAllowanceSettings(allowanceData);
      setNotificationSettings(notificationData);
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError('設定の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    try {
      // デフォルトの手当設定を作成
      if (!allowanceSettings) {
        const { error: allowanceError } = await supabase
          .from('user_allowance_settings')
          .insert({
            user_id: user.id,
            domestic_daily_allowance: 0,
            domestic_accommodation: 0,
            domestic_transportation: 0,
            domestic_accommodation_disabled: false,
            domestic_transportation_disabled: false,
            overseas_daily_allowance: 0,
            overseas_accommodation: 0,
            overseas_transportation: 0,
            overseas_preparation_fee: 0,
            overseas_accommodation_disabled: false,
            overseas_transportation_disabled: false,
            overseas_preparation_fee_disabled: false
          });

        if (allowanceError) {
          throw allowanceError;
        }
      }

      // デフォルトの通知設定を作成
      if (!notificationSettings) {
        const { error: notificationError } = await supabase
          .from('user_notification_settings')
          .insert({
            user_id: user.id,
            email_notifications: true,
            push_notifications: true,
            reminder_time: '09:00:00',
            approval_only: false
          });

        if (notificationError) {
          throw notificationError;
        }
      }

      await fetchUserSettings();
    } catch (err) {
      console.error('Error creating default settings:', err);
      setError('デフォルト設定の作成に失敗しました');
    }
  };

  const updateAllowanceSettings = async (updates: Partial<UserAllowanceSettings>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('user_allowance_settings')
        .upsert({
          user_id: user.id,
          ...updates
        })
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setAllowanceSettings(data);
    } catch (err) {
      console.error('Error updating allowance settings:', err);
      setError('手当設定の更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async (updates: Partial<UserNotificationSettings>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...updates
        })
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setNotificationSettings(data);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('通知設定の更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  return {
    allowanceSettings,
    notificationSettings,
    loading,
    error,
    fetchUserSettings,
    createDefaultSettings,
    updateAllowanceSettings,
    updateNotificationSettings
  };
}
