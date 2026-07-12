# Frontend - Intelligent Mission Planning Assistant

## Overview

The frontend is a **React + TypeScript application** with a responsive dashboard UI for managing satellite missions, resources, and recommendations. It uses **Tailwind CSS** for styling, **Recharts** for data visualization, and **Framer Motion** for animations.

---

## What Frontend Displays (Without Backend)

### ✅ Pages Currently Displaying

1. **Dashboard** (`/`)
   - Mission statistics and overview cards
   - Real-time mission timeline with animated events
   - Mission status distribution charts
   - Ground stations list with location data
   - AI recommendations carousel
   - Battery and resource status indicators

2. **Mission Planning** (`/missions`)
   - Mission queue table with status, priority, and execution time
   - Mission filter and search functionality
   - Priority summary statistics
   - Detailed mission timeline view

3. **Satellite Operations** (`/operations`)
   - Communication windows schedule
   - Ground station management display
   - Payload schedule and configuration
   - Real-time operation status indicators

4. **Resources** (`/resources`)
   - Battery/Power metrics with trend predictions
   - Memory usage charts and trends
   - Storage capacity visualization
   - Resource utilization percentages with warnings

5. **Recommendations** (`/recommendations`)
   - AI-generated mission optimization recommendations
   - Risk level indicators (High, Medium, Low)
   - Expected improvement percentages
   - Recommendation category filtering

6. **Analytics** (`/analytics`)
   - Mission completion rates and trends
   - Growth statistics over time
   - Resource usage analytics
   - Historical performance charts

7. **Settings** (`/settings`)
   - Dark/Light theme toggle
   - Notification preferences (UI placeholders)
   - Profile settings (UI placeholders)
   - API configuration interface (non-functional)

### 📊 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Tailwind CSS dark mode enabled by default
- **Real-time Updates** - Simulated with animated transitions
- **Interactive Charts** - Recharts library for data visualization
- **Smooth Animations** - Framer Motion for component animations
- **Navigation Sidebar** - Collapsible navigation with active page highlighting
- **Navbar** - Top bar with theme toggle and user info

### 📦 Data Source

All displayed data is **hardcoded** from:
- `src/data/dummyData.ts` - Mock mission, resource, and recommendation data

---

## Current Issues Preventing Full Functionality

### 🔴 CRITICAL ISSUES

#### 1. **Empty Backend** (Blocks API Integration)
- File: `backend/app/main.py` is **empty (0 bytes)**
- All route files are empty:
  - `backend/app/api/mission_routes.py` - Empty
  - `backend/app/api/resource_routes.py` - Empty
  - `backend/app/api/recommendation_routes.py` - Empty
  - `backend/app/api/dashboard_routes.py` - Empty
- **Impact**: No API endpoints available; frontend cannot fetch real data

#### 2. **Navbar Props Type Mismatch** (TypeScript Build Error)
- File: `src/layouts/MainLayout.tsx` passes `onToggleSidebar` prop to Navbar
- File: `src/components/Navbar/Navbar.tsx` doesn't accept this prop
- **Error**: `Property 'onToggleSidebar' does not exist on type 'NavbarProps'`
- **Impact**: Build fails with TypeScript error; prevents deployment
- **Fix Required**: Remove unused prop from MainLayout or add to Navbar interface

#### 3. **No API Integration** (Unused Services)
- API services defined but **never imported or called**:
  - `src/services/api.ts` - Main API client
  - `src/services/missionApi.ts` - Mission endpoints
  - `src/services/resourceApi.ts` - Resource endpoints
  - `src/services/recommendationApi.ts` - Recommendation endpoints
- Expected endpoints (not available):
  ```
  GET /api/missions
  GET /api/resources
  GET /api/recommendations
  ```
- **Impact**: Pages only render static dummy data; real-time updates impossible

---

### 🟡 MEDIUM PRIORITY ISSUES

#### 4. **Duplicate Files** (Code Confusion)
- Unnecessary `.jsx` versions exist alongside `.tsx` files:
  - `App.jsx` (duplicate of `App.tsx`)
  - `main.jsx` (duplicate of `main.tsx`)
  - `Dashboard.jsx` (duplicate of `Dashboard.tsx`)
  - `MissionPlanner.jsx` (duplicate of `MissionPlanning.tsx`)
  - `Recommendations.jsx` (duplicate of `Recommendations.tsx`)
  - `Resources.jsx` (duplicate of `Resources.tsx`)
  - `Settings.jsx` (duplicate of `Settings.tsx`)
- **Impact**: Confusion, wasted resources, maintenance overhead

#### 5. **No Environment Configuration**
- Missing `.env.local` or `.env` file
- API base URL hardcoded to `/api` (works only in development)
- **Impact**: Cannot change API URL for production/staging deployments

#### 6. **No Error Handling or Loading States**
- No `useEffect` or `useState` hooks for data fetching
- `Loading.tsx` component exists but is unused
- No error boundaries or error UI
- **Impact**: If API is integrated, no feedback during loading or failures

#### 7. **Hardcoded Data Values**
- Battery level always shows **78%** (static prop)
- Ground stations, missions, and resources are static
- Timestamps are not dynamic
- **Impact**: Cannot verify real-time data flow when backend is ready

---

### 🟢 LOW PRIORITY ISSUES

#### 8. **Unused Sidebar Props**
- `MainLayout.tsx` passes `isOpen` and `onClose` props to Sidebar
- Sidebar component doesn't use these props
- **Impact**: Mobile sidebar toggle won't work properly

#### 9. **Empty Configuration Files**
- `docker-compose.yml` - Empty
- Root `README.md` - Empty
- **Impact**: Cannot run full stack locally; no documentation

#### 10. **Incomplete Settings Page**
- Settings UI shows "API Configuration" but it's non-functional
- Notification preferences are placeholders
- No state persistence for user preferences

---

## Setup & Run Instructions

### Prerequisites
```bash
Node.js v18+ 
npm v9+
```

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
- Runs on `http://localhost:5173` (Vite default)
- Server configured in `vite.config.ts` to run on `0.0.0.0:3000`

### Build
```bash
npm run build
```
- Executes: `tsc -b && vite build`
- **⚠️ Will fail** on Navbar props TypeScript error

### Fix Build Error (Immediate Action)

**Option A**: Remove unused prop from MainLayout
```typescript
// src/layouts/MainLayout.tsx - Remove this line
// onToggleSidebar={toggleSidebar}
```

**Option B**: Add prop to Navbar interface
```typescript
// src/components/Navbar/Navbar.tsx
export interface NavbarProps {
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;  // Add this
}
```

---

## Architecture

### Component Structure
```
App.tsx (Routes)
├── MainLayout.tsx (Global Layout)
│   ├── Navbar.tsx (Top Bar)
│   ├── Sidebar.tsx (Navigation)
│   └── [Page Component] (Content)
│       ├── Dashboard.tsx
│       ├── MissionPlanning.tsx
│       ├── SatelliteOperations.tsx
│       ├── Resources.tsx
│       ├── Recommendations.tsx
│       ├── Analytics.tsx
│       └── Settings.tsx
```

### State Management
- Currently: Props drilling (no context or state management)
- Theme state in `MainLayout.tsx`
- No data fetching hooks

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- Dark mode configuration in `tailwind.config.js`
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`

### Dependencies
- `react` 19.0.0 - UI library
- `react-router-dom` 6.30.0 - Routing
- `axios` 1.7.4 - HTTP client (defined but unused)
- `recharts` 2.9.0 - Charts and visualization
- `framer-motion` 11.11.7 - Animations
- `react-icons` 5.0.1 - Icon library
- `tailwindcss` 3.4.14 - Styling

---

## Next Steps for Full Integration

### 1. **Fix TypeScript Errors** (URGENT)
   - Resolve Navbar props mismatch
   - Remove duplicate `.jsx` files
   - Run `npm run build` successfully

### 2. **Implement Backend API**
   - Create endpoints in `backend/app/api/*_routes.py`
   - Return JSON data matching `dummyData.ts` structure

### 3. **Connect Frontend to Backend**
   - Import API services in page components
   - Replace dummy data with API calls using `useEffect` and `useState`
   - Add loading and error states
   - Implement error boundaries

### 4. **Configuration**
   - Create `.env.local` for API base URL
   - Update `src/services/api.ts` to use environment variable
   - Docker setup for development environment

### 5. **Testing & Deployment**
   - Add error handling for failed requests
   - Implement retry logic for failed API calls
   - Set up CI/CD pipeline
   - Production build optimization

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production (currently fails)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint (if configured)
```

---

## Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **UI Display** | ✅ Working | All pages render with mock data |
| **Responsiveness** | ✅ Good | Works on all screen sizes |
| **Animations** | ✅ Working | Framer Motion implemented |
| **Build** | ❌ Fails | Navbar props TypeScript error |
| **Backend Integration** | ❌ Not Ready | Backend is empty |
| **API Services** | ⚠️ Defined | Never called by components |
| **Real-time Data** | ❌ Not Possible | All data is static/hardcoded |
| **Error Handling** | ❌ Not Implemented | No error boundaries or fallbacks |
| **Documentation** | ⚠️ Partial | This README added; code needs comments |

---

## Contact & Support

For issues or questions about the frontend:
1. Check the build errors in TypeScript compilation
2. Verify all dependencies are installed: `npm install`
3. Check browser console for runtime errors
4. Ensure backend is running on the correct port (default: `/api`)
