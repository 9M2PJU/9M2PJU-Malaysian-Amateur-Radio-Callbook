# Changelog

All notable changes to the Malaysian Amateur Radio Call Book will be documented in this file.

## [2.3.6] - 2026-01-20
### Bug Fixes
- **Telegram Integration**: Fixed generic error messages in "Test Telegram" button to show specific backend errors.
- **Backend**: Resolved "non-2xx" errors by ensuring `telegram-test-message` Edge Function is correctly deployed and configured.

## [2.3.5] - 2026-01-20
### UI & Branding
- **Branding**: Reverted brand logo to Gold version.
- **Login Page**: Optimized layout to prevent scrollbars and standardized sizing. Reduced title font size.
- **Navbar**: Reverted layout to horizontal style.

## [2.3.4] - 2026-01-20
### Performance & Responsiveness
- **Grid Virtualization**: Implemented `@tanstack/react-virtual` to efficiently render large lists of callsigns, significantly reducing DOM nodes and improving scrolling performance.
- **Component Optimization**: Optimized `Card.jsx` with `useMemo` for derived data and `loading="lazy"` for images to reduce main thread blocking.
- **Render Stability**: Wrapped key event handlers in `App.jsx` with `useCallback` to prevent unnecessary re-renders.
- **Mobile Layout**: Adjusted grid column strategy to better fit smaller screens (min 300px cards).

## [2.3.3] - 2026-01-19
### UI Enhancement
- **Tagline Update**: Updated homepage tagline to "The Modern Yellow Pages for Malaysian Amateur Radio Operators" with 9M2PJU attribution linking to [hamradio.my](https://hamradio.my).

## [2.3.2] - 2026-01-17
### Maintenance Release
- **Core Directory**: Complete searchable database of Malaysian Amateur Radio Operators.
- **Modern UI**: Full glassmorphism design with responsive mobile support.
- **PWA Ready**: Installable as a native app on iOS/Android/Desktop.
- **User Dashboard**: Manage your own callsigns, edit details, and export vCards.
- **Statistics**: Real-time dashboard showing operator counts, classes, and top locations.
- **Data Safety**: Built-in logic for safe data updates and recovery.
- **Timestamps**: "Added" and "Edited" tracking for all records.
- **Security**: Cloudflare Turnstile integration and role-based access control.
