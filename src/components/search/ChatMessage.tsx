import React from 'react';
import { Box, Typography, Avatar, Chip, Link } from '@mui/material';
import {
  Person as PersonIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import type { ChatMessage as ChatMessageType } from './types';
import { sourceConfig } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? '#2196F3' : 'linear-gradient(135deg, #9C27B0, #673AB7)',
          background: isUser
            ? '#2196F3'
            : 'linear-gradient(135deg, #9C27B0, #673AB7)',
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 18 }} />
        ) : (
          <AIIcon sx={{ fontSize: 18 }} />
        )}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: '85%',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: isUser
              ? 'rgba(33, 150, 243, 0.15)'
              : 'rgba(255, 255, 255, 0.06)',
            border: '1px solid',
            borderColor: isUser
              ? 'rgba(33, 150, 243, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {message.content}
            {message.isStreaming && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 8,
                  height: 16,
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  ml: 0.5,
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 },
                  },
                }}
              />
            )}
          </Typography>
        </Box>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1, display: 'block' }}
            >
              Sources:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {message.sources.map((source, index) => {
                const config = sourceConfig[source.source] || {
                  label: source.source,
                  color: '#666',
                };
                return (
                  <Chip
                    key={index}
                    label={
                      <Link
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'inherit',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {source.title}
                      </Link>
                    }
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      bgcolor: `${config.color}20`,
                      color: config.color,
                      border: `1px solid ${config.color}40`,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.3)',
            mt: 0.5,
            display: 'block',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>
    </Box>
  );
};
