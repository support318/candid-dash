import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';
import type { SearchResult } from './types';
import { SearchResultItem } from './SearchResultItem';

interface QuickSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
  took?: number;
  total?: number;
}

export const QuickSearchResults: React.FC<QuickSearchResultsProps> = ({
  results,
  isLoading,
  error,
  query,
  selectedIndex,
  onSelect,
  took,
  total,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <CircularProgress size={32} sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          color: '#f44336',
        }}
      >
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  if (!query.trim()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <Typography variant="body2">
          Start typing to search across all your apps
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          Press Tab to switch to AI Chat mode
        </Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="body2">
          No results found for "{query}"
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          Try different keywords or ask the AI assistant
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Results Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {total !== undefined ? `${total} results` : `${results.length} results`}
        </Typography>
        {took !== undefined && (
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            {took}ms
          </Typography>
        )}
      </Box>

      {/* Results List */}
      <Box sx={{ p: 1, maxHeight: 400, overflowY: 'auto' }}>
        {results.map((result, index) => (
          <SearchResultItem
            key={result.id}
            result={result}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(result)}
          />
        ))}
      </Box>

      {/* Keyboard Hints */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          px: 2,
          py: 1.5,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          <Box component="span" sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            mr: 0.5,
          }}>
            Arrow keys
          </Box>
          to navigate
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          <Box component="span" sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            mr: 0.5,
          }}>
            Enter
          </Box>
          to open
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          <Box component="span" sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            mr: 0.5,
          }}>
            Tab
          </Box>
          AI mode
        </Typography>
      </Box>
    </Box>
  );
};
