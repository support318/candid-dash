// Search API Types

export interface SearchResult {
  id: string;
  score: number;
  title: string;
  content: string;
  summary: string;
  source: 'ghl' | 'portal' | 'picpeak' | 'seafile' | 'huly';
  sourceId: string;
  sourceUrl: string;
  entityType: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SearchResult[];
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatResponse {
  response: string;
  sources: SearchResult[];
  query: string;
  took: number;
}

export interface SuggestResponse {
  suggestions: string[];
  query: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  services: {
    qdrant: {
      status: 'healthy' | 'unhealthy';
      vectors_count: number;
    };
    ollama: {
      status: 'healthy' | 'unhealthy';
      models: string[];
      embedding_ready: boolean;
      chat_ready: boolean;
    };
  };
}

export type SearchMode = 'quick' | 'ai';

export interface UnifiedSearchProps {
  userRoles: string[];
  userId?: string;
  token?: string;
}

// Source display configuration
export const sourceConfig: Record<string, { label: string; color: string; icon: string }> = {
  ghl: { label: 'CRM', color: '#4CAF50', icon: 'contacts' },
  portal: { label: 'Portal', color: '#2196F3', icon: 'web' },
  picpeak: { label: 'Gallery', color: '#9C27B0', icon: 'photo_library' },
  seafile: { label: 'Files', color: '#FF9800', icon: 'folder' },
  huly: { label: 'Projects', color: '#F44336', icon: 'assignment' },
};
