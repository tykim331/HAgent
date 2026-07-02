export interface User {
  employeeId: string;
  name: string;
  department: string;
  role: 'user' | 'admin';
}

export type CategoryType = 
  | 'report'     // 보고서 자동화
  | 'analysis'   // 데이터 분석/대시보드
  | 'prediction' // 예측모델
  | 'customer'   // 고객응대
  | 'writing'    // 문서작성
  | 'etc';       // 기타

export interface Agent {
  id: string;
  name: string;
  category: CategoryType;
  shortDesc: string;
  painPoint: string;
  expectation: string;
  features: string[]; // Major features
  steps: string[]; // Step-by-step guides
  prompt: string; // Core system prompt / code
  creatorName: string;
  creatorDept: string;
  creatorContact: string;
  likes: number;
  likedBy: string[]; // employeeIds who liked
  views: number;
  badge?: 'best_month' | 'excellent' | 'creative' | null;
  createdAt: string;
  thumbnailUrl?: string;
  emojiReactions: {
    [emoji: string]: string[]; // list of employeeIds who clicked this emoji
  };
}

export interface Comment {
  id: string;
  agentId: string;
  authorName: string;
  authorDept: string;
  authorId: string; // employeeId
  content: string;
  createdAt: string;
}
