import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, Link2, Eye, Image as ImageIcon } from 'lucide-react';
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

  // Extract Instagram ID
  const instagramMatch = currentPhoto.src.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/i);
  const postId = instagramMatch ? instagramMatch[2] : null;

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
              title="원본 인스타그램 게시물"
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
          className="relative max-w-5xl max-h-[85vh] md:max-h-[90vh] flex items-center justify-center pointer-events-auto"
        >
          {postId ? (
            <div className="flex flex-col items-center bg-zinc-950/40 p-3 rounded-2xl border border-zinc-900/45">
              <iframe
                src={`https://www.instagram.com/p/${postId}/embed/captioned/?cr=1&v=14`}
                className="w-[295px] sm:w-[380px] md:w-[480px] lg:w-[520px] h-[550px] sm:h-[660px] md:h-[740px] lg:h-[780px] max-h-[82vh] rounded-xl border-0 shadow-2xl bg-white select-none pointer-events-auto"
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <img
                src={getInstagramImageUrl(currentPhoto.src)}
                alt={currentPhoto.title}
                className="max-w-[90vw] max-h-[65vh] md:max-h-[72vh] object-contain rounded-lg border border-zinc-850 shadow-2xl"
                onError={(e) => {
                  // Automatically load fallback public high aesthetic Unsplash image
                  e.currentTarget.src = currentPhoto.fallbackText;
                }}
              />
            </div>
          )}
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
          <p className="text-[10px] md:text-xs text-zinc-500 max-w-sm leading-relaxed font-sans font-light">
            ※ 상세 피드 뷰에서는 실시간 슬라이드 스와이프, 동영상 재생 및 정보 확인이 가능합니다.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
