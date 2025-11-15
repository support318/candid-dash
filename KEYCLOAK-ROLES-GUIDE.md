# Detailed Guide: Creating Keycloak Roles

## Prerequisites

Before creating roles, you must:
1. Have created the `candidstudios` realm
2. Be logged into Keycloak Admin Console at https://login.candidstudios.net
3. Have the `candidstudios` realm selected (check top-left dropdown)

---

## Step-by-Step: Creating the 10 Required Roles

### Navigation

1. In the **left sidebar**, click on **"Realm roles"**
2. You'll see a list of existing roles (may be empty if this is a new realm)
3. Look for the **"Create role"** button in the top-right corner

---

### Role 1: admin

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `admin`
   - **Description**: `Full administrative access to all applications`
3. Click **"Save"**
4. You should see a green success message

**Apps this role grants access to**: All 8 apps (Smart Channel, WebSite, Cloud, CRM, Earn, Answer Engine, Learning, Agent)

---

### Role 2: photographer

1. Click **"Create role"** button (or "Back to roles" then "Create role")
2. Fill in the form:
   - **Role name**: `photographer`
   - **Description**: `Photography team member with access to media tools`
3. Click **"Save"**

**Apps this role grants access to**: Smart Channel, Cloud, Learning

---

### Role 3: photographer-videographer

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `photographer-videographer`
   - **Description**: `Combined photo and video team member`
3. Click **"Save"**

**Apps this role grants access to**: Smart Channel, Cloud, Learning

---

### Role 4: photo-editor

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `photo-editor`
   - **Description**: `Photo editing team member`
3. Click **"Save"**

**Apps this role grants access to**: Smart Channel, Cloud

---

### Role 5: video-editor

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `video-editor`
   - **Description**: `Video editing team member`
3. Click **"Save"**

**Apps this role grants access to**: Smart Channel, Cloud

---

### Role 6: photo-video-editor

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `photo-video-editor`
   - **Description**: `Combined photo and video editing team member`
3. Click **"Save"**

**Apps this role grants access to**: Smart Channel, Cloud

---

### Role 7: client

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `client`
   - **Description**: `Customer/client with access to file storage and learning resources`
3. Click **"Save"**

**Apps this role grants access to**: Cloud, Learning

---

### Role 8: vendor

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `vendor`
   - **Description**: `Vendor/supplier with CRM access`
3. Click **"Save"**

**Apps this role grants access to**: CRM (only)

---

### Role 9: referrer

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `referrer`
   - **Description**: `Referral partner with access to earnings dashboard`
3. Click **"Save"**

**Apps this role grants access to**: Earn (only)

---

### Role 10: affiliate

1. Click **"Create role"** button
2. Fill in the form:
   - **Role name**: `affiliate`
   - **Description**: `Affiliate partner with access to commission tracking`
3. Click **"Save"**

**Apps this role grants access to**: Earn (only)

---

## Verification

After creating all 10 roles, you should see them in the "Realm roles" list:

1. Click **"Realm roles"** in the left sidebar
2. You should see all 10 roles listed:
   - ✅ admin
   - ✅ photographer
   - ✅ photographer-videographer
   - ✅ photo-editor
   - ✅ video-editor
   - ✅ photo-video-editor
   - ✅ client
   - ✅ vendor
   - ✅ referrer
   - ✅ affiliate

**Note**: You may also see some default Keycloak roles like:
- `default-roles-candidstudios`
- `offline_access`
- `uma_authorization`

These are automatically created by Keycloak and are normal - leave them as-is.

---

## Important Notes

### Role Names are Case-Sensitive!

The role names MUST match exactly as shown above (all lowercase with hyphens). The dashboard code looks for these exact role names:

```typescript
// From src/appsConfig.ts
roles: ['admin', 'photographer', 'photographer-videographer', ...]
```

If you create a role as `Photographer` (capital P) or `photo_editor` (underscore), it **will not work**.

### Descriptions are Optional

The descriptions are just for your reference in the Keycloak admin console. They don't affect functionality, but they're helpful for documenting what each role is for.

### You Can Edit Roles Later

If you make a typo or want to change a description:
1. Go to "Realm roles"
2. Click on the role name
3. Edit the fields
4. Click "Save"

### You Cannot Rename Roles

Keycloak doesn't allow renaming roles after creation. If you need to change a role name:
1. Create a new role with the correct name
2. Assign users to the new role
3. Delete the old role

---

## Quick Reference: Role → Apps Mapping

| Role | Smart Channel | WebSite | Cloud | CRM | Earn | Answer Engine | Learning | Agent |
|------|---------------|---------|-------|-----|------|---------------|----------|-------|
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **photographer** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **photographer-videographer** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **photo-editor** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **video-editor** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **photo-video-editor** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **client** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **vendor** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **referrer** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **affiliate** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## App URLs Reference

For your reference, here are the actual app URLs:

| App | URL | Description |
|-----|-----|-------------|
| Smart Channel | https://media.candidstudios.net | R2 File Explorer with OIDC |
| WebSite | https://www.candidstudios.net | WordPress CMS |
| Cloud | https://vidiblast.net | Nextcloud file sharing |
| CRM | https://app.candidstudios.net | Customer relationship management |
| Earn | https://earn.candidstudios.net | AffiliateWP platform |
| Answer Engine | https://payload.up.railway.app/ | Payload CMS AI engine |
| Learning (LMS) | https://ModalityVector.com | Learning management system |
| Agent | https://voice.candidstudios.net | VAPI/LiveKit voice AI |

---

## Troubleshooting

### Can't see "Create role" button?

**Check you're in the correct realm**:
- Look at the top-left dropdown
- Should say "candidstudios" (not "Master")
- If it says "Master", click the dropdown and select "candidstudios"

### Error when creating role?

**Check for duplicate names**:
- Each role name must be unique
- If you see "Role with name already exists", the role was already created
- Go to "Realm roles" list to see existing roles

### Role created but users still can't access apps?

**Check role assignment**:
1. Go to "Users" in left sidebar
2. Click on the username
3. Click "Role mapping" tab
4. Verify the role is listed under "Assigned roles"
5. If not, click "Assign role" and add it

### Dashboard showing wrong apps for a role?

**Verify role name is exact**:
- Go to "Realm roles"
- Click on the role
- Check the "Role name" field
- Must be exact lowercase match (e.g., `photographer`, not `Photographer`)

---

## What's Next?

After creating all 10 roles, proceed to:

1. **Create the `candid-dash` client** (see KEYCLOAK-SETUP-GUIDE.md Step 4)
2. **Configure client scopes** to include roles in tokens (Step 5)
3. **Create test users** and assign roles (Step 6)
4. **Test the integration** at http://localhost:5173 (Step 7)

The complete workflow is documented in `KEYCLOAK-SETUP-GUIDE.md`.
