# Changelog

All notable changes to the Malaysian Amateur Radio Call Book will be documented in this file.

## [2.3.1] - 2026-01-17
### Changed
- **New User Badge**: Reduced "NEW" badge duration from 30 days to **7 days**.
- **Statistics**: Updated "Added" dashboard statistic to count only the last **7 days**.

## [2.3.0] - 2026-01-17
### Added
- **Data Recovery**: Implemented robust SQL recovery scripts to restore accidental data loss (~190 callsigns restored).
- **Timestamps**: Added "Added" and "Edited" timestamps to callsign cards for better data transparency.
- **Specific Recovery**: Restored specific callsign `9M2VZX` with correct user assignment.

### Changed
- **Load More Button**: Replaced infinite scroll with a manual "Load More Callsigns" button for better control and performance.
- **Database Schema**: Added `updated_at` column to `callsigns` table to track modifications.

## [2.2.9] - 2026-01-16
### Reverted
- **New User Badge**: Reverted logic to standard **30 days** duration.
- **Statistics**: Reverted dashboard recent user count to **30 days**.

## [2.2.8] - 2026-01-16
### Removed
- **Unused Assets**: Removed `public/callsigns.json` as the application now relies entirely on user-submitted data via Supabase, rendering the static file obsolete.

## [2.2.7] - 2026-01-16
### Changed
- **New User Badge**: Adjusted `NEW` badge duration to **7 days** to align with the dashboard statistics.

## [2.2.6] - 2026-01-16
### Changed
- **New User Badge**: Reduced the "NEW" badge duration from 30 days to 24 hours to prevent older imports from being marked as new.
- **Statistics**: Updated the "Recently Added" dashboard statistic to count only the last 7 days (requires SQL function update).

## [2.2.5] - 2026-01-16
### Documentation
- **README Restoration**: Restored the original, detailed documentation regarding project philosophy, technical decisions, and architecture plans, while retaining the new modern visual style headers.

## [2.2.4] - 2026-01-16
### Documentation
- **README Redesign**: Completely revamped the `README.md` with a modern, "fancy" aesthetic, featuring glassmorphism badges, improved layout, feature grids, and clearer architecture documentation.

## [2.2.3] - 2026-01-16
### Security
- **Reset Password**: Added Cloudflare Turnstile protection to the Reset Password page to prevent automated spam/abuse.

## [2.2.2] - 2026-01-16
### Changed
- **Local Assets**: All state flags are now hosted locally within the repository, improving load times and reliability by removing dependencies on reliable external wikimedia links.

## [2.2.1] - 2026-01-16
### Changed
- **Donation QR Code**: Now self-hosted within the GitHub repository for better reliability, removing dependency on external Google Drive hosting.

## [2.2.0] - 2026-01-16
### Added
- **Auto Logout**: Added inactivity timeout (5 minutes) to automatically log out users and protect sessions.
- **Smart Popups**:
    - Mobile: "Install App" prompt (persistent).
    - Desktop: "Donate" prompt (session-based, auto-show once upon login).
- **Desktop Popup Support**: Enabled donation popup visibility on desktop browsers.

### Changed
- **Install App Logic**: Restored "Install App" prompt logic to be mobile-focused, while enabling Donation prompts on desktop.
- **Auto Logout Timer**: Configured to 5 minutes as per user request.

## [2.1.1] - 2026-01-16

### 🐛 Bug Fixes
- **UI**: Adjusted Toast notification position to sit **below the navbar**, ensuring it doesn't block view or controls.



## [2.1.0] - 2026-01-16

### 🛡️ Security & Access
- **Cloudflare Turnstile**: Added robust anti-spam protection to Registration and Login pages.
- **Local Backups**: Introduced secure `backup-db.sh` script for safe local database dumps.
- **Strict Access Control**: Restricted Donator Badge management exclusively to Super Admins.

### 📱 User Experience
- **Mobile Responsiveness**: Fixed Login page layout on small screens to prevent content cutoff.
- **Badge System**: Migrated to precise callsign-based badge assignment.
- **Feedback**: Enhanced UI feedback for admin actions.

---

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
