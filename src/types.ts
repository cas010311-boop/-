export interface ProfileData {
  name: string;
  title: string;
  description: string;
  skills: string;
  email: string;
  phone: string;
  profileImage: string;
  tiktokUrl: string;
  instagramUrl: string;
  photoArchiveUrl: string;
  monologueWorkshopUrl: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId?: string;
  url: string;
  year: 'all' | '~2023' | '2024' | '2025' | '2026';
  role: string;
  isNaverLive?: boolean;
}

export interface PhotoItem {
  id: string;
  title: string;
  src: string;
  fallbackText: string;
}
