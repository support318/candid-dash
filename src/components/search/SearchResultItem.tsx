import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Contacts as ContactsIcon,
  Web as WebIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import type { SearchResult } from './types';
import { sourceConfig } from './types';

interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

const sourceIcons: Record<string, React.ReactElement> = {
  ghl: <ContactsIcon fontSize="small" />,
  portal: <WebIcon fontSize="small" />,
  picpeak: <PhotoLibraryIcon fontSize="small" />,
  seafile: <FolderIcon fontSize="small" />,
  huly: <AssignmentIcon fontSize="small" />,
};

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  isSelected,
  onClick,
}) => {
  const config = sourceConfig[result.source] || {
    label: result.source,
    color: '#666',
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.sourceUrl) {
      window.open(result.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        background: isSelected
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(255, 255, 255, 0.04)',
        border: isSelected
          ? '1px solid rgba(255, 255, 255, 0.2)'
          : '1px solid transparent',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      {/* Source Icon */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          background: config.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'white',
        }}
      >
        {sourceIcons[result.source] || <WebIcon fontSize="small" />}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#fff',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {result.title}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              bgcolor: `${config.color}20`,
              color: config.color,
              border: `1px solid ${config.color}40`,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {result.summary || result.content}
        </Typography>

        {/* Entity Type */}
        {result.entityType && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              mt: 0.5,
              display: 'block',
            }}
          >
            {result.entityType}
          </Typography>
        )}
      </Box>

      {/* Open External Button */}
      {result.sourceUrl && (
        <IconButton
          size="small"
          onClick={handleOpenExternal}
          sx={{
            color: 'rgba(255, 255, 255, 0.4)',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.8)',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
