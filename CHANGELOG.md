# Changelog

All notable changes to this project will be documented in this file.

## [2026-07-03]
### Changed
- **Folder Structure Cleanup**: Moved documentation (`gemini.md`, `email_draft.md`) into a `docs/` folder, moved utility scripts to `scripts/`, and deleted unused `App.css` file.
- **Test Suite Updates**: Wrote comprehensive frontend tests for the Admin Modal login flow and the "+ Add Contact" form rendering to ensure 100% test coverage for new functionality.
- **Reverted Accidental Changes**: Undid unintended README and Guide modifications from a previous session.

## [2026-07-02]
### Fixed
- **Status Badge UI Fix**: Set a uniform fixed width (140px) and centered alignment for all status badges to completely prevent the layout from shifting when clicking and changing contact statuses.

## [2026-07-01]
### Added
- **Editable Category Icons**: Built a dropdown to allow Admins to select custom Lucide icons (from 17 options) for any category group. Added backwards compatibility for older contacts.
- **Add / Edit Contacts**: Built a complete, unified UI modal for Admins to easily add new contacts or edit existing contacts on the fly.
- **Alphabetical Sorting**: Contacts within each category group are now automatically sorted alphabetically by name.
- **Undeliverable Status**: Added an 'Undeliverable' status to the status toggle cycle with a grey UI badge.
- **Clear Data Script**: Shipped an `npm run clear-data` script in `package.json` to allow anyone who forks the repository to instantly wipe the starter contacts.
- **Save Notifications**: Added a neat UI toast notification in the bottom right corner when changes are successfully saved to GitHub.
- **Revert to Pending**: Added a rotation button for Admins that resets any contact's status directly back to 'Pending'.
- **Public Response Tracking**: "Replied" contacts now get a View/Edit Response button allowing Admins to paste statements which can be publicly read via a modal overlay.
- **Automated Testing Suite**: Implemented `vitest` and `@testing-library/react` and wrote frontend unit tests to verify the UI.
- **Mobile Optimizations**: Converted the desktop table layout into sleek, stacked summary cards when viewed on mobile screens.
- **Retro Patriotic UI**: Styled the entire application with a clean, vintage aesthetic using Old Glory colors, typewriter fonts, block shadows, and a dark/light mode toggle.
- **GitHub as a Database**: Built the core CRM engine that uses the GitHub REST API and an Admin Personal Access Token to edit `public/data.json` directly from the browser without a backend.
- **Initial Setup**: Created the React app using Vite and deployed automatically to GitHub Pages.

### Fixed
- **API Cache & 409 Conflicts**: Engineered a robust debounced save function and a cache-busting timestamp (`?t=...`) to solve GitHub API staleness and prevent 409 Conflict errors when rapidly clicking statuses.

### Content Updates
- Added numerous contacts across newly defined categories (Government, Media, Political Parties, Candidates for Office).
- Heavily optimized and finalized the Game Theory Outreach Email Draft in `docs/email_draft.md`.
