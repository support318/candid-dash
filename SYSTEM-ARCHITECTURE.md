# Candid Studios System Architecture

## Overview

Candid Studios operates a multi-service architecture with centralized authentication via Keycloak SSO. All services are deployed on Railway with custom domains under `*.candidstudios.net`.

---

## Core Infrastructure

### Authentication - Keycloak SSO
- **URL**: `https://admin.candidstudios.net`
- **Realm**: `master`
- **Configured Clients**:
  - `candid-dash` - Main dashboard (public client)
  - `candid-earn` / `candid-referral-system` - Affiliate program
  - `mcp-admin` - API operations
- **User Roles**: admin, photographer, photographer-videographer, photo-editor, video-editor, photo-video-editor, project-manager, client, vendor, referrer, affiliate
- **Test User**: `test-photographer` / `TestPassword123!`

### Main Dashboard - candid-dash
- **URL**: `https://login.candidstudios.net` (redirects to `https://dash.candidstudios.net` after login)
- **Stack**: React 19 + TypeScript + Vite + MUI 5
- **Deployment**: Railway (Docker multi-stage build with nginx)
- **Repository**: `github.com/support318/candid-dash`
- **Features**:
  - Role-based app launcher
  - Profile settings with photo upload
  - Referral program settings
  - Admin notification settings
  - Auto-redirect for single-app users

### Keycloak Custom Theme
- **Repository**: `github.com/support318/keycloak-vidi`
- **Theme Location**: `/opt/keycloak/themes/candidstudios`
- **Features**: Branded login, password reset, email templates
- **Deployment**: Railway (custom Dockerfile extending Keycloak 26.4.5)

### Referral System - candid-earn
- **URL**: `https://earn.candidstudios.net`
- **API Endpoints**:
  - `GET /api/referrer/settings` - Fetch referral code & preferences
  - `PUT /api/referrer/settings` - Update notification preferences
- **Keycloak Client**: `candid-earn`

### R2 Upload Portal
- **URL**: `https://upload.candidstudios.net`
- **Stack**: Cloudflare Worker + R2 bucket
- **CDN**: `https://cdn.candidstudios.net`
- **Features**:
  - Chunked multipart uploads (50MB chunks)
  - Profile photo upload with Keycloak auth validation
  - Drag & drop interface

### n8n Workflow Automation
- **URL**: `https://n8n.candidstudios.net`
- **Webhook Endpoints**:
  - `POST /webhook/admin-settings-get` - Fetch admin notification settings
  - `POST /webhook/admin-settings-save` - Save admin notification settings
  - `POST /webhook/keycloak-account-setup` - Account setup completion notifications

### WordPress Main Site
- **URL**: `https://candidstudios.net`
- **Database Prefix**: `uem_`
- **CDN**: Cloudflare R2 at `cdn.candidstudios.net`
- **Plugins**: Elementor Pro, Gravity Forms, Ultimate Member, Rank Math SEO

### Make.com Automations
Active scenarios for:
- Gravity Forms to GoHighLevel
- Calendar event management
- Project assignments
- Stripe payment processing
- WeddingPro/Zola lead integration
- SimplyNoted thank you cards
- AI Sales Agent workflows

---

## Service Communication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Keycloak SSO (admin.candidstudios.net)        │
│                    - JWT Token Issuance                          │
│                    - Role Assignment                             │
│                    - Session Management                          │
└─────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Dashboard      │  │   Referral       │  │   Upload Portal  │
│   (dash.)        │  │   (earn.)        │  │   (upload.)      │
│                  │  │                  │  │                  │
│ - App Launcher   │  │ - Affiliate Dash │  │ - Profile Photos │
│ - Settings       │  │ - Referral Links │  │ - File Uploads   │
│ - Announcements  │  │ - Payouts        │  │ - R2 Storage     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    n8n Webhooks (n8n.candidstudios.net)          │
│                    - Admin Settings Storage                      │
│                    - Account Setup Notifications                 │
│                    - Workflow Triggers                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare R2 (cdn.candidstudios.net)         │
│                    - Media Storage                               │
│                    - Profile Photos                              │
│                    - WordPress Media                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Authentication Pattern

All services use the same pattern:
```typescript
// Get token from Keycloak
const token = keycloak.token;

// Make authenticated request
const response = await fetch('https://service.candidstudios.net/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});
```

---

## Database Configuration

### WordPress (SiteGround)
- **Production Host**: `127.0.0.1`
- **Database**: `db9fgalyyjk3ky`
- **Prefix**: `uem_`

### Local Development
- **Docker containers**: candidstudios-wp, candidstudios-mysql, candidstudios-phpmyadmin
- **Local site**: `http://localhost:8686`
- **phpMyAdmin**: `http://localhost:8687`

---

## MCP Server Configuration

All MCP servers configured in `/home/ryan/.claude/mcp-config.json`:

**NPX-Based (8)**: memory, filesystem, brave-search, everything, media-processor, railway, puppeteer, figma

**Custom Local (8)**: wordpress, ultimate-member, gemini, ghl, n8n, make, google-sheets, keycloak

---

## Domain Registry

| Domain | Service | Purpose |
|--------|---------|---------|
| `candidstudios.net` | WordPress | Main website |
| `admin.candidstudios.net` | Keycloak | SSO authentication |
| `login.candidstudios.net` | candid-dash | Login entry point |
| `dash.candidstudios.net` | candid-dash | Dashboard after auth |
| `earn.candidstudios.net` | candid-earn | Affiliate/referral system |
| `upload.candidstudios.net` | R2 Worker | File upload portal |
| `cdn.candidstudios.net` | Cloudflare R2 | Media CDN |
| `n8n.candidstudios.net` | n8n | Workflow automation |
| `cloud.candidstudios.net` | Cloudflare | Cloud services |

---

## Environment Variables Reference

### candid-dash
```env
VITE_KEYCLOAK_URL=https://admin.candidstudios.net
VITE_KEYCLOAK_REALM=master
VITE_KEYCLOAK_CLIENT_ID=candid-dash
VITE_N8N_WEBHOOK_URL=https://n8n.candidstudios.net
VITE_UPLOAD_URL=https://upload.candidstudios.net
VITE_CDN_URL=https://cdn.candidstudios.net
```

### R2 Upload Portal (wrangler.toml)
```toml
ALLOWED_ORIGINS = "https://cloud.candidstudios.net,https://candidstudios.net,https://login.candidstudios.net,https://admin.candidstudios.net,https://earn.candidstudios.net,http://localhost:8686,http://localhost:3000"
KEYCLOAK_URL = "https://admin.candidstudios.net"
KEYCLOAK_REALM = "master"
```

---

## Cloudflare Workers Routes

| Route | Worker | Purpose |
|-------|--------|---------|
| `media.candidstudios.net/*` | smartchannel | Media processing |
| `upload.candidstudios.net/*` | r2-upload-portal | File uploads |

---

## Repository Structure

```
/mnt/c/code/
├── candid-dash/           # Main React dashboard
├── candid-earn/           # Referral system (Express + React)
├── keycloak-vidi/         # Keycloak custom theme
├── r2-upload-portal/      # Cloudflare Worker for uploads
├── mcp-servers/           # Custom MCP server integrations
│   ├── wordpress-mcp/
│   ├── keycloak-mcp/
│   ├── n8n-mcp-server/
│   ├── make-mcp-server/
│   ├── ghl-mcp-server/
│   └── ...
└── candidstudios-local/   # Local WordPress development
```

---

## Deployment Platforms

| Platform | Services |
|----------|----------|
| **Railway** | candid-dash, candid-earn, Keycloak, n8n |
| **Cloudflare** | R2 bucket, Workers, CDN, DNS |
| **SiteGround** | WordPress hosting |
| **Make.com** | Workflow automations |

---

## Adding New Services

When adding a new service to the ecosystem:

1. **Create Keycloak Client**
   - Admin URL: `https://admin.candidstudios.net`
   - Create new client in `master` realm
   - Configure redirect URIs for new domain
   - Set access type (public for SPAs, confidential for backends)

2. **Configure CORS**
   - Add new domain to R2 upload portal `ALLOWED_ORIGINS`
   - Update any API services that need to accept requests

3. **Set Up Railway Service**
   - Create new service in Railway project
   - Configure custom domain under `*.candidstudios.net`
   - Set environment variables for Keycloak integration

4. **Update Dashboard**
   - Add app to `appsConfig.ts` if it should appear in launcher
   - Configure role-based access

5. **Configure DNS**
   - Add CNAME record in Cloudflare pointing to Railway
   - Enable proxy for security/caching

---

## Security Considerations

- All services require HTTPS
- JWT tokens validated on each API request
- Profile photos require authenticated upload
- CORS configured per-service
- Keycloak manages all user sessions
- Railway provides DDoS protection
- Cloudflare provides edge security

---

## Monitoring & Logging

- **Railway**: Built-in logs and metrics
- **n8n**: Workflow execution history
- **Keycloak**: Event logging enabled
- **Cloudflare**: Analytics and security events

---

*Last Updated: November 2024*
