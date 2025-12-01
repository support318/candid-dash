import { useState, useCallback, useRef } from 'react';
import type { SearchResult, SearchResponse, SuggestResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_SEARCH_API_URL || 'http://localhost:3015/api/search';

interface UseSearchOptions {
  token?: string;
  debounceMs?: number;
}

interface UseSearchReturn {
  results: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  total: number;
  took: number;
  search: (query: string, sources?: string[]) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useSearch({ token, debounceMs = 150 }: UseSearchOptions = {}): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [took, setTook] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, sources?: string[]) => {
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    // Debounce the search
    return new Promise<void>((resolve) => {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        setError(null);

        abortControllerRef.current = new AbortController();

        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query,
              limit: 10,
              sources,
              mode: 'hybrid',
            }),
            signal: abortControllerRef.current.signal,
          });

          if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
          }

          const data: SearchResponse = await response.json();
          setResults(data.results);
          setTotal(data.total);
          setTook(data.took);
          resolve();
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            // Request was aborted, ignore
            return;
          }
          setError(err instanceof Error ? err.message : 'Search failed');
          setResults([]);
          resolve();
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    });
  }, [token, debounceMs]);

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/suggest?q=${encodeURIComponent(query)}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }

      const data: SuggestResponse = await response.json();
      setSuggestions(data.suggestions);
    } catch {
      setSuggestions([]);
    }
  }, [token]);

  const clearResults = useCallback(() => {
    setResults([]);
    setSuggestions([]);
    setTotal(0);
    setError(null);
  }, []);

  return {
    results,
    suggestions,
    isLoading,
    error,
    total,
    took,
    search,
    getSuggestions,
    clearResults,
  };
}
