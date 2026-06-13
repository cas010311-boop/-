import { ProfileData, VideoItem, PhotoItem } from './types';

export const INITIAL_PROFILE: ProfileData = {
  name: "최아진",
  title: "안녕하세요, 영상 제작자 최아진입니다",
  description: "유튜브 롱폼 및 숏폼, 단편영화, 바이럴영상, 다큐멘터리 등 여러 장르의 영상 제작",
  skills: "Adobe Premiere Pro, Adobe Photoshop, Adobe Illustrator, Adobe Lightroom, Capcut, 영상촬영, Kling AI, Midjourney",
  email: "ajin0217@naver.com",
  phone: "010-5506-9616",
  profileImage: "https://res.cloudinary.com/dlnzhxv0e/image/upload/v1781341957/oooo_o3mlt6.jpg?_s=public-apps", // Online hosted Cloudinary image URL of her real photo
  tiktokUrl: "https://www.tiktok.com/@ajjang_girl?is_from_webapp=1&sender_device=pc",
  instagramUrl: "https://www.instagram.com/choi_ajin01/",
  photoArchiveUrl: "https://www.instagram.com/zzini_325/",
  monologueWorkshopUrl: "https://www.youtube.com/@monologue_workshop"
};

export const INITIAL_VIDEOS: VideoItem[] = [
  // ====== 2026 ======
  {
    id: "v-2026-1",
    title: "AI 광고 영상",
    youtubeId: "y0WrDUwceK8",
    url: "https://www.youtube.com/watch?v=y0WrDUwceK8",
    year: "2026",
    role: "Kling AI 사용 및 연출"
  },
  {
    id: "v-2026-c1",
    title: "쿠팡라이브 1",
    url: "https://link.coupang.com/a/ehOOPg",
    year: "2026",
    role: "조연출/서브캠",
    isNaverLive: true
  },
  {
    id: "v-2026-c2",
    title: "쿠팡라이브 2",
    url: "https://link.coupang.com/a/ehOP75",
    year: "2026",
    role: "조연출/서브캠",
    isNaverLive: true
  },
  {
    id: "v-2026-c3",
    title: "쿠팡라이브 3",
    url: "https://link.coupang.com/a/ehOTnS",
    year: "2026",
    role: "조연출/서브캠",
    isNaverLive: true
  },
  {
    id: "v-2026-c4",
    title: "쿠팡라이브 4",
    url: "https://link.coupang.com/a/ehOUo7",
    year: "2026",
    role: "조연출/서브캠",
    isNaverLive: true
  },

  // ====== 2025 ======
  {
    id: "v-2025-1",
    title: "오덴세 라이브커머스",
    url: "https://view.shoppinglive.naver.com/replays/1572932?fm=shoppinglive&sn=home",
    year: "2025",
    role: "서브캠",
    isNaverLive: true
  },
  {
    id: "v-2025-2",
    title: "올키 라이브커머스",
    url: "https://view.shoppinglive.naver.com/replays/1548979",
    year: "2025",
    role: "서브캠",
    isNaverLive: true
  },
  {
    id: "v-2025-3",
    title: "브루클린웍스 라이브커머스",
    url: "https://view.shoppinglive.naver.com/replays/1615939?fm=shoppinglive&sn=home",
    year: "2025",
    role: "서브캠",
    isNaverLive: true
  },
  {
    id: "v-2025-sn1",
    title: "쏘내추럴 바이럴 영상 1",
    youtubeId: "8LGE-te_LI0",
    url: "https://www.youtube.com/shorts/8LGE-te_LI0",
    year: "2025",
    role: "캡컷 편집 및 촬영"
  },
  {
    id: "v-2025-sn2",
    title: "쏘내추럴 바이럴 영상 2",
    youtubeId: "8BLdTKyTZmI",
    url: "https://www.youtube.com/shorts/8BLdTKyTZmI",
    year: "2025",
    role: "캡컷 편집 및 촬영"
  },
  {
    id: "v-2025-pt",
    title: "포틀리에 행사 메이킹필름",
    youtubeId: "6gvWPakE3E4",
    url: "https://www.youtube.com/watch?v=6gvWPakE3E4",
    year: "2025",
    role: "서브캠 촬영"
  },
  {
    id: "v-2025-pt1",
    title: "포틀리에 행사 1 (Shorts)",
    youtubeId: "j8piVUCGIUI",
    url: "https://www.youtube.com/shorts/j8piVUCGIUI",
    year: "2025",
    role: "서브캠 촬영/숏츠 편집"
  },
  {
    id: "v-2025-pt2",
    title: "포틀리에 행사 2 (Shorts)",
    youtubeId: "CLAu2ZmpOms",
    url: "https://www.youtube.com/shorts/CLAu2ZmpOms",
    year: "2025",
    role: "서브캠 촬영/숏츠 편집"
  },
  {
    id: "v-2025-office",
    title: "사무실 오픈식 유튜브",
    youtubeId: "I-qu8WXKMEA",
    url: "https://www.youtube.com/watch?v=I-qu8WXKMEA",
    year: "2025",
    role: "짐벌캠 촬영 및 편집"
  },
  {
    id: "v-2025-corp",
    title: "사내 유튜브 예능",
    youtubeId: "VeoVb7AUsyE",
    url: "https://www.youtube.com/watch?v=VeoVb7AUsyE",
    year: "2025",
    role: "서브캠 촬영"
  },
  {
    id: "v-2025-thailand",
    title: "머스트유 태국 행사 스케치",
    youtubeId: "KladqamaBWk",
    url: "https://www.youtube.com/watch?v=KladqamaBWk",
    year: "2025",
    role: "짐벌캠 촬영 및 연출"
  },

  // ====== 2024 ======
  {
    id: "v-2024-secret",
    title: "비밀을 들킨 순간",
    youtubeId: "CX5cWLqyBVg",
    url: "https://www.youtube.com/watch?v=CX5cWLqyBVg",
    year: "2024",
    role: "단편 2인극 | 연출/촬영/편집"
  },
  {
    id: "v-2024-gift",
    title: "예단",
    youtubeId: "n7UmW0lL_Js",
    url: "https://www.youtube.com/watch?v=n7UmW0lL_Js",
    year: "2024",
    role: "단편 2인극 | 연출/촬영/편집"
  },
  {
    id: "v-2024-water",
    title: "물 한 잔",
    youtubeId: "fnaYuf6LS-k",
    url: "https://www.youtube.com/watch?v=fnaYuf6LS-k",
    year: "2024",
    role: "단편 2인극 | 연출/촬영/편집"
  },
  {
    id: "v-2024-destiny",
    title: "운명",
    youtubeId: "Reb9hmy4H_o",
    url: "https://www.youtube.com/watch?v=Reb9hmy4H_o",
    year: "2024",
    role: "단편 2인극 | 연출/촬영/편집"
  },
  {
    id: "v-2024-bad",
    title: "불량남녀",
    youtubeId: "0Cc5Fn-2Cn0",
    url: "https://www.youtube.com/watch?v=0Cc5Fn-2Cn0",
    year: "2024",
    role: "단편 3인극 | 연출/촬영/편집"
  },
  {
    id: "v-2024-spy",
    title: "세작",
    youtubeId: "q98ply5yubU",
    url: "https://www.youtube.com/watch?v=q98ply5yubU",
    year: "2024",
    role: "단편 2인극 | 연출/촬영/편집"
  },
  {
    id: "v-2024-vf1",
    title: "비주얼필름_1",
    youtubeId: "H72VObKdDJ4",
    url: "https://www.youtube.com/watch?v=H72VObKdDJ4",
    year: "2024",
    role: "촬영/편집"
  },
  {
    id: "v-2024-vf2",
    title: "비주얼필름_2",
    youtubeId: "W1tEMyfLynQ",
    url: "https://www.youtube.com/watch?v=W1tEMyfLynQ",
    year: "2024",
    role: "촬영/편집"
  },
  {
    id: "v-2024-vf3",
    title: "비주얼필름_3",
    youtubeId: "yfiRb5UyAbk",
    url: "https://www.youtube.com/watch?v=yfiRb5UyAbk",
    year: "2024",
    role: "촬영/편집"
  },
  {
    id: "v-2024-dday",
    title: "단편영화 '디데이'",
    youtubeId: "rSF8K6cIKAQ",
    url: "https://youtu.be/rSF8K6cIKAQ",
    year: "2024",
    role: "연출/편집"
  },

  // ====== ~2023 ======
  {
    id: "v-2023-p1",
    title: "영상 포트폴리오 1",
    youtubeId: "CJyDho4cicg",
    url: "https://youtu.be/CJyDho4cicg",
    year: "~2023",
    role: "연출 및 종합 편집"
  },
  {
    id: "v-2023-p2",
    title: "영상 포트폴리오 2",
    youtubeId: "z9YUuGdwFcM",
    url: "https://youtu.be/z9YUuGdwFcM",
    year: "~2023",
    role: "촬영 및 편집"
  },
  {
    id: "v-2023-p3",
    title: "영상 포트폴리오 3",
    youtubeId: "YAnBox8XsfU",
    url: "https://youtu.be/YAnBox8XsfU",
    year: "~2023",
    role: "종합 연출"
  },
  {
    id: "v-2023-drama",
    title: "독백공방프로젝트",
    youtubeId: "3xt_tCyO1xo",
    url: "https://youtu.be/3xt_tCyO1xo",
    year: "~2023",
    role: "총괄 연출/제작"
  },
  {
    id: "v-2023-mask",
    title: "마스크 영유아 언어적 거리두기",
    youtubeId: "71DENMMnmvE",
    url: "https://www.youtube.com/watch?v=71DENMMnmvE",
    year: "~2023",
    role: "다큐멘터리 | 연출/촬영/편집"
  },
  {
    id: "v-2023-cypher",
    title: "교내 동아리 - 싸이퍼",
    youtubeId: "O_Cd5xt4kbQ",
    url: "https://www.youtube.com/watch?v=O_Cd5xt4kbQ",
    year: "~2023",
    role: "연출/편집"
  },
  {
    id: "v-2023-gallery",
    title: "안성시 결갤러리 홍보영상",
    youtubeId: "Ki-lmNXa7qQ",
    url: "https://www.youtube.com/watch?v=Ki-lmNXa7qQ",
    year: "~2023",
    role: "홍보영상 | 연출/촬영/편집"
  },
  {
    id: "v-2023-interview",
    title: "안성시 작가 인터뷰",
    youtubeId: "cp8ONEYjgGE",
    url: "https://www.youtube.com/watch?v=cp8ONEYjgGE",
    year: "~2023",
    role: "인터뷰 | 연출/촬영/편집"
  }
];

export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: "p1",
    title: "Instagram Work 1",
    src: "https://www.instagram.com/p/DZhZfN6D9XZ/",
    fallbackText: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p2",
    title: "Instagram Work 2",
    src: "https://www.instagram.com/p/DEu0yhczt0r/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p3",
    title: "Instagram Work 3",
    src: "https://www.instagram.com/p/Cz3I2m1LIn9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p4",
    title: "Instagram Work 4",
    src: "https://www.instagram.com/p/CgwL3PwOMau/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p5",
    title: "Instagram Work 5",
    src: "https://www.instagram.com/p/C9hxkfGT3lk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p6",
    title: "Instagram Work 6",
    src: "https://www.instagram.com/p/C9Jx26mSkyr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p7",
    title: "Instagram Work 7",
    src: "https://www.instagram.com/p/C9Jx8TyykXV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p8",
    title: "Instagram Work 8",
    src: "https://www.instagram.com/p/Cz3JHaurEcK/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p9",
    title: "Instagram Work 9",
    src: "https://www.instagram.com/p/Cz3JuAer_5v/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p10",
    title: "Instagram Work 10",
    src: "https://www.instagram.com/p/C7d3XeovWJ4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    fallbackText: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600"
  }
];
