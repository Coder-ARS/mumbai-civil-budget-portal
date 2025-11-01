# Quick Start Guide - Frontend

## 🚀 Get Running in 5 Minutes

### Step 1: Install Node.js
- Download Node.js 18+ from: https://nodejs.org/
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

### Step 2: Install Dependencies
```powershell
cd frontend
npm install
```

This will install all dependencies including:
- Next.js, React, TypeScript
- Tailwind CSS
- React-Leaflet (for maps)
- Zustand (state management)
- Axios (HTTP client)
- And more...

### Step 3: Configure Environment
```powershell
# Copy the example env file
copy .env.local.example .env.local

# Edit if needed (defaults should work)
notepad .env.local
```

### Step 4: Make Sure Backend is Running
The frontend needs the backend API to be running:
```powershell
# In a separate terminal, navigate to backend
cd ..\backend

# Activate venv and run
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Backend should be running on: http://localhost:8000

### Step 5: Start Frontend
```powershell
# Make sure you're in frontend directory
cd frontend

# Start development server
npm run dev
```

Open your browser to: **http://localhost:3000**

## ✅ What You Should See

1. **Header** with "Mumbai Civil Budget Portal" title
2. **Map** in the center (locked to Mumbai)
3. **Project list** on the right side
4. **Filter panel** on the left (desktop only)
5. **Project markers** on the map

## 🎯 Quick Actions to Try

### View Projects
- Scroll through project list on the right
- Click on a project card to see details
- Click map markers to view project info

### Filter Projects
- Use filter panel on left
- Filter by status, ward, or budget
- Search using the search box

### Report an Issue
- Click "Report Issue" button in header
- Fill out the form
- Attach photos (optional)
- Submit report

## 🐛 Common Issues

### Port 3000 Already in Use
```powershell
# Use a different port
npm run dev -- -p 3001
```

### "Cannot GET /" Error
- Make sure you ran `npm install`
- Delete `.next` folder and try again:
  ```powershell
  rm -r -fo .next
  npm run dev
  ```

### Map Not Loading
- Check browser console for errors
- Ensure internet connection (for map tiles)
- Try hard refresh: `Ctrl + Shift + R`

### API Connection Failed
- Verify backend is running: http://localhost:8000/health
- Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
- Check CORS is enabled in backend

### Build Errors
```powershell
# Clean install
rm -r -fo node_modules
rm package-lock.json
npm install
```

## 📊 Sample Data

If you seeded the backend database, you should see:
- ✅ 24 Mumbai wards
- ✅ 8 sample projects
- ✅ 5 contractors
- ✅ Sample tenders and contracts

## 🎨 UI Overview

### Desktop Layout
```
┌─────────────────────────────────────────────┐
│              Header (Logo, Menu)             │
├──────────┬──────────────────┬────────────────┤
│          │                  │                │
│ Filters  │   Mumbai Map     │  Project List  │
│  Panel   │   (Locked)       │   (Scrollable) │
│          │                  │                │
│          │                  │                │
└──────────┴──────────────────┴────────────────┘
```

### Mobile Layout
```
┌─────────────────────────┐
│    Header (Compact)     │
├─────────────────────────┤
│                         │
│     Mumbai Map          │
│     (Full Width)        │
│                         │
├─────────────────────────┤
│  Bottom Sheet           │
│  (Project List/Detail)  │
└─────────────────────────┘
```

## 🔧 Development Tips

### Hot Reload
Changes to files automatically refresh the page

### TypeScript Errors
Check types with:
```powershell
npm run type-check
```

### Tailwind CSS
All styles use Tailwind classes. IntelliSense should show available classes.

### Component Structure
```typescript
'use client'; // For client components

import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState();
  
  return (
    <div className="p-4">
      {/* Component content */}
    </div>
  );
}
```

## 📁 Key Files to Know

### Configuration
- `.env.local` - Environment variables
- `tailwind.config.js` - Tailwind configuration
- `next.config.js` - Next.js configuration

### Main Pages
- `src/app/page.tsx` - Home page
- `src/app/layout.tsx` - Root layout

### API Integration
- `src/lib/api-client.ts` - API client
- `src/types/index.ts` - TypeScript types

### State Management
- `src/store/index.ts` - Global state

### Utilities
- `src/lib/utils.ts` - Helper functions

## 🎓 Next Steps

1. **Explore the code** - Check out component files
2. **Make changes** - Try modifying colors in `tailwind.config.js`
3. **Add features** - Create new components
4. **Read docs** - See `README.md` for detailed documentation

## 📖 Resources

- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org/docs

## 🆘 Need Help?

1. Check `README.md` for detailed docs
2. Review browser console for errors
3. Check backend logs
4. Search issues in repository

---

**You're all set!** 🎉

The frontend should now be running and connected to your backend API.

Try clicking around, filtering projects, and exploring the map!
