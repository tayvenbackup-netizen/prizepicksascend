import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props { onDone: () => void }

const IntroOverlay = ({ onDone }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);

  const finish = () => {
    setVisible(false);
    setTimeout(onDone, 650);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => finish());
    const fallback = setTimeout(finish, 5000);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden"
        >
          <video
            ref={videoRef}
            src="/media/intro.mp4"
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={finish}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
