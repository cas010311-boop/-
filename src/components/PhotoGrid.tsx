import { motion } from 'motion/react';
import { Camera, ZoomIn } from 'lucide-react';
import { PhotoItem } from '../types';
import { getInstagramImageUrl } from '../utils';

interface PhotoGridProps {
  photos: PhotoItem[];
  onPhotoClick: (index: number) => void;
}

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
      {photos.map((photo, index) => {
        return (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={() => onPhotoClick(index)}
            className="group relative cursor-pointer aspect-[3/4] bg-neutral-900 border border-zinc-800/80 rounded-xl overflow-hidden shadow-md flex items-center justify-center transition-all duration-300"
          >
            {/* Visual background placeholder layer */}
            <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-zinc-700 font-mono text-xs flex-col gap-2 p-4 text-center">
              <Camera className="w-8 h-8 text-zinc-650 animate-pulse-slow" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-550">
                LOADING PHOTO
              </span>
            </div>

            {/* Main Photo Image with multi-fallback behavior */}
            <img
              src={getInstagramImageUrl(photo.src)}
              alt="Choi Ajin Photography"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-10"
              onError={(e) => {
                // When local 'port (x).jpg' fails to load (e.g. not uploaded yet),
                // it naturally degrades to show a beautiful high quality photography placeholder!
                e.currentTarget.src = photo.fallbackText;
              }}
            />

            {/* Hover overlay with detail look icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-accent text-black shadow-lg"
              >
                <ZoomIn className="w-5 h-5" />
              </motion.span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
