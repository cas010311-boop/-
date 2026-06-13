import React from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink, Video } from 'lucide-react';
import { VideoItem } from '../types';

export interface VideoCardProps {
  video: VideoItem;
  onPlay: (youtubeId: string) => void;
  key?: string | number; // Fallback for strict mapping attributes
}

export default function VideoCard({ video, onPlay }: VideoCardProps): React.JSX.Element {
  const handleCardClick = (e: React.MouseEvent) => {
    if (video.youtubeId) {
      e.preventDefault();
      onPlay(video.youtubeId);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-zinc-900/40 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700/60 transition-all duration-300"
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCardClick}
        className="block aspect-video w-full relative overflow-hidden bg-black/40"
      >
        {video.youtubeId ? (
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=480';
            }}
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative transition-all duration-700 ease-out group-hover:scale-105 ${
            video.title.includes('쿠팡')
              ? 'bg-gradient-to-br from-[#FF4E50] via-[#F9D423] to-[#FF4E50]/80'
              : 'bg-gradient-to-br from-[#11998e] to-[#38ef7d]'
          }`}>
            {/* Ambient glows */}
            <div className="absolute -inset-1 bg-white/5 blur-sm opacity-50 rounded-lg pointer-events-none" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            
            <Video className="w-9 h-9 text-white/95 mb-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-pulse-slow" />
            
            <div className="text-center relative z-10">
              <span className="text-white text-md font-display font-black tracking-widest block uppercase drop-shadow-[0_1px_5px_rgba(0,0,0,0.15)]">
                {video.title.includes('쿠팡') ? 'Coupang Live' : 'Naver Live'}
              </span>
              <span className="text-white/80 text-[10px] uppercase font-mono tracking-wider mt-1 block">
                Live Broadcast
              </span>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {video.youtubeId ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center shadow-lg"
            >
              <Play className="w-5 h-5 fill-black pl-0.5" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-zinc-800 text-white flex items-center justify-center shadow-lg border border-zinc-700"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        {/* Badge of Year & Platform */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-bold rounded bg-black/70 text-accent border border-accent/20">
            {video.year}
          </span>
          {video.isNaverLive && (
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-bold rounded bg-[#2DB400]/90 text-white">
              LIVE
            </span>
          )}
        </div>
      </a>

      {/* Details info */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-2">
        <div>
          <h4 className="font-sans font-semibold text-white group-hover:text-accent transition-colors duration-300 line-clamp-1 text-base antialiased">
            {video.title}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
            {video.role}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            {video.youtubeId ? 'YOUTUBE' : 'EXTERNAL'}
          </span>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCardClick}
            className="text-xs font-semibold text-accent/80 hover:text-accent flex items-center gap-1 transition-colors"
          >
            {video.youtubeId ? '상세 감상' : '바로가기'} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
