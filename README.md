# 🎁 Giftmate PWA — Deploy Guide

## What's in this folder
```
giftmate-pwa/
├── public/
│   ├── index.html      ← Main app shell
│   ├── app.jsx         ← Full React app (your Giftmate)
│   ├── manifest.json   ← Makes it installable as an app
│   ├── sw.js           ← Service worker (offline support)
│   ├── icon-192.png    ← App icon (home screen)
│   └── icon-512.png    ← App icon (splash screen)
└── vercel.json         ← Vercel routing config
```

---

## 🚀 Deploy to Vercel (5 minutes, free)

1. Go to **vercel.com** and sign up with Google
2. Click **"Add New Project"**
3. Click **"Import"** → then **"Upload"** (drag & drop the whole `giftmate-pwa` folder)
4. Leave all settings as default → click **"Deploy"**
5. Vercel gives you a live URL like: `https://giftmate.vercel.app`

---

## 📱 Install on your iPhone

1. Open your Vercel URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (box with arrow at bottom)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **"Add"** — Giftmate appears on your home screen like a real app!

## 📱 Install on Android

1. Open your Vercel URL in **Chrome**
2. Tap the **3-dot menu** (top right)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Done!

---

## 💰 Your Affiliate Tags (already in the code)
- **Amazon**: `giftmate0d-20` ✅
- **GetYourGuide**: `YHVA20C` ✅
- **Viator**: Add when approved (replace `YOUR_VIATOR_TAG` in app.jsx)
- **Etsy**: Add when Awin account activated

## 🔧 Update your Amazon website URL
Log into associates.amazon.com and update your website URL to your
new Vercel URL (e.g. https://giftmate.vercel.app)

---

## 💡 Custom domain (optional, ~$12/year)
1. Buy `giftmate.app` or `giftmate.co` on Namecheap or Google Domains
2. In Vercel dashboard → your project → Settings → Domains → Add your domain
3. Follow the DNS instructions (takes ~10 mins)
