import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Calendar, Music2, Instagram, Camera, Youtube, Sparkles, Send, Play, X, Sliders, ExternalLink, Copy, Check } from 'lucide-react';

import { ProfileData, VideoItem, PhotoItem } from './types';
import { INITIAL_PROFILE, INITIAL_VIDEOS, INITIAL_PHOTOS } from './data';

import Header from './components/Header';
import VideoCard from './components/VideoCard';
import PhotoGrid from './components/PhotoGrid';
import Lightbox from './components/Lightbox';
import ImageCustomizer from './components/ImageCustomizer';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  // Load settings from localstorage if available as baseline
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('choi_ajin_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('choi_ajin_photos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PHOTOS;
      }
    }
    return INITIAL_PHOTOS;
  });

  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeFilter, setActiveFilter] = useState<'all' | '~2023' | '2024' | '2025' | '2026'>('all');
  const [activeYoutubeUrl, setActiveYoutubeUrl] = useState<string | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Customizer Drawer State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Copy to clipboard helper state
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  // Fetch true server-side saved settings on startup to ensure persistence for all visitors
  useEffect(() => {
    const docRef = doc(db, "portfolio", "global_config");
    getDoc(docRef)
      .then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profile) {
            setProfile(data.profile);
            // Keep localStorage up-to-date
            localStorage.setItem('choi_ajin_profile', JSON.stringify(data.profile));
          }
          if (data.photos) {
            setPhotos(data.photos);
            // Keep localStorage up-to-date
            localStorage.setItem('choi_ajin_photos', JSON.stringify(data.photos));
          }
        }
      })
      .catch(err => {
        console.error('Error fetching data directly from Firestore on client side:', err);
      });
  }, []);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  // Save updates to localstorage AND server
  const handleSaveProfile = async (newProfile: ProfileData) => {
    setProfile(newProfile);
    localStorage.setItem('choi_ajin_profile', JSON.stringify(newProfile));
    try {
      const docRef = doc(db, "portfolio", "global_config");
      await setDoc(docRef, { profile: newProfile }, { merge: true });
    } catch (e) {
      console.error('Failed to sync profile change directly to Firestore:', e);
    }
  };

  const handleSavePhotos = async (newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('choi_ajin_photos', JSON.stringify(newPhotos));
    try {
      const docRef = doc(db, "portfolio", "global_config");
      await setDoc(docRef, { photos: newPhotos }, { merge: true });
    } catch (e) {
      console.error('Failed to sync photos change directly to Firestore:', e);
    }
  };

  const filteredVideos = videos.filter(video => {
    if (activeFilter === 'all') return true;
    return video.year === activeFilter;
  });

  // Lightbox nav handlers
  const handleNextPhoto = () => {
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-accent selection:text-black overflow-x-hidden antialiased">
      
      {/* HEADER NAVBAR */}
      <Header onOpenCustomizer={() => setIsCustomizerOpen(true)} />

      {/* BACKGROUND DECORATIVE FLOATER */}
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/5 blur-[100px] pointer-events-none z-0" />

      {/* PROFILE/HERO SECTION */}
      <section id="profile" className="min-h-screen flex items-center pt-28 pb-16 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Main profile brief info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 w-fit font-sans">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse-slow" />
              <span className="text-[10px] text-accent font-bold tracking-wider">
                영상 연출 & 촬영 & 편집 포트폴리오
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight antialiased">
              안녕하세요, <br />
              영상 제작자 <span className="text-accent underline decoration-accent/30 underline-offset-8 decoration-wavy">{profile.name}</span>입니다
            </h1>
            
            <p className="text-zinc-305 text-md md:text-lg leading-relaxed font-sans font-light max-w-xl whitespace-pre-line">
              {profile.description}
            </p>

            <div className="mt-4 border-t border-zinc-900 pt-7 flex flex-col gap-5">
              <div>
                <span className="text-[10px] text-accent uppercase tracking-widest font-mono font-bold block mb-2">
                  TOOLS & SKILLS
                </span>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                  {profile.skills}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-2">
                <a 
                  href={`mailto:${profile.email}`} 
                  className="flex items-center gap-2 text-xs font-sans font-bold text-white hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4 text-accent" />
                  {profile.email}
                </a>
                <a 
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 text-xs font-sans font-bold text-white hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  {profile.phone}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Profile photo layout */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer decorative ring */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-accent/30 via-zinc-800 to-accent/40 blur-md opacity-70 animate-pulse-slow" />
              
              {/* Image Frame */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-zinc-900 shadow-2xl bg-zinc-950 flex items-center justify-center">
                <img 
                  src={profile.profileImage} 
                  alt={profile.name} 
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to gorgeous premium dark portrait camera graphic if image not uploaded locally
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=480";
                  }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* VIDEO WORK SECTION */}
      <section id="video" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight">
              VIDEO
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              포트폴리오 카드를 클릭하시면 브라우저에서 편리하게 즉시 영상을 시청하실 수 있습니다.
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2.5 mt-2 lg:mt-0 max-w-full">
            {(['all', '2026', '2025', '2024', '~2023'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-accent text-black font-bold shadow-lg shadow-accent/15'
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-850 hover:text-white hover:border-zinc-700'
                }`}
              >
                {filter === 'all' ? '전체 보기' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Video dynamic animate-presence grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(id) => setActiveYoutubeUrl(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* PHOTO WORK SECTION - LAVENDER ACCENTED BANNER LAYOUT */}
      <section id="photo" className="py-24 px-6 md:px-12 bg-[#D4AF37]/5 text-white/90 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-white tracking-tight uppercase">
                PHOTO
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                클릭하시면 고화질 갤러리 뷰로 상세 확인 및 슬라이드 감상이 가능합니다.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <a 
                href={profile.photoArchiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 group border border-zinc-800 bg-zinc-950/60 hover:bg-accent hover:text-black px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all w-fit shrink-0 cursor-pointer"
              >
                포토 아카이브 인스타그램 바로가기 <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Photos Grid components */}
          <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
        </div>
      </section>

      {/* CONTACT DIRECT SECTION */}
      <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 relative z-10 font-sans">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight uppercase">
            CONTACT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Email Bento Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-zinc-900/40 border border-zinc-850 p-8 rounded-3xl flex flex-col justify-between gap-6 hover:border-accent/40 hover:bg-zinc-900 transition-all duration-300 relative"
          >
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 w-fit text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <button
                onClick={() => handleCopy(profile.email, 'email')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-sans tracking-wide transition-all cursor-pointer ${
                  copiedType === 'email'
                    ? 'bg-accent text-black border border-accent shadow-md font-extrabold'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>이메일 복사</span>
                  </>
                )}
              </button>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-sans text-zinc-500 block mb-1.5 font-bold">EMAIL ADDRESS</span>
              <a href={`mailto:${profile.email}`} className="text-lg md:text-xl font-bold font-sans text-white hover:text-accent transition-colors block break-all">
                {profile.email}
              </a>
            </div>
          </motion.div>

          {/* Phone Bento Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-zinc-900/40 border border-zinc-850 p-8 rounded-3xl flex flex-col justify-between gap-6 hover:border-accent/40 hover:bg-zinc-900 transition-all duration-300 relative"
          >
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 w-fit text-accent">
                <Phone className="w-6 h-6" />
              </div>
              <button
                onClick={() => handleCopy(profile.phone, 'phone')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-sans tracking-wide transition-all cursor-pointer ${
                  copiedType === 'phone'
                    ? 'bg-accent text-black border border-accent shadow-md font-extrabold'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {copiedType === 'phone' ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>번호 복사</span>
                  </>
                )}
              </button>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-sans text-zinc-500 block mb-1.5 font-bold">PHONE NUMBER</span>
              <a href={`tel:${profile.phone}`} className="text-lg md:text-xl font-bold font-sans text-white hover:text-accent transition-colors block tracking-wide">
                {profile.phone}
              </a>
            </div>
          </motion.div>

          {/* Social Channels Bento Card Grid */}
          <div className="md:col-span-1 grid grid-cols-2 gap-4">
            <a 
              href={profile.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center gap-2.5 bg-zinc-900/40 border border-zinc-850 hover:border-accent hover:bg-accent hover:text-black rounded-2xl p-4 transition-all duration-300 group cursor-pointer"
            >
              <Instagram className="w-6 h-6 text-zinc-400 group-hover:text-black group-hover:scale-110 transition-all" />
              <span className="text-xs font-bold text-gray-250 group-hover:text-black text-center">인스타그램</span>
            </a>

            <a 
              href={profile.tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center gap-2.5 bg-zinc-900/40 border border-zinc-850 hover:border-accent hover:bg-accent hover:text-black rounded-2xl p-4 transition-all duration-300 group cursor-pointer"
            >
              <Music2 className="w-6 h-6 text-zinc-400 group-hover:text-black group-hover:scale-110 transition-all" />
              <span className="text-xs font-bold text-gray-250 group-hover:text-black text-center">틱톡 (TikTok)</span>
            </a>

            <a 
              href={profile.photoArchiveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center gap-2.5 bg-zinc-900/40 border border-zinc-850 hover:border-accent hover:bg-accent hover:text-black rounded-2xl p-4 transition-all duration-300 group cursor-pointer"
            >
              <Camera className="w-6 h-6 text-zinc-400 group-hover:text-black group-hover:scale-110 transition-all" />
              <span className="text-xs font-bold text-gray-250 group-hover:text-black text-center leading-tight">포토 아카이브</span>
            </a>

            <a 
              href={profile.monologueWorkshopUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center gap-2.5 bg-zinc-900/40 border border-zinc-850 hover:border-accent hover:bg-accent hover:text-black rounded-2xl p-4 transition-all duration-300 group cursor-pointer"
            >
              <Youtube className="w-6 h-6 text-zinc-400 group-hover:text-black group-hover:scale-110 transition-all" />
              <span className="text-xs font-bold text-gray-250 group-hover:text-black text-center">독백공방 YT</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER CHANNELS LIST */}
      <footer className="bg-zinc-950/80 border-t border-zinc-900/60 py-12 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <a href="#" className="font-display font-semibold text-2xl tracking-tighter text-white hover:text-accent transition-colors">
            AJIN
          </a>
          <p className="text-zinc-505 font-mono text-[10px] uppercase tracking-widest">
            CREATIVE DIRECTOR • VIDEO EDITING • FILMMAKER
          </p>
          <p className="text-zinc-600 text-[10px] font-sans antialiased">
            © {new Date().getFullYear()} Choi Ajin. All rights reserved.
          </p>
        </div>
      </footer>

      {/* PORTFOLIO ACCENT CONFIGURATOR FLOAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCustomizerOpen(true)}
          className="p-3.5 bg-accent text-black rounded-full shadow-2xl hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer"
          title="포트폴리오 직접 수정 커스터마이징"
        >
          <Sliders className="w-5 h-5 pointer-events-none" /> Settings
        </motion.button>
      </div>

      {/* DYNAMICAL CINEMATIC MODAL PLAYER (YOUTUBE MODAL) */}
      <AnimatePresence>
        {activeYoutubeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 flex items-center justify-center bg-black/95 p-4 md:p-8"
          >
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setActiveYoutubeUrl(null)} />
            
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 z-10 shadow-2xl">
              <button
                onClick={() => setActiveYoutubeUrl(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black border border-white/10 text-white transition-all z-20 cursor-pointer"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <iframe
                title="Cinematic Youtube Video Player"
                src={`https://www.youtube.com/embed/${activeYoutubeUrl}?autoplay=1&rel=0`}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE PHOTO GALLERY LIGHTBOX SYSTEM */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
      />

      {/* SETTINGS DRAWER CUSTOMIZER */}
      <ImageCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        photos={photos}
        onSavePhotos={handleSavePhotos}
      />

    </div>
  );
}
