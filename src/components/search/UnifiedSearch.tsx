import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Collapse,
  ClickAwayListener,
  Typography,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  AutoAwesome as AIIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { SearchMode, SearchResult, UnifiedSearchProps } from './types';
import { useSearch } from './hooks/useSearch';
import { useChat } from './hooks/useChat';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { QuickSearchResults } from './QuickSearchResults';
import { AIChatPanel } from './AIChatPanel';

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  userRoles: _userRoles, // Reserved for future RBAC filtering
  userId: _userId, // Reserved for future user-specific filtering
  token,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<SearchMode>('quick');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const {
    results,
    isLoading: isSearchLoading,
    error: searchError,
    total,
    took,
    search,
    clearResults,
  } = useSearch({ token });

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
    clearMessages,
    stopGeneration,
  } = useChat({ token });

  // Handle search input
  useEffect(() => {
    if (mode === 'quick' && query.trim()) {
      search(query);
    } else if (!query.trim()) {
      clearResults();
    }
  }, [query, mode, search, clearResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    clearResults();
  }, [clearResults]);

  const handleToggleMode = useCallback(() => {
    setMode((prev) => (prev === 'quick' ? 'ai' : 'quick'));
  }, []);

  const handleNavigateUp = useCallback(() => {
    if (mode === 'quick' && results.length > 0) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }
  }, [mode, results.length]);

  const handleNavigateDown = useCallback(() => {
    if (mode === 'quick' && results.length > 0) {
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }
  }, [mode, results.length]);

  const handleSelectResult = useCallback(() => {
    if (mode === 'quick' && results[selectedIndex]) {
      const result = results[selectedIndex];
      if (result.sourceUrl) {
        window.open(result.sourceUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }, [mode, results, selectedIndex]);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (result.sourceUrl) {
      window.open(result.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onOpen: handleOpen,
    onClose: handleClose,
    onToggleMode: handleToggleMode,
    onNavigateUp: handleNavigateUp,
    onNavigateDown: handleNavigateDown,
    onSelect: handleSelectResult,
    isOpen,
  });

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: SearchMode | null
  ) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ mb: 3, position: 'relative', zIndex: 1200 }}>
        {/* Search Bar */}
        <Paper
          elevation={0}
          onClick={handleOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            pl: 2,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '16px',
            transition: 'all 0.2s ease',
            cursor: 'text',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
            },
            ...(isOpen && {
              background: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderBottomLeftRadius: results.length > 0 || mode === 'ai' ? 0 : '16px',
              borderBottomRightRadius: results.length > 0 || mode === 'ai' ? 0 : '16px',
            }),
          }}
        >
          {/* Mode Toggle */}
          <Fade in={isOpen}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              size="small"
              sx={{
                mr: 2,
                display: isOpen ? 'flex' : 'none',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '8px !important',
                  px: 1.5,
                  py: 0.5,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
              }}
            >
              <ToggleButton value="quick">
                <SearchIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Quick
              </ToggleButton>
              <ToggleButton value="ai">
                <AIIcon sx={{ fontSize: 16, mr: 0.5 }} />
                AI Chat
              </ToggleButton>
            </ToggleButtonGroup>
          </Fade>

          {/* Search Input */}
          <SearchIcon
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              mr: 1.5,
              display: isOpen ? 'none' : 'block',
            }}
          />
          <InputBase
            inputRef={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === 'quick'
                ? 'Search clients, projects, files...'
                : 'Ask AI anything...'
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mode === 'ai' && query.trim()) {
                e.preventDefault();
                sendMessage(query);
                setQuery('');
              }
            }}
            sx={{
              flex: 1,
              color: '#fff',
              fontSize: '0.95rem',
              '& .MuiInputBase-input': {
                py: 1,
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.4)',
                  opacity: 1,
                },
              },
            }}
          />

          {/* Keyboard Shortcut Hint / Close Button */}
          {isOpen ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: '8px',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                mr: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}
              >
                {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+K
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Dropdown Panel */}
        <Collapse in={isOpen}>
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(30, 30, 40, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              overflow: 'hidden',
              maxHeight: 'calc(100vh - 200px)',
            }}
          >
            {mode === 'quick' ? (
              <QuickSearchResults
                results={results}
                isLoading={isSearchLoading}
                error={searchError}
                query={query}
                selectedIndex={selectedIndex}
                onSelect={handleResultClick}
                took={took}
                total={total}
              />
            ) : (
              <AIChatPanel
                messages={messages}
                isLoading={isChatLoading}
                error={chatError}
                onSendMessage={sendMessage}
                onClearMessages={clearMessages}
                onStopGeneration={stopGeneration}
              />
            )}
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};
