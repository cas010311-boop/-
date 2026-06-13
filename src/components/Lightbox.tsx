import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, Link2 } from 'lucide-react';
import { PhotoItem } from '../types';
import { getInstagramImageUrl } from '../utils';

interface LightboxProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}: LightboxProps) {
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      >
        {/* Header Controls */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-zinc-400 tracking-wider font-bold">
              AJIN PREMIUM ARCHIVE • {currentIndex + 1} / {photos.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Direct Image Link */}
            <a
              href={currentPhoto.src}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-accent hover:border-accent/40 hover:bg-zinc-800 transition-all"
              title="원본 이미지 주소"
            >
              <Link2 className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-accent hover:border-accent/40 hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Previous Navigation Button */}
        <button
          onClick={onPrev}
          className="absolute left-6 md:left-12 p-3 rounded-full bg-zinc-900/40 border border-zinc-850 text-white hover:text-accent hover:bg-zinc-900 hover:border-accent transition-all z-10 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Center Main Photo Frame */}
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl max-h-[75vh] md:max-h-[80vh] flex items-center justify-center pointer-events-auto"
        >
          <img
            src={getInstagramImageUrl(currentPhoto.src)}
            alt={currentPhoto.title}
            className="max-w-[90vw] max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg border border-zinc-800"
            onError={(e) => {
              // Automatically load fallback public high aesthetic Unsplash image
              e.currentTarget.src = currentPhoto.fallbackText;
            }}
          />
        </motion.div>

        {/* Next Navigation Button */}
        <button
          onClick={onNext}
          className="absolute right-6 md:right-12 p-3 rounded-full bg-zinc-900/40 border border-zinc-850 text-white hover:text-accent hover:bg-zinc-900 hover:border-accent transition-all z-10 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 animate-pulse-slow" />
        </button>

        {/* Footer info/controls */}
        <div className="absolute bottom-6 text-center select-none">
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-sans font-light">
            ※ 원본 이미지가 로드되지 않을 경우, 데모 플레이스홀더 이미지가 자동으로 적용됩니다.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
