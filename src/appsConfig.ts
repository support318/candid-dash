import {
  Analytics as AnalyticsIcon,
  CloudQueue as CloudStorageIcon,
  PhotoLibrary as MediaArchiveIcon,
  EventNote as BookingIcon,
  Language as WebsiteIcon,
  AttachMoney as AffiliateIcon,
  School as LearningIcon,
  Person as ClientPortalIcon,
  CloudUpload as UploadIcon,
  Settings as SettingsIcon,
  MenuBook as KnowledgeBaseIcon,
} from '@mui/icons-material';
import React from 'react';

export interface AppConfig {
  name: string;
  icon: React.ReactElement;
  url: string;
  description: string;
  color: string;
  roles: string[]; // Keycloak roles that have access
  isInternal?: boolean; // Internal section (like settings) vs external URL
}

// Define which roles can access which apps
export const appsConfig: AppConfig[] = [
  {
    name: 'Analytics',
    icon: React.createElement(AnalyticsIcon),
    url: '', // To be configured
    description: 'Track business metrics, revenue analytics, and performance dashboards for informed decision making.',
    color: 'linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(45, 100, 180, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Cloud Storage',
    icon: React.createElement(CloudStorageIcon),
    url: 'https://vidiblast.net',
    description: 'Nextcloud for file sharing, collaboration, calendar/contacts sync, and office document editing.',
    color: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(217, 119, 6, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'client'],
  },
  {
    name: 'Media Archive',
    icon: React.createElement(MediaArchiveIcon),
    url: 'https://media.candidstudios.net',
    description: 'Cloudflare R2 File Explorer with OIDC authentication for secure media file management.',
    color: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(124, 58, 237, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor'],
  },
  {
    name: 'Booking System',
    icon: React.createElement(BookingIcon),
    url: 'https://app.candidstudios.net',
    description: 'GoHighLevel CRM for sales pipeline, scheduling, marketing automation, and client communication.',
    color: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.4) 100%)',
    roles: ['admin', 'vendor'],
  },
  {
    name: 'Website',
    icon: React.createElement(WebsiteIcon),
    url: 'https://www.candidstudios.net',
    description: 'Main WordPress site with photography portfolio, client galleries, booking forms, and blog.',
    color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Affiliate Program',
    icon: React.createElement(AffiliateIcon),
    url: 'https://earn.candidstudios.net',
    description: 'Referral link generation, commission tracking, payout management, and performance analytics.',
    color: 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(219, 39, 119, 0.4) 100%)',
    roles: ['admin', 'affiliate', 'referrer'],
  },
  {
    name: 'Learning (LMS)',
    icon: React.createElement(LearningIcon),
    url: 'https://ModalityVector.com',
    description: 'Learning Management System for online courses, training modules, and educational content.',
    color: 'linear-gradient(135deg, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.4) 100%)',
    roles: ['admin', 'client', 'photographer', 'photographer-videographer'],
  },
  {
    name: 'Client Portal',
    icon: React.createElement(ClientPortalIcon),
    url: '', // Phase 3 - to be configured
    description: 'Self-service portal for clients to view galleries, download photos, and manage bookings.',
    color: 'linear-gradient(135deg, rgba(6, 182, 212, 0.6) 0%, rgba(8, 145, 178, 0.4) 100%)',
    roles: ['admin', 'client'],
  },
  {
    name: 'Project Upload',
    icon: React.createElement(UploadIcon),
    url: '', // To be configured
    description: 'Upload system for photographers and editors to submit completed project deliverables.',
    color: 'linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(22, 163, 74, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor'],
  },
  {
    name: 'Update Profile',
    icon: React.createElement(SettingsIcon),
    url: '#settings',
    description: 'Manage your account settings, notification preferences, and profile information.',
    color: 'linear-gradient(135deg, rgba(107, 114, 128, 0.6) 0%, rgba(75, 85, 99, 0.4) 100%)',
    roles: ['admin', 'affiliate', 'referrer', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'client', 'vendor'],
    isInternal: true,
  },
  {
    name: 'Knowledge Base',
    icon: React.createElement(KnowledgeBaseIcon),
    url: 'https://payload.up.railway.app/',
    description: 'AI-powered answer engine with semantic search, knowledge graph, and intelligent queries.',
    color: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(147, 51, 234, 0.4) 100%)',
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

/**
 * Check if a user is an admin
 */
export function isAdmin(userRoles: string[]): boolean {
  return userRoles.includes('admin');
}

/**
 * Check if a user is a referrer/affiliate only (no admin)
 */
export function isReferrerOnly(userRoles: string[]): boolean {
  const nonSystemRoles = userRoles.filter(r =>
    !['uma_authorization', 'offline_access', 'default-roles-candidstudios'].includes(r)
  );
  return nonSystemRoles.length === 1 && (nonSystemRoles.includes('affiliate') || nonSystemRoles.includes('referrer'));
}
