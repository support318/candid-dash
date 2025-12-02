import {
  Analytics as AnalyticsIcon,
  CloudQueue as CloudStorageIcon,
  EventNote as BookingIcon,
  Language as WebsiteIcon,
  AttachMoney as ReferralIcon,
  School as LearningIcon,
  Person as ClientPortalIcon,
  CloudUpload as UploadIcon,
  MenuBook as KnowledgeBaseIcon,
  AdminPanelSettings as AdminPanelIcon,
  Task as ProjectManagementIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Map as RoadmapIcon,
  Videocam as VideoReviewIcon,
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
    url: 'https://analytics.candidstudios.net',
    description: 'Track business metrics, revenue analytics, and performance dashboards for informed decision making.',
    color: 'linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(45, 100, 180, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Cloud Storage',
    icon: React.createElement(CloudStorageIcon),
    url: 'https://cloud.candidstudios.net',
    description: 'File sharing, collaboration, calendar and contacts sync, and office document editing.',
    color: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(217, 119, 6, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'project-manager', 'client'],
  },
  {
    name: 'Booking System',
    icon: React.createElement(BookingIcon),
    url: 'https://app.candidstudios.net',
    description: 'Sales pipeline, scheduling, marketing automation, and client communication.',
    color: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.4) 100%)',
    roles: ['admin', 'vendor', 'project-manager'],
  },
  {
    name: 'Website',
    icon: React.createElement(WebsiteIcon),
    url: 'https://www.candidstudios.net',
    description: 'Photography portfolio, client galleries, booking forms, and blog.',
    color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(5, 150, 105, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Referral Program',
    icon: React.createElement(ReferralIcon),
    url: 'https://earn.candidstudios.net',
    description: 'Referral link generation, commission tracking, payout management, and performance analytics.',
    color: 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(219, 39, 119, 0.4) 100%)',
    roles: ['admin', 'affiliate', 'referrer'],
  },
  {
    name: 'Learning (LMS)',
    icon: React.createElement(LearningIcon),
    url: 'https://ModalityVector.com',
    description: 'Online courses, training modules, and educational content.',
    color: 'linear-gradient(135deg, rgba(249, 115, 22, 0.6) 0%, rgba(234, 88, 12, 0.4) 100%)',
    roles: ['admin', 'client', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'project-manager'],
  },
  {
    name: 'Client Portal',
    icon: React.createElement(ClientPortalIcon),
    url: 'https://portal.candidstudios.net',
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
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'project-manager'],
  },
  {
    name: 'Knowledge Base',
    icon: React.createElement(KnowledgeBaseIcon),
    url: 'https://payload.up.railway.app/',
    description: 'Search documentation, guides, and get answers to common questions.',
    color: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(147, 51, 234, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Admin Panel',
    icon: React.createElement(AdminPanelIcon),
    url: 'https://admin.candidstudios.net/admin',
    description: 'Manage users, authentication settings, roles, and SSO configuration.',
    color: 'linear-gradient(135deg, rgba(100, 116, 139, 0.6) 0%, rgba(71, 85, 105, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Project Management',
    icon: React.createElement(ProjectManagementIcon),
    url: 'https://huly.candidstudios.net',
    description: 'Task tracking, project planning, team collaboration, and sprint management.',
    color: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Candid Connect',
    icon: React.createElement(ChatIcon),
    url: 'https://connect.candidstudios.net',
    description: 'Team messaging, channels, direct messages, and real-time collaboration.',
    color: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(185, 28, 28, 0.4) 100%)',
    roles: ['admin', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'project-manager'],
  },
  {
    name: 'Notifications',
    icon: React.createElement(NotificationsIcon),
    url: 'https://notifications.candidstudios.net',
    description: 'Notification infrastructure for email, SMS, push, and in-app messaging.',
    color: 'linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(21, 128, 61, 0.4) 100%)',
    roles: ['admin'],
  },
  {
    name: 'Roadmap',
    icon: React.createElement(RoadmapIcon),
    url: 'https://roadmap.candidstudios.net',
    description: 'Product roadmap, feature requests, feedback collection, and changelog.',
    color: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(126, 34, 206, 0.4) 100%)',
    roles: ['admin', 'client', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'project-manager'],
  },
  {
    name: 'Video Review',
    icon: React.createElement(VideoReviewIcon),
    url: 'https://review.candidstudios.net',
    description: 'Frame-by-frame video review with timeline comments, drawing annotations, and collaborative feedback.',
    color: 'linear-gradient(135deg, rgba(244, 63, 94, 0.6) 0%, rgba(190, 18, 60, 0.4) 100%)',
    roles: ['admin', 'client', 'photographer', 'photographer-videographer', 'photo-editor', 'video-editor', 'photo-video-editor', 'project-manager'],
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
