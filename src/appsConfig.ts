import {
  PhotoCamera as PhotoCameraIcon,
  Language as LanguageIcon,
  Cloud as CloudIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  QuestionAnswer as QuestionAnswerIcon,
  School as SchoolIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import React from 'react';

export interface AppConfig {
  name: string;
  icon: React.ReactElement;
  url: string;
  description: string;
  color: string;
  roles: string[]; // Keycloak roles that have access
}

// Define which roles can access which apps
export const appsConfig: AppConfig[] = [
  {
    name: 'Smart Channel',
    icon: React.createElement(PhotoCameraIcon),
    url: 'https://media.candidstudios.net',
    description: 'Cloudflare Workers R2 File Explorer with OIDC authentication for secure file management across 4 R2 buckets.',
    color: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(29, 78, 216, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor'],
  },
  {
    name: 'WebSite',
    icon: React.createElement(LanguageIcon),
    url: 'https://www.candidstudios.net',
    description: 'Main WordPress CMS site with photography portfolio, client galleries, booking system, and blog.',
    color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Cloud',
    icon: React.createElement(CloudIcon),
    url: 'https://vidiblast.net',
    description: 'Nextcloud AIO for file sharing, collaboration hub, calendar/contacts sync, and office document editing.',
    color: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(217, 119, 6, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'client'],
  },
  {
    name: 'CRM',
    icon: React.createElement(BusinessIcon),
    url: 'https://app.candidstudios.net',
    description: 'Customer relationship management for sales pipeline, marketing automation, and communication tracking.',
    color: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.4) 100%)',
    roles: ['admin', 'vendor'],
  },
  {
    name: 'Earn',
    icon: React.createElement(AttachMoneyIcon),
    url: 'https://earn.candidstudios.net',
    description: 'AffiliateWP platform for referral link generation, commission tracking, payout management, and performance analytics.',
    color: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(124, 58, 237, 0.4) 100%)',
    roles: ['admin', 'referrer', 'affiliate'],
  },
  {
    name: 'Answer Engine',
    icon: React.createElement(QuestionAnswerIcon),
    url: 'https://payload.up.railway.app/',
    description: 'Payload CMS AI-powered answer engine with high-dimension vector search, semantic knowledge graph, and AI visual RAG for intelligent queries.',
    color: 'linear-gradient(135deg, rgba(6, 182, 212, 0.6) 0%, rgba(8, 145, 178, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Learning (LMS)',
    icon: React.createElement(SchoolIcon),
    url: 'https://ModalityVector.com',
    description: 'Learning Management System for online courses, training modules, and educational content delivery.',
    color: 'linear-gradient(135deg, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.4) 100%)',
    roles: ['admin', 'client', 'photographer', 'photographer-videographer'],
  },
  {
    name: 'Agent',
    icon: React.createElement(MicIcon),
    url: 'https://voice.candidstudios.net',
    description: 'VAPI/LiveKit implementation for AI-powered voice interactions, automated call handling, and voice-based workflows.',
    color: 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(219, 39, 119, 0.4) 100%)',
    roles: ['admin'],
  },
];

/**
 * Get apps that a user has access to based on their Keycloak roles
 */
export function getAppsForRoles(userRoles: string[]): AppConfig[] {
  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  return appsConfig.filter((app) => {
    // User has access if they have ANY of the required roles for this app
    return app.roles.some((requiredRole) => userRoles.includes(requiredRole));
  });
}
