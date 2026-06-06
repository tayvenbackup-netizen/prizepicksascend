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
  const [isClient, setIsClient] = useState(false);
  const [introReady, setIntroReady] = useState(false);
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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || introDone || introStarted) return;

    const video = introVideoRef.current;
    if (!video) return;

    const startPlayback = async () => {
      try {
        video.muted = true;
        video.defaultMuted = true;
        video.currentTime = 0;
        await video.play();
        setIntroStarted(true);
      } catch {}
    };

    void startPlayback();
    const retryTimer = window.setInterval(() => {
      if (!introStarted) {
        void startPlayback();
      }
    }, 250);

    return () => window.clearInterval(retryTimer);
  }, [introDone, introStarted, isClient]);

  useEffect(() => {
    if (!isClient || introDone || introStarted) return;

    const video = introVideoRef.current;
    if (!video) return;

    const resumePlayback = () => {
      void video.play().then(() => setIntroStarted(true)).catch(() => undefined);
    };

    window.addEventListener('pointerdown', resumePlayback, { once: true });
    return () => window.removeEventListener('pointerdown', resumePlayback);
  }, [introDone, introStarted, isClient]);

  const appContent = isAuthed ? (
    <AccessContext.Provider value={{ isAdmin }}>
      {children}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        subAdminId={session?.is_sub_admin ? session.sub_admin_id : undefined}
      />
    </AccessContext.Provider>
  ) : isLoading ? (
    <div className="fixed inset-0 bg-background" />
  ) : (
    <KeyEntryScreen onValidate={validateKey} error={error} />
  );

  return (
    <>
      {appContent}
      {isClient && !introDone ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
          <video
            ref={introVideoRef}
            src={introVideo.url}
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setIntroReady(true)}
            onCanPlay={() => setIntroReady(true)}
            onPlaying={() => {
              setIntroReady(true);
              setIntroStarted(true);
            }}
            onEnded={() => setIntroDone(true)}
            onError={() => setIntroDone(true)}
            disablePictureInPicture
            controls={false}
            className={`h-full w-full object-cover transition-opacity duration-300 ${introReady ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      ) : null}
    </>
  );
};
