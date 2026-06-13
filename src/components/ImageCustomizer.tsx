import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, RotateCcw, Link, MessageSquare, Trash2, Calendar, FileText, Check, Lock, Unlock, Upload } from 'lucide-react';
import { ProfileData, PhotoItem } from '../types';

const compressImage = (base64Str: string, maxWidth: number = 1000, maxHeight: number = 1000, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

interface ImageCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSaveProfile: (newProfile: ProfileData) => void;
  photos: PhotoItem[];
  onSavePhotos: (newPhotos: PhotoItem[]) => void;
}

export default function ImageCustomizer({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  photos,
  onSavePhotos
}: ImageCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'photos' | 'messages'>('profile');
  const [tempProfile, setTempProfile] = useState<ProfileData>({ ...profile });
  const [tempPhotos, setTempPhotos] = useState<PhotoItem[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Sync state with props when open
  useEffect(() => {
    if (isOpen) {
      setTempProfile({ ...profile });
      setTempPhotos(photos.map(p => ({ ...p })));
      // Retrieve contacts
      const saved = JSON.parse(localStorage.getItem('ajin_portfolio_messages') || '[]');
      setMessages(saved);
      setPassword('');
      setPasswordError(false);
    }
  }, [isOpen, profile, photos]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0311') {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(tempProfile);
    triggerSuccess();
    alert("✅ 프로필 정보가 성공적으로 저장되었습니다! 새로고침 후에도 유지됩니다.");
  };

  const handlePhotoChange = (id: string, newSrc: string) => {
    setTempPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, src: newSrc } : p))
    );
  };

  const handlePhotosSave = () => {
    try {
      onSavePhotos(tempPhotos);
      triggerSuccess();
      alert("✅ 갤러리 사진 정보가 성공적으로 저장되었습니다!");
    } catch (error) {
      alert("⚠️ 브라우저 이미지 저장 용량이 초과되었습니다. 다른 고도화 업로드 사진 중 일부를 제거하시거나, 짧은 URL 웹링크 형태로 입력하세요!");
    }
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const clearMessages = () => {
    if (confirm('모든 연락 메시지 보관함을 비우시겠습니까?')) {
      localStorage.removeItem('ajin_portfolio_messages');
      setMessages([]);
    }
  };

  const handleReset = () => {
    if (confirm('모든 설정값을 최초 기본값으로 강제 리셋하시겠습니까? (로컬 전용 데이터 초기화)')) {
      localStorage.removeItem('choi_ajin_profile');
      localStorage.removeItem('choi_ajin_photos');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-105 flex justify-end">
      {/* Background Dim Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Main Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg h-full bg-zinc-950 border-l border-zinc-850 flex flex-col items-stretch z-10 shadow-2xl"
      >
        {/* Header bar */}
        <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              실시간 포트폴리오 개인화 커스터마이저
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              이곳의 변경사항은 브라우저 공간에 임시 저장되어 즉시 적용됩니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 py-1 flex items-center gap-1.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors text-xs cursor-pointer font-semibold"
          >
            닫기 <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {!isUnlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 bg-zinc-950 select-none">
            <div className="p-4 rounded-full bg-accent/10 border border-accent/20 text-accent animate-pulse-slow">
              <Lock className="w-8 h-8" />
            </div>
            
            <div className="text-center space-y-2 max-w-xs">
              <h4 className="text-md font-bold text-white tracking-tight">관리자 인증 및 보안 잠금</h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed text-center">
                개인화 데이터를 편집할 수 있는 주 관리 공간입니다.<br />계속 진행하려면 비밀번호를 입력해 주세요.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-3.5">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="비밀번호 4자리 입력"
                  className={`w-full bg-zinc-900 border ${
                    passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-850 focus:border-accent'
                  } rounded-xl px-4 py-3 text-center text-sm text-white tracking-[0.25em] font-bold outline-none font-mono placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-600 placeholder:text-xs transition-colors`}
                  autoFocus
                  maxLength={10}
                />
              </div>

              {passwordError && (
                <p className="text-[11px] text-center font-semibold text-red-500 font-sans">
                  비밀번호가 일치하지 않습니다. 다시 시도해 주세요.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-accent hover:bg-white text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" /> 설정 잠금 해제
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tab buttons switcher */}
            <div className="flex border-b border-zinc-950 bg-zinc-900/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center border-b-2 font-medium tracking-wide transition-all ${
              activeTab === 'profile'
                ? 'border-accent text-accent bg-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            프로필 정보 편집
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3 text-center border-b-2 font-medium tracking-wide transition-all ${
              activeTab === 'photos'
                ? 'border-accent text-accent bg-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            사진 링크 관리 (인스타 등)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 text-center border-b-2 font-medium tracking-wide transition-all ${
              activeTab === 'messages'
                ? 'border-accent text-accent bg-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            연락 메시지 확인 ({messages.length})
          </button>
        </div>

        {/* Dynamic content tab body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/15 border border-accent/40 rounded-xl p-3 text-accent text-xs font-semibold flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> 성공적으로 브라우저 로컬 저장소에 동기화 완료!
            </motion.div>
          )}

          {/* TAB 1: PROFILE INFO EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                  제작자 한글 성함
                </label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                  메인 슬로건 타이틀
                </label>
                <input
                  type="text"
                  value={tempProfile.title}
                  onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                  프로필 이미지 주소 (Public URL) 또는 직접 업로드
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempProfile.profileImage}
                    onChange={(e) => setTempProfile({ ...tempProfile, profileImage: e.target.value })}
                    placeholder="이미지 주소 또는 직접 업로드"
                    className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent font-mono"
                  />
                  <label className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-lg px-3 py-2 text-[11px] font-semibold text-zinc-350 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    <span>업로드</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 15 * 1024 * 1024) {
                            alert('15MB 이하의 파일만 업로드할 수 있습니다!');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            if (typeof reader.result === 'string') {
                              try {
                                const compressed = await compressImage(reader.result, 800, 800, 0.85);
                                setTempProfile({ ...tempProfile, profileImage: compressed });
                              } catch (err) {
                                setTempProfile({ ...tempProfile, profileImage: reader.result });
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 block">
                  ※ 직접 프로필 사진을 골라 업로드하거나, 외부 이미지 전용 주소(URL)를 입력해도 완벽히 저장됩니다.
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                  상세 소개글 (Description)
                </label>
                <textarea
                  rows={3}
                  value={tempProfile.description}
                  onChange={(e) => setTempProfile({ ...tempProfile, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                  사용 보유 툴 및 기술 스킬
                </label>
                <input
                  type="text"
                  value={tempProfile.skills}
                  onChange={(e) => setTempProfile({ ...tempProfile, skills: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-semibold">
                    연락처 전화번호
                  </label>
                  <input
                    type="text"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400 block mb-3">
                  포토폴리오 SNS 링크 목록
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[9px] text-zinc-450 block mb-1">📸 Photo Archive Instagram</span>
                    <input
                      type="text"
                      value={tempProfile.photoArchiveUrl}
                      onChange={(e) => setTempProfile({ ...tempProfile, photoArchiveUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-450 block mb-1">✨ Personal Instagram</span>
                    <input
                      type="text"
                      value={tempProfile.instagramUrl}
                      onChange={(e) => setTempProfile({ ...tempProfile, instagramUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-450 block mb-1">🎵 TikTok</span>
                    <input
                      type="text"
                      value={tempProfile.tiktokUrl}
                      onChange={(e) => setTempProfile({ ...tempProfile, tiktokUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-450 block mb-1">🎬 독백공방 YouTube Channel</span>
                    <input
                      type="text"
                      value={tempProfile.monologueWorkshopUrl}
                      onChange={(e) => setTempProfile({ ...tempProfile, monologueWorkshopUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-black font-semibold text-xs py-2.5 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                <Save className="w-4 h-4" /> 프로필 저장하기
              </button>
            </form>
          )}

          {/* TAB 2: PHOTO WORK LINKS CONFIG */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-850">
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  💡 <span className="text-accent font-bold">사진 등록 방식:</span> 인스타 등 외부 이미지 주소를 넣을 수도 있고, <b>[업로드]</b> 버튼을 눌러 내 보조컴퓨터나 핸드폰의 실제 사진 파일을 골라 직접 업로드(Local Storage에 저장)할 수도 있어 매우 편리합니다!
                </p>
              </div>

              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                {tempPhotos.map((photo, idx) => (
                  <div key={photo.id} className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-850 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-white">
                      <span>📸 {photo.title} (슬롯 {idx + 1})</span>
                      <span className="text-[9px] text-zinc-500 font-mono">{photo.id}</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={photo.src}
                          onChange={(e) => handlePhotoChange(photo.id, e.target.value)}
                          placeholder="이미지 주소 또는 직접 업로드"
                          className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white font-mono placeholder-zinc-600 outline-none focus:border-accent"
                        />
                        <label className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white rounded px-2.5 py-1.5 text-[11px] font-semibold text-zinc-350 cursor-pointer transition-colors relative shrink-0">
                          <Upload className="w-3 h-3 text-zinc-400" />
                          <span>업로드</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 15 * 1024 * 1024) {
                                  alert('15MB 이하의 파일만 업로드할 수 있습니다!');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                  if (typeof reader.result === 'string') {
                                    try {
                                      const compressed = await compressImage(reader.result, 1000, 1000, 0.8);
                                      handlePhotoChange(photo.id, compressed);
                                    } catch (err) {
                                      handlePhotoChange(photo.id, reader.result);
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div className="w-8 h-8 rounded border border-zinc-800 overflow-hidden bg-zinc-950 flex items-center justify-center relative shrink-0">
                        <img
                          src={photo.src}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = photo.fallbackText;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePhotosSave}
                className="w-full bg-accent text-black font-semibold text-xs py-2.5 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Save className="w-4 h-4" /> 사진 연동링크 저장하기
              </button>
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES RECIEVED */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-400">
                  총 수신 메시지: {messages.length}개
                </span>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearMessages}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 전체 비우기
                  </button>
                )}
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 flex flex-col items-center gap-3">
                  <MessageSquare className="w-12 h-12 text-zinc-800" />
                  <p className="text-xs font-sans">
                    아직 홈페이지를 통해 들어온 메시지가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2.5 text-xs font-sans"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-white text-sm">{msg.name}</strong>
                          <span className="text-zinc-500 mx-2">•</span>
                          <span className="text-zinc-400">{msg.email}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> {msg.date}
                        </span>
                      </div>

                      <div className="bg-zinc-950 p-2 text-[10px] font-mono text-accent rounded border border-zinc-900">
                        유형: {msg.subject}
                      </div>

                      <p className="text-zinc-300 mt-1 whitespace-pre-wrap leading-relaxed border-t border-zinc-800/50 pt-2 text-xs">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions bar */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2 rounded-lg border border-red-950 hover:bg-neutral-900 text-red-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 데이터 전체 초기화
          </button>
        </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
