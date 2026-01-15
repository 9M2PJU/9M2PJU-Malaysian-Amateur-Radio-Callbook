# Changelog

All notable changes to the Malaysian Amateur Radio Call Book will be documented in this file.

## [2.0.0] - 2026-01-16

### 🎉 Major Features

#### Progressive Web App (PWA) Support
- **Add to Home Screen**: Users can now install MY-Callbook as a standalone app
- **Mobile-First Install UX**: Persistent installation prompt on mobile devices until user installs
- **Desktop Install Button**: Non-intrusive navbar button for desktop users (no auto-popup)
- **Offline Capability**: Service Worker caches assets for offline access
- **PNG Icons**: 192x192 and 512x512 optimized icons for maximum browser compatibility

#### Real-Time Live Notifications
- **User Presence Tracking**: See when other users join or leave the site
- **Database Change Notifications**: Real-time alerts for new registrations, profile updates, and deletions
- **Smart Filtering**: Users don't see notifications for their own actions
- **Beautiful Toast UI**: Dark glassmorphism-themed toasts in bottom-right corner
- **Auto-Dismiss**: Notifications automatically disappear after 5 seconds

### ✨ Enhancements
- **vite-plugin-pwa Integration**: Automated Service Worker and manifest generation
- **Mobile Detection**: Smart device detection for platform-specific install prompts
- **Context-Based State Management**: Global PWA state sharing via React Context
- **Login-Gated Features**: Install prompts and notifications only appear for authenticated users

### 🔧 Technical Improvements
- Service Worker with fetch handler for PWA compliance
- Supabase Realtime Presence for user tracking
- Supabase Postgres Changes for database event streaming
- WebSocket-based notifications (no push server required)
- localStorage removed for mobile install persistence

### 📱 User Experience
- **Mobile**: Persistent install popup until installation (non-dismissible)
- **Desktop**: Clean navbar button, click to install (no intrusive popups)
- **Toast Notifications**: In-app only, no system notifications or permission requests
- **No Spam**: Smart notification filtering and auto-dismissal

### 🐛 Bug Fixes
- Fixed duplicate manifest.json link causing PWA installation errors
- Removed Tailwind CSS classes in favor of vanilla CSS
- Corrected icon format from JPEG to PNG for browser compatibility
- Resolved manifest syntax errors by removing legacy manifest references

### 🛠️ Developer Notes
- Built with `vite-plugin-pwa@1.2.0`
- Icons generated using ImageMagick
- React Context pattern for global PWA state
- Mobile detection via user-agent string

---

## [1.0.0] - Previous Release
- Initial release with basic callsign directory functionality
- User authentication via Supabase
- Callsign search and filtering
- Admin management system
