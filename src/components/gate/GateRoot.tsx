import { useEffect, useState, type ReactNode } from 'react';
import KeyEntryScreen from './KeyEntryScreen';
import AdminPanel from '../admin/AdminPanel';
import { useAccessControl } from '@/hooks/useAccessControl';
import { AccessContext } from '@/lib/accessContext';

interface Props { children: ReactNode }

export const GateRoot = ({ children }: Props) => {
  const { isAuthed, isAdmin, isLoading, validateKey, error, session } = useAccessControl();
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const open = () => setAdminOpen(true);
    window.addEventListener('ascend:open-admin', open);
    return () => window.removeEventListener('ascend:open-admin', open);
  }, []);

  useEffect(() => {
    document.body.dataset.isAdmin = isAdmin ? '1' : '0';
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: '#0a0a14', color: '#bbaefc' }}>
        <div className="text-xs uppercase tracking-[0.3em]">Ascend2k LarpPickz</div>
      </div>
    );
  }

  if (!isAuthed) {
    return <KeyEntryScreen onValidate={validateKey} error={error} />;
  }

  return (
    <AccessContext.Provider value={{ isAdmin }}>
      {children}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        subAdminId={session?.is_sub_admin ? session.sub_admin_id : undefined}
      />
    </AccessContext.Provider>
  );
};
