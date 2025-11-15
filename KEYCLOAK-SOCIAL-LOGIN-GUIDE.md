# Social Login Setup Guide (Google, Apple, Microsoft)

## Overview

This guide will help you add "Sign in with Google", "Sign in with Apple", and "Sign in with Microsoft" buttons to your Keycloak login page.

**Important**: Each provider requires you to create an OAuth app in their developer console first, then configure Keycloak with the credentials.

---

## Part 1: Google Sign-In

### Step 1: Create Google OAuth App

1. Go to **Google Cloud Console**: https://console.cloud.google.com/
2. Create a new project (or select existing):
   - Click project dropdown (top-left)
   - Click "New Project"
   - Name: `Candid Studios Auth`
   - Click "Create"

3. **Enable Google+ API** (required for Keycloak):
   - In the search bar, type "Google+ API"
   - Click "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth client ID"**

   **Configure consent screen** (if prompted):
   - User Type: **External**
   - Click "Create"
   - App name: `Candid Studios`
   - User support email: [your email]
   - Developer contact: [your email]
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (use defaults)
   - Test users: Click "Save and Continue" (optional for now)

5. **Create OAuth Client ID**:
   - Application type: **Web application**
   - Name: `Candid Studios Keycloak`

   **Authorized redirect URIs** (CRITICAL):
   ```
   https://login.candidstudios.net/realms/candidstudios/broker/google/endpoint
   ```

   **Authorized JavaScript origins**:
   ```
   https://login.candidstudios.net
   ```

   - Click "Create"

6. **Save the credentials**:
   - Copy **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - Copy **Client Secret** (looks like: `GOCSPX-abc123xyz`)
   - Keep these safe - you'll need them in Keycloak

---

### Step 2: Configure Google in Keycloak

1. In Keycloak admin console (`candidstudios` realm)
2. Left sidebar → **"Identity providers"**
3. Click **"Add provider"** dropdown
4. Select **"Google"**

**Configure Google Identity Provider**:
- **Alias**: `google` (leave as default)
- **Display name**: `Google` (or "Sign in with Google")
- **Enabled**: Toggle **ON** ✅
- **Store tokens**: Toggle **ON** (recommended)
- **Trust email**: Toggle **ON** ✅
- **Client ID**: [Paste Google Client ID from Step 1.6]
- **Client Secret**: [Paste Google Client Secret from Step 1.6]

**Advanced Settings**:
- **Sync mode**: `Import` (recommended)
- **First login flow**: `first broker login`

Click **"Save"**

---

## Part 2: Apple Sign-In

### Step 1: Create Apple Service ID

**Prerequisites**: You need an Apple Developer account ($99/year)

1. Go to **Apple Developer**: https://developer.apple.com/account
2. Navigate to **Certificates, Identifiers & Profiles**

3. **Create an App ID** (if you don't have one):
   - Click **"Identifiers"** → **"+"** button
   - Select **"App IDs"** → Continue
   - Description: `Candid Studios Auth`
   - Bundle ID: `net.candidstudios.auth` (reverse domain)
   - Capabilities: Enable **"Sign in with Apple"**
   - Click "Continue" → "Register"

4. **Create a Service ID**:
   - Click **"Identifiers"** → **"+"** button
   - Select **"Services IDs"** → Continue
   - Description: `Candid Studios Keycloak`
   - Identifier: `net.candidstudios.keycloak`
   - Enable **"Sign in with Apple"**
   - Click "Configure" next to Sign in with Apple

   **Configure Sign in with Apple**:
   - Primary App ID: Select the App ID from Step 3
   - Domains and Subdomains: `login.candidstudios.net`
   - Return URLs:
     ```
     https://login.candidstudios.net/realms/candidstudios/broker/apple/endpoint
     ```
   - Click "Save" → "Continue" → "Register"

5. **Create a Key** (for signing):
   - Click **"Keys"** → **"+"** button
   - Key Name: `Candid Studios Apple Sign In Key`
   - Enable **"Sign in with Apple"**
   - Click "Configure"
   - Primary App ID: Select your App ID
   - Click "Save" → "Continue" → "Register"
   - **Download the .p8 key file** (you can only download once!)
   - Note the **Key ID** (e.g., `ABC123XYZ`)

6. **Get Team ID**:
   - Go to **Membership** (top-right menu)
   - Note your **Team ID** (e.g., `TEAM123456`)

**You'll need these for Keycloak**:
- Service ID (Identifier): `net.candidstudios.keycloak`
- Team ID: `TEAM123456`
- Key ID: `ABC123XYZ`
- Private Key (.p8 file contents)

---

### Step 2: Configure Apple in Keycloak

1. In Keycloak admin console (`candidstudios` realm)
2. Left sidebar → **"Identity providers"**
3. Click **"Add provider"** dropdown
4. Select **"Apple"**

**Configure Apple Identity Provider**:
- **Alias**: `apple` (leave as default)
- **Display name**: `Apple` (or "Sign in with Apple")
- **Enabled**: Toggle **ON** ✅
- **Store tokens**: Toggle **ON**
- **Trust email**: Toggle **ON** ✅

**Apple Configuration**:
- **Service ID**: [Your Service ID, e.g., `net.candidstudios.keycloak`]
- **Team ID**: [Your Apple Team ID, e.g., `TEAM123456`]
- **Key ID**: [Your Key ID from the .p8 file, e.g., `ABC123XYZ`]
- **Private Key**: [Open the .p8 file in a text editor and paste the ENTIRE contents including the header/footer lines]

**Advanced Settings**:
- **Sync mode**: `Import`
- **First login flow**: `first broker login`

Click **"Save"**

---

## Part 3: Microsoft Sign-In

### Step 1: Create Microsoft Azure App Registration

1. Go to **Azure Portal**: https://portal.azure.com/
2. Navigate to **Microsoft Entra ID** (formerly Azure Active Directory)
3. Left menu → **"App registrations"** → **"New registration"**

**Register an application**:
- **Name**: `Candid Studios Keycloak`
- **Supported account types**:
  - Select **"Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)"**
- **Redirect URI**:
  - Platform: **Web**
  - URI:
    ```
    https://login.candidstudios.net/realms/candidstudios/broker/microsoft/endpoint
    ```
- Click **"Register"**

4. **Note the Application Details**:
   - Copy **Application (client) ID** (e.g., `12345678-1234-1234-1234-123456789abc`)
   - Copy **Directory (tenant) ID** (e.g., `87654321-4321-4321-4321-210987654321`)

5. **Create a Client Secret**:
   - Left menu → **"Certificates & secrets"**
   - Click **"New client secret"**
   - Description: `Keycloak Integration`
   - Expires: Choose duration (6 months, 12 months, or 24 months)
   - Click **"Add"**
   - **Copy the Value** immediately (you can only see it once!)

6. **Configure API Permissions** (optional but recommended):
   - Left menu → **"API permissions"**
   - Should already have `User.Read` permission
   - If not, click "Add a permission" → Microsoft Graph → Delegated → `User.Read`

**You'll need these for Keycloak**:
- Application (client) ID: `12345678-1234-1234-1234-123456789abc`
- Client Secret Value: `abc123~xyz789`
- (Optional) Tenant ID if you want to restrict to specific organization

---

### Step 2: Configure Microsoft in Keycloak

1. In Keycloak admin console (`candidstudios` realm)
2. Left sidebar → **"Identity providers"**
3. Click **"Add provider"** dropdown
4. Select **"Microsoft"**

**Configure Microsoft Identity Provider**:
- **Alias**: `microsoft` (leave as default)
- **Display name**: `Microsoft` (or "Sign in with Microsoft")
- **Enabled**: Toggle **ON** ✅
- **Store tokens**: Toggle **ON**
- **Trust email**: Toggle **ON** ✅

**Microsoft Configuration**:
- **Client ID**: [Your Application (client) ID]
- **Client Secret**: [Your Client Secret Value]

**Advanced Settings**:
- **Sync mode**: `Import`
- **First login flow**: `first broker login`

Click **"Save"**

---

## Part 4: Configure Default Roles for Social Login Users

When users sign in with Google/Apple/Microsoft for the first time, you'll want to assign them a default role.

### Option 1: Assign Default Role to All New Users

1. In Keycloak admin console → `candidstudios` realm
2. Left sidebar → **"Realm settings"**
3. Click **"User registration"** tab
4. **Default roles**: Add `client` (or whatever default role you want)

This will auto-assign the `client` role to all new users (including social logins).

---

### Option 2: Configure Per-Provider Default Roles

For each identity provider (Google, Apple, Microsoft):

1. Left sidebar → **"Identity providers"**
2. Click on the provider (e.g., "Google")
3. Scroll to **"Mappers"** tab
4. Click **"Add mapper"**
5. Select **"Hardcoded Role"**

Configure:
- **Name**: `Default Client Role`
- **Role**: Select `client` (or your preferred default role)
- Click **"Save"**

Repeat for each provider if you want different default roles per provider.

---

## Part 5: Testing Social Login

1. **Logout** from any existing session
2. Go to **http://localhost:5173**
3. You should be redirected to Keycloak login
4. **Below the username/password fields**, you should now see:
   - 🔵 **"Google"** button
   - 🍎 **"Apple"** button
   - 🔷 **"Microsoft"** button

5. **Test Each Provider**:
   - Click the provider button
   - Login with your Google/Apple/Microsoft account
   - First time: Keycloak may ask to verify email or complete profile
   - Should redirect back to dashboard
   - Should see 2 apps (Cloud, Learning) if you set default role to `client`

---

## Troubleshooting

### Google Issues

**"redirect_uri_mismatch" error**:
- Check the redirect URI in Google Console matches EXACTLY:
  ```
  https://login.candidstudios.net/realms/candidstudios/broker/google/endpoint
  ```
- Case-sensitive, no trailing slash

**"Google+ API not enabled"**:
- Go to Google Cloud Console → APIs & Services → Library
- Search for "Google+ API" and enable it

---

### Apple Issues

**"invalid_client" error**:
- Verify Service ID matches exactly
- Check the .p8 private key is complete (including header/footer)
- Verify Team ID and Key ID are correct

**"unauthorized_client"**:
- Check redirect URI in Apple Developer console
- Ensure domain `login.candidstudios.net` is added

---

### Microsoft Issues

**"AADSTS50011: redirect_uri mismatch"**:
- Check redirect URI in Azure Portal matches EXACTLY:
  ```
  https://login.candidstudios.net/realms/candidstudios/broker/microsoft/endpoint
  ```

**"AADSTS700016: Application not found"**:
- Verify Application (client) ID is correct
- Check the app registration exists and is not deleted

---

## Security Best Practices

1. **Use HTTPS**: Social login requires HTTPS (which you have with login.candidstudios.net)
2. **Store secrets securely**: Never commit OAuth secrets to git
3. **Rotate secrets periodically**: Especially Microsoft client secrets (they expire)
4. **Enable MFA**: Consider requiring MFA for admin accounts
5. **Monitor login attempts**: Check Keycloak logs for suspicious activity

---

## Quick Reference: Redirect URIs

For all three providers, the redirect URI follows this pattern:
```
https://login.candidstudios.net/realms/candidstudios/broker/{provider}/endpoint
```

Where `{provider}` is:
- `google` for Google
- `apple` for Apple
- `microsoft` for Microsoft

---

## What Happens After Setup

1. Users see social login buttons on Keycloak login page
2. Clicking a button redirects to provider (Google/Apple/Microsoft)
3. User logs in with their account
4. Provider redirects back to Keycloak with user info
5. Keycloak creates a new user (first time) or links to existing user
6. User gets assigned default role (e.g., `client`)
7. User redirected back to dashboard with appropriate apps

---

## Next Steps

After configuring social login:
1. Test with real accounts from each provider
2. Verify default roles are assigned correctly
3. Test on production (https://dash.candidstudios.net) after deployment
4. Update documentation for end users
5. Consider adding custom branding to Keycloak login page
