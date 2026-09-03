export interface User {
  employeeId: string;
  name: string;
  department: string;
  role: 'user' | 'admin';
}

export type CategoryType = 
  | 'data_collection'
  | 'data_analysis'
  | 'document_creation'
  | 'data_summarization'
  | 'prediction_model'
  | 'visualization_dashboard'
  | 'etc';

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
  creatorRank?: string;
  creatorDept: string;
  creatorContact: string;
  likes: number;
  likedBy: string[]; // employeeIds who liked
  views: number;
  badge?: 'best_month' | 'excellent' | 'creative' | null;
  createdAt: string;
  thumbnailUrl?: string;
  screenUrls?: string[];
  videoUrl?: string;
  password?: string;
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
