# Zodiac MBTI Mystic Oracle - Deployment Guide

## Vercel Deployment (24/7 Available)

### Step 1: Upload to GitHub

**Option A: Use GitHub Web (Recommended)**
1. Go to https://github.com and sign in
2. Click **New repository**
3. Name it `zodiac-mbti-oracle`
4. Select **Public** or **Private**
5. Click **Create repository**

Then upload all files:
1. In your new repository, click **uploading an existing file**
2. Drag all files from `/workspace/projects/` folder
3. Click **Commit changes**

**Option B: Use Git Commands**
```bash
cd /workspace/projects
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zodiac-mbti-oracle.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign up/login with GitHub
2. Click **Add New Project**
3. Import your `zodiac-mbti-oracle` repository
4. Click **Deploy**

### Step 3: Set Environment Variable

1. In Vercel project settings, go to **Environment Variables**
2. Add:
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: `sk-a690cc2dc91648e6a8c0eeb802f2c966`
3. Click **Save**
4. Go to **Deployments**, click **Redeploy** on the latest deployment

### Step 4: Your Site is Ready!

After deployment completes, Vercel will give you a URL like:
`https://zodiac-mbti-oracle.vercel.app`

This will be available 24/7!

---

## Files Included
- `vercel.json` - Vercel configuration
- All source code in `src/` directory
- `package.json` with dependencies
- API route at `/api/chat`

## Note
The site uses localStorage for user sessions, so each browser/device has independent data.
