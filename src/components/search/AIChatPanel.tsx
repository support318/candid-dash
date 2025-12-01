import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Stop as StopIcon,
  AutoAwesome as AIIcon,
  DeleteOutline as ClearIcon,
} from '@mui/icons-material';
import type { ChatMessage as ChatMessageType } from './types';
import { ChatMessage } from './ChatMessage';

interface AIChatPanelProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (content: string) => void;
  onClearMessages: () => void;
  onStopGeneration: () => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearMessages,
  onStopGeneration,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 500,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon sx={{ color: '#9C27B0', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: '#fff' }}>
            AI Assistant
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            (Powered by Ollama)
          </Typography>
        </Box>
        {messages.length > 0 && (
          <IconButton
            size="small"
            onClick={onClearMessages}
            sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              py: 4,
            }}
          >
            <AIIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" sx={{ mb: 1 }}>
              Ask me anything about your projects, clients, or files
            </Typography>
            <Typography variant="caption">
              I'll search across all your apps and provide helpful answers
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Try asking:
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  'What projects are due this week?',
                  'Find the Smith wedding questionnaire',
                  'Show me recent gallery uploads',
                ].map((suggestion) => (
                  <Box
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      "{suggestion}"
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Box
          sx={{
            px: 2,
            py: 1,
            background: 'rgba(244, 67, 54, 0.1)',
            borderTop: '1px solid rgba(244, 67, 54, 0.3)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#f44336' }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 1,
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <TextField
          inputRef={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          variant="outlined"
          size="small"
          fullWidth
          disabled={isLoading}
          autoComplete="off"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#9C27B0',
              },
            },
            '& .MuiInputBase-input': {
              color: '#fff',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.4)',
                opacity: 1,
              },
            },
          }}
        />
        {isLoading ? (
          <IconButton
            onClick={onStopGeneration}
            sx={{
              bgcolor: 'rgba(244, 67, 54, 0.2)',
              color: '#f44336',
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.3)',
              },
            }}
          >
            <StopIcon />
          </IconButton>
        ) : (
          <IconButton
            type="submit"
            disabled={!input.trim()}
            sx={{
              bgcolor: input.trim()
                ? 'linear-gradient(135deg, #9C27B0, #673AB7)'
                : 'rgba(255, 255, 255, 0.1)',
              background: input.trim()
                ? 'linear-gradient(135deg, #9C27B0, #673AB7)'
                : 'rgba(255, 255, 255, 0.1)',
              color: input.trim() ? '#fff' : 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #AB47BC, #7E57C2)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: 'inherit' }} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
