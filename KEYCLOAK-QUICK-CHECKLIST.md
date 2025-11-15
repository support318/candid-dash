# Keycloak Setup Quick Checklist

## Before You Start
- [ ] Open https://login.candidstudios.net in browser
- [ ] Login to Administration Console (username: vidiman)
- [ ] Have this checklist ready

---

## Part 1: Create Realm (1 step)

- [ ] **Create `candidstudios` realm**
  - Top-left dropdown → "Create Realm"
  - Realm name: `candidstudios`
  - Click "Create"

---

## Part 2: Create 10 Roles (10 steps)

**Navigation**: Left sidebar → "Realm roles" → "Create role" button

### Creative/Production Team Roles
- [ ] **1. admin** - `Full administrative access to all applications`
- [ ] **2. photographer** - `Photography team member with access to media tools`
- [ ] **3. photographer-videographer** - `Combined photo and video team member`
- [ ] **4. photo-editor** - `Photo editing team member`
- [ ] **5. video-editor** - `Video editing team member`
- [ ] **6. photo-video-editor** - `Combined photo and video editing team member`

### External User Roles
- [ ] **7. client** - `Customer/client with access to file storage and learning resources`
- [ ] **8. vendor** - `Vendor/supplier with CRM access`
- [ ] **9. referrer** - `Referral partner with access to earnings dashboard`
- [ ] **10. affiliate** - `Affiliate partner with access to commission tracking`

**For each role**: Click "Create role" → Enter role name → Enter description → Click "Save"

---

## Part 3: Create Client (1 step)

- [ ] **Create `candid-dash` client**

  **Step 1: General Settings**
  - Left sidebar → "Clients" → "Create client"
  - Client ID: `candid-dash`
  - Client type: `OpenID Connect`
  - Click "Next"

  **Step 2: Capability Config**
  - Client authentication: **OFF**
  - Authorization: **OFF**
  - Authentication flow:
    - ✅ Standard flow
    - ✅ Direct access grants
    - ❌ All others
  - Click "Next"

  **Step 3: Login Settings**
  - Valid redirect URIs:
    - `http://localhost:5173/*`
    - `https://dash.candidstudios.net/*`
  - Valid post logout redirect URIs:
    - `http://localhost:5173/*`
    - `https://dash.candidstudios.net/*`
  - Web origins: `+`
  - Click "Save"

---

## Part 4: Configure Client Scopes (1 step)

- [ ] **Add roles to JWT token**
  - Left sidebar → "Client scopes"
  - Click "roles" (in the list)
  - Click "Mappers" tab
  - Click "Add mapper" → "By configuration"
  - Select "User Realm Role"
  - Configure:
    - Name: `realm roles`
    - Token Claim Name: `realm_access.roles`
    - Claim JSON Type: `String`
    - Add to ID token: **ON**
    - Add to access token: **ON**
    - Add to userinfo: **ON**
  - Click "Save"

---

## Part 5: Create 4 Test Users (4 steps)

**Navigation**: Left sidebar → "Users" → "Create new user"

### Test User 1: Admin
- [ ] **testadmin** (admin@test.com)
  - Username: `testadmin`
  - Email: `admin@test.com`
  - First name: `Admin`
  - Last name: `User`
  - Email verified: **ON**
  - Click "Create"
  - **Credentials tab** → Set password: `testadmin123` → Temporary: **OFF** → Save
  - **Role mapping tab** → "Assign role" → Select `admin` → "Assign"

### Test User 2: Photographer
- [ ] **testphotographer** (photographer@test.com)
  - Username: `testphotographer`
  - Email: `photographer@test.com`
  - First name: `Photo`
  - Last name: `Grapher`
  - Email verified: **ON**
  - Click "Create"
  - **Credentials tab** → Set password: `testphoto123` → Temporary: **OFF** → Save
  - **Role mapping tab** → "Assign role" → Select `photographer` → "Assign"

### Test User 3: Client
- [ ] **testclient** (client@test.com)
  - Username: `testclient`
  - Email: `client@test.com`
  - First name: `Test`
  - Last name: `Client`
  - Email verified: **ON**
  - Click "Create"
  - **Credentials tab** → Set password: `testclient123` → Temporary: **OFF** → Save
  - **Role mapping tab** → "Assign role" → Select `client` → "Assign"

### Test User 4: Vendor (for auto-redirect test)
- [ ] **testvendor** (vendor@test.com)
  - Username: `testvendor`
  - Email: `vendor@test.com`
  - First name: `Test`
  - Last name: `Vendor`
  - Email verified: **ON**
  - Click "Create"
  - **Credentials tab** → Set password: `testvendor123` → Temporary: **OFF** → Save
  - **Role mapping tab** → "Assign role" → Select `vendor` → "Assign"

---

## Part 6: Test the Integration (4 tests)

**Ensure dev server is running**:
```bash
cd /mnt/c/code/candid-dash
npm run dev
```

Open: http://localhost:5173

### Test 1: Admin User
- [ ] Login with: `testadmin` / `testadmin123`
- [ ] Should see: All 8 apps
- [ ] Should see: App launcher grid (NOT auto-redirect)
- [ ] Header shows: "Admin User" + "admin" badge
- [ ] Logout button works

### Test 2: Photographer User
- [ ] Login with: `testphotographer` / `testphoto123`
- [ ] Should see: 3 apps (Smart Channel, Cloud, Learning)
- [ ] Should see: App launcher grid
- [ ] Header shows: "Photo Grapher" + "photographer" badge

### Test 3: Client User
- [ ] Login with: `testclient` / `testclient123`
- [ ] Should see: 2 apps (Cloud, Learning)
- [ ] Should see: App launcher grid
- [ ] Header shows: "Test Client" + "client" badge

### Test 4: Vendor User (Auto-Redirect Test)
- [ ] Login with: `testvendor` / `testvendor123`
- [ ] Should see: "Redirecting to your app..." message
- [ ] Should auto-redirect to: https://app.candidstudios.net (after 1.5 seconds)

---

## Troubleshooting

### Still seeing "Page not found"?
- [ ] Check top-left dropdown says "candidstudios" (not "Master")
- [ ] Verify client `candid-dash` exists in Clients list
- [ ] Clear browser cache/cookies and try again

### No apps showing after login?
- [ ] Check browser console (F12) for errors
- [ ] Verify user has role assigned (Users → username → Role mapping)
- [ ] Verify role name is exact lowercase match

### Roles not in token?
- [ ] Verify Client scopes → roles → Mappers has "realm roles" mapper
- [ ] Check "Add to ID token" and "Add to access token" are ON

---

## Success Criteria

✅ You've successfully completed setup when:
1. http://localhost:5173 redirects to Keycloak login (NOT "Page not found")
2. All 4 test users can login successfully
3. Each user sees the correct apps based on their role
4. Vendor user auto-redirects (has only 1 app)
5. User name and role badge show in header
6. Logout button works and returns to Keycloak

---

## Next Steps After Successful Testing

- [ ] Commit code to git
- [ ] Deploy to Railway
- [ ] Test production at https://dash.candidstudios.net
- [ ] Create real user accounts
- [ ] Assign appropriate roles to real users
- [ ] Delete test users (optional)

---

## Time Estimate

- **Part 1 (Realm)**: 1 minute
- **Part 2 (Roles)**: 5-7 minutes
- **Part 3 (Client)**: 3-4 minutes
- **Part 4 (Scopes)**: 2-3 minutes
- **Part 5 (Users)**: 8-10 minutes
- **Part 6 (Testing)**: 5 minutes

**Total**: ~25-30 minutes for complete setup

---

## Role Name Reference (Copy-Paste)

```
admin
photographer
photographer-videographer
photo-editor
video-editor
photo-video-editor
client
vendor
referrer
affiliate
```

**IMPORTANT**: Role names are case-sensitive! Use exact lowercase as shown.
