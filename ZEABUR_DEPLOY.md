# Zeabur Deployment Guide

## Quick Deploy

### Prerequisites
- GitHub account
- DeepSeek API key (already have)

---

### Step 1: Push to GitHub

If you haven't created a GitHub repo yet:

```bash
cd /workspace/projects

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/zodiac-chatbot.git

# Push to GitHub
git push -u origin main
```

---

### Step 2: Deploy on Zeabur

1. Visit https://zeabur.com
2. Click "Login" → "Login with GitHub"
3. Authorize Zeabur to access your GitHub

### Step 3: Create Project

1. Click "New Project"
2. Select "Deploy a GitHub Repository"
3. Choose "zodiac-chatbot" (or your repo name)
4. Zeabur will auto-detect Next.js

### Step 4: Configure Environment Variables

1. Click on your project
2. Go to "Variables" tab
3. Add new variable:

| Name | Value |
|------|-------|
| `DEEPSEEK_API_KEY` | `sk-a690cc2dc91648e6a8c0eeb802f2c966` |

### Step 5: Deploy

1. Click "Redeploy" or push a new commit
2. Wait for deployment to complete
3. Get your public URL

---

### Your URL will be like:
```
https://zodiac-chatbot.zeabur.app
```

Or custom domain if configured.

---

### Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Verify build command: `pnpm install && pnpm build`

**API not working?**
- Verify `DEEPSEEK_API_KEY` is set
- Check Zeabur logs for errors

---

## Features on Zeabur

| Feature | Supported |
|---------|-----------|
| Next.js | ✅ |
| Environment Variables | ✅ |
| Custom Domain | ✅ |
| HTTPS | ✅ |
| Auto-deploy | ✅ |
| China Region | ✅ |

---

## Cost

| Plan | Price |
|------|-------|
| Free | $0/month |
| Pro | $5/month |

The free plan should be sufficient for this project!

---

## After Deployment

Your chatbot will be available 24/7 at:
```
https://your-project.zeabur.app
```

Share this link with users to collect feedback!
