# Keycloak Setup Guide for candid-dash

## Issue Identified

The "Page not found" error occurs because the **`candidstudios` realm does not exist** in your Keycloak instance at `https://login.candidstudios.net`.

## Step-by-Step Setup

### Step 1: Access Keycloak Admin Console

1. Go to `https://login.candidstudios.net`
2. Click "Administration Console"
3. Login with admin credentials (username: `vidiman`)

### Step 2: Create the `candidstudios` Realm

1. In the top-left dropdown (currently showing "Master"), hover and click "Create Realm"
2. **Realm name**: `candidstudios`
3. **Enabled**: Toggle ON
4. Click "Create"

### Step 3: Create Realm Roles

1. In the left sidebar, click "Realm roles"
2. Click "Create role" button
3. Create the following roles (one at a time):

   - **admin**
   - **photographer**
   - **photographer-videographer**
   - **photo-editor**
   - **video-editor**
   - **photo-video-editor**
   - **client**
   - **vendor**
   - **referrer**
   - **affiliate**

For each role:
- Role name: [role name from list above]
- Description: [optional description]
- Click "Save"

### Step 4: Create the `candid-dash` Client

1. In the left sidebar, click "Clients"
2. Click "Create client" button
3. **Client ID**: `candid-dash`
4. **Client type**: `OpenID Connect`
5. Click "Next"

#### Client Settings (Page 2):

- **Client authentication**: OFF (public client)
- **Authorization**: OFF
- **Authentication flow**:
  - ✅ Standard flow (enabled)
  - ✅ Direct access grants (enabled)
  - ❌ Implicit flow (disabled)
  - ❌ Service accounts roles (disabled)
  - ❌ OAuth 2.0 Device Authorization Grant (disabled)

Click "Next"

#### Login Settings (Page 3):

- **Valid redirect URIs**:
  - `http://localhost:5173/*`
  - `https://dash.candidstudios.net/*`

- **Valid post logout redirect URIs**:
  - `http://localhost:5173/*`
  - `https://dash.candidstudios.net/*`

- **Web origins**:
  - `+` (this automatically allows all origins from redirect URIs)

Click "Save"

### Step 5: Configure Client Scopes (Add Roles to Token)

This ensures user roles are included in the JWT token.

1. In the left sidebar, click "Client scopes"
2. Click on "roles" (should be in the list)
3. Click the "Mappers" tab
4. Click "Add mapper" → "By configuration"
5. Select "User Realm Role"
6. Configure:
   - **Name**: `realm roles`
   - **Token Claim Name**: `realm_access.roles`
   - **Claim JSON Type**: `String`
   - **Add to ID token**: ON
   - **Add to access token**: ON
   - **Add to userinfo**: ON
7. Click "Save"

### Step 6: Create Test Users

1. In the left sidebar, click "Users"
2. Click "Create new user" button

#### Test User 1: Admin User

- **Username**: `testadmin`
- **Email**: `admin@test.com`
- **First name**: `Admin`
- **Last name**: `User`
- **Email verified**: ON
- Click "Create"

After creation:
1. Click "Credentials" tab
2. Click "Set password"
3. Enter password: `testadmin123`
4. **Temporary**: OFF
5. Click "Save"

Then:
1. Click "Role mapping" tab
2. Click "Assign role"
3. Select **admin** role
4. Click "Assign"

#### Test User 2: Photographer User

- **Username**: `testphotographer`
- **Email**: `photographer@test.com`
- **First name**: `Photo`
- **Last name**: `Grapher`
- **Email verified**: ON
- Click "Create"

After creation:
1. Click "Credentials" tab → Set password: `testphoto123` (Temporary: OFF)
2. Click "Role mapping" tab → Assign **photographer** role

#### Test User 3: Client User

- **Username**: `testclient`
- **Email**: `client@test.com`
- **First name**: `Test`
- **Last name**: `Client`
- **Email verified**: ON
- Click "Create"

After creation:
1. Click "Credentials" tab → Set password: `testclient123` (Temporary: OFF)
2. Click "Role mapping" tab → Assign **client** role

#### Test User 4: Vendor User (Single App)

- **Username**: `testvendor`
- **Email**: `vendor@test.com`
- **First name**: `Test`
- **Last name**: `Vendor`
- **Email verified**: ON
- Click "Create"

After creation:
1. Click "Credentials" tab → Set password: `testvendor123` (Temporary: OFF)
2. Click "Role mapping" tab → Assign **vendor** role

### Step 7: Test the Integration

1. Make sure your local dev server is running:
   ```bash
   cd /mnt/c/code/candid-dash
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser

3. You should be redirected to Keycloak login page (NOT "Page not found")

4. Test with each user:

   **Admin User** (testadmin / testadmin123):
   - Should see all 8 apps
   - Should show app launcher grid (not auto-redirect)

   **Photographer User** (testphotographer / testphoto123):
   - Should see: Smart Channel, Cloud, Learning (3 apps)
   - Should show app launcher grid

   **Client User** (testclient / testclient123):
   - Should see: Cloud, Learning (2 apps)
   - Should show app launcher grid

   **Vendor User** (testvendor / testvendor123):
   - Should see: CRM (1 app only)
   - Should AUTO-REDIRECT to https://app.candidstudios.net after 1.5 seconds

### Step 8: Verify It Works

Expected behavior after successful setup:
1. Visit `http://localhost:5173`
2. Redirects to `https://login.candidstudios.net/realms/candidstudios/...`
3. Shows Keycloak login form (NOT "Page not found")
4. Enter username and password
5. Redirects back to `http://localhost:5173`
6. Shows app launcher with apps based on user's roles
7. User name and role displayed in header
8. Logout button works

## Troubleshooting

### Still getting "Page not found"?

1. Verify you're in the `candidstudios` realm (check top-left dropdown)
2. Verify the client `candid-dash` exists in Clients list
3. Check redirect URIs are exactly as specified above
4. Try clearing browser cache/cookies and testing again

### Not seeing user roles in the dashboard?

1. Go to Client scopes → roles → Mappers
2. Verify "realm roles" mapper exists
3. Check that "Add to ID token" and "Add to access token" are ON

### Apps not showing or wrong apps showing?

1. Check browser console (F12) for errors
2. Verify user has the correct roles assigned
3. Check the role names match exactly (case-sensitive)

## Quick Reference: Role → Apps Mapping

| Role | Apps with Access |
|------|------------------|
| admin | All 8 apps (Smart Channel, WebSite, Cloud, CRM, Earn, Answer Engine, Learning, Agent) |
| photographer | Smart Channel, Cloud, Learning |
| photographer-videographer | Smart Channel, Cloud, Learning |
| photo-editor | Smart Channel, Cloud |
| video-editor | Smart Channel, Cloud |
| photo-video-editor | Smart Channel, Cloud |
| client | Cloud, Learning |
| vendor | CRM only |
| referrer | Earn only |
| affiliate | Earn only |

## Next Steps After Successful Local Testing

1. Commit changes to git
2. Deploy to Railway
3. Test production at `https://dash.candidstudios.net`
4. Create real user accounts
5. Assign appropriate roles to real users
