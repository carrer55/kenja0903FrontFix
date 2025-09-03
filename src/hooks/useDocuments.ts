import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Document {
  id: string;
  application_id: string | null;
  type: 'business_report' | 'expense_report' | 'allowance_detail' | 'travel_detail' | 'gps_log' | 'monthly_report' | 'annual_report';
  title: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  content_json: any | null;
  attachments_urls: string[] | null;
  // 関連データ
  created_by_name?: string;
  application_title?: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchDocuments = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          profiles!documents_created_by_user_id_fkey (
            full_name
          ),
          applications!documents_application_id_fkey (
            title
          )
        `)
        .order('created_at', { ascending: false });

      // 権限に応じてフィルタリング
      if (userRole === 'general_user') {
        query = query.eq('created_by_user_id', user.id);
      } else if (userRole === 'department_admin') {
        // 部署内のユーザーが作成した文書を表示
        query = query.eq('profiles.department_id', user.department_id);
      }
      // adminとapproverは全ての文書を表示

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const formattedDocuments: Document[] = data?.map(doc => ({
        ...doc,
        created_by_name: doc.profiles?.full_name,
        application_title: doc.applications?.title
      })) || [];

      setDocuments(formattedDocuments);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('文書データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'created_by_name' | 'application_title'>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from('documents')
        .insert({
          ...documentData,
          created_by_user_id: user.id
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchDocuments();
      return data;
    } catch (err) {
      console.error('Error creating document:', err);
      setError('文書の作成に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchDocuments();
      return data;
    } catch (err) {
      console.error('Error updating document:', err);
      setError('文書の更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('文書の削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitDocument = async (id: string) => {
    return updateDocument(id, {
      status: 'submitted'
    });
  };

  const approveDocument = async (id: string) => {
    return updateDocument(id, {
      status: 'approved'
    });
  };

  const rejectDocument = async (id: string) => {
    return updateDocument(id, {
      status: 'rejected'
    });
  };

  const uploadAttachment = async (file: File, documentId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentId}/${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading attachment:', err);
      throw new Error('ファイルのアップロードに失敗しました');
    }
  };

  const addAttachment = async (documentId: string, file: File) => {
    try {
      const attachmentUrl = await uploadAttachment(file, documentId);
      
      const document = documents.find(d => d.id === documentId);
      if (!document) throw new Error('文書が見つかりません');

      const updatedUrls = [...(document.attachments_urls || []), attachmentUrl];
      
      await updateDocument(documentId, {
        attachments_urls: updatedUrls
      });
    } catch (err) {
      console.error('Error adding attachment:', err);
      throw err;
    }
  };

  const removeAttachment = async (documentId: string, attachmentUrl: string) => {
    try {
      const document = documents.find(d => d.id === documentId);
      if (!document) throw new Error('文書が見つかりません');

      const updatedUrls = document.attachments_urls?.filter(url => url !== attachmentUrl) || [];
      
      await updateDocument(documentId, {
        attachments_urls: updatedUrls
      });
    } catch (err) {
      console.error('Error removing attachment:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, userRole]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    submitDocument,
    approveDocument,
    rejectDocument,
    addAttachment,
    removeAttachment
  };
}
