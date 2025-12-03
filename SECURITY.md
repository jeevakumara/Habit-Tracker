# 🔒 CRITICAL SECURITY SETUP

⚠️ **IMMEDIATE ACTION REQUIRED**

## Step 1: Rotate Firebase Credentials (RIGHT NOW)

1. Go to https://console.firebase.google.com/project/habit-tracker-253da/settings/serviceaccounts
2. Click **"Generate new private key"** → Download JSON
3. **DELETE** the old service account key immediately
4. Update `backend/.env` with new credentials

## Step 2: Get Firebase Web Config

1. Firebase Console → Project Settings → General → Your apps
2. Select Web app → Copy config
3. Update `frontend/.env` with API key and config

## Step 3: Verify .env is NOT in Git

```bash
git rm --cached backend/.env frontend/.env
git status  # Should NOT show .env files
```

## 🚨 NEVER COMMIT

- `backend/.env`
- `frontend/.env`
- `*-firebase-adminsdk-*.json`
- Any files with credentials

## ✅ SAFE TO COMMIT

- `.env.example` files
- `.gitignore` files
