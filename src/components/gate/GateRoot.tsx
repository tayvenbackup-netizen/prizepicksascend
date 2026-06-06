import { useEffect, useRef, useState, type ReactNode } from 'react';
import KeyEntryScreen from './KeyEntryScreen';
import AdminPanel from '../admin/AdminPanel';
import { useAccessControl } from '@/hooks/useAccessControl';
import { AccessContext } from '@/lib/accessContext';
import introVideo from '@/assets/intro.mp4.asset.json';

interface Props { children: ReactNode }

export const GateRoot = ({ children }: Props) => {
  const { isAuthed, isAdmin, isLoading, validateKey, error, session } = useAccessControl();
  const [adminOpen, setAdminOpen] = useState(false);
  const [introSrc, setIntroSrc] = useState<string | null>(null);
  const [introStarted, setIntroStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const open = () => setAdminOpen(true);
    window.addEventListener('ascend:open-admin', open);
    return () => window.removeEventListener('ascend:open-admin', open);
  }, []);

  useEffect(() => {
    document.body.dataset.isAdmin = isAdmin ? '1' : '0';
  }, [isAdmin]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const preloadIntro = async () => {
      try {
        const response = await fetch(introVideo.url, { cache: 'force-cache' });
        const blob = await response.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setIntroSrc(objectUrl);
      } catch {
        if (!cancelled) {
          setIntroSrc(introVideo.url);
        }
      }
    };

    void preloadIntro();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (!introSrc || introStarted || introDone) return;

    const video = introVideoRef.current;
    if (!video) return;

    const startPlayback = async () => {
      try {
        video.currentTime = 0;
        await video.play();
        setIntroStarted(true);
      } catch {
        setIntroStarted(false);
      }
    };

    void startPlayback();
  }, [introDone, introSrc, introStarted]);

  useEffect(() => {
    if (introDone || introStarted) return;

    const video = introVideoRef.current;
    if (!video) return;

    const resumePlayback = () => {
      void video.play().then(() => setIntroStarted(true)).catch(() => undefined);
    };

    window.addEventListener('pointerdown', resumePlayback, { once: true });
    return () => window.removeEventListener('pointerdown', resumePlayback);
  }, [introDone, introStarted]);

  const showIntroVideo = !introDone || isLoading;

  if (showIntroVideo) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
        {introSrc ? (
          <video
            ref={introVideoRef}
            src={introSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            onPlaying={() => setIntroStarted(true)}
            onEnded={() => setIntroDone(true)}
            className="h-full w-full object-cover"
          />
        ) : null}
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
