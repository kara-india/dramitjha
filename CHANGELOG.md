# Changelog

All notable changes to KrishnaHealth (Dr. Amit Jha Sports Medicine Clinic) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-30

### Added
- **3D Interactive Body Selector MVP**: Three.js / React Three Fiber interactive anatomical human model (`BodySelector3D`) with DRACO GLB decoding, node mapping adapter (`nodeMapper.ts`), emissive hover highlights, and low-power/mobile SVG fallback (`human-fallback.svg`).
- **Hero & Navigation**: `HeroBone` component with 4 WCAG-accessible CTAs (*Book Appointment*, *Services*, *Testimonials*, *Know Your Doctor*).
- **Slide-Over & Booking Dialog**: `PartDetailsPanel` slide-over drawer and `BookingModal` dialog pre-filled with selected anatomical regions.
- **Server/Client Component Architecture**: Transitioned `/` route to a static React Server Component (`○ Static`) with isolated client islands (`MobileNavIsland`, `BodyNavigatorIsland`, `BookingWizardIsland`, `LandingAnimations`, `BodySelectorFeature`).
- **Serverless Booking & Feedback API**: App Router endpoints `/api/book` and `/api/feedback` with payload validation and error logging.
- **Monitoring & Analytics**: Runtime error monitoring (`src/lib/monitoring.ts`), event tracking (`src/lib/analytics.ts`), and floating patient feedback widget (`FeedbackWidget.tsx`).
- **Testing & CI Pipeline**: `jest-axe` accessibility test suite (`tests/BodySelector3D.a11y.test.tsx`), Storybook story (`src/stories/BodySelector3D.stories.tsx`), Playwright E2E suite (`tests/e2e/body-selector.spec.ts`), and GitHub Actions workflows (`ci.yml`, `release.yml`).
- **Deployment Safety**: Prisma 7 `DATABASE_URL` build-time fallback in `prisma.config.ts` for Vercel `postinstall` compliance.

[1.0.0]: https://github.com/kara-india/dramitjha/releases/tag/v1.0.0
