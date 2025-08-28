# Vite Migration Guide

This project has been migrated from Create React App with react-app-rewired to Vite for better performance and modern tooling.

## Changes Made

### 1. Build Tool Migration
- Replaced `react-scripts` with `vite`
- Replaced `react-app-rewired` with native Vite configuration
- Updated to React 18

### 2. Configuration Files
- Added `vite.config.ts` - Main Vite configuration
- Added `vitest.config.ts` - Test configuration  
- Updated `tsconfig.json` for Vite compatibility
- Added `tsconfig.node.json` for Vite config compilation
- Updated `.eslintrc.cjs` for modern ESLint setup

### 3. Scripts Update
- `npm start` → `npm run dev`
- `npm run build` → `npm run build` (unchanged)
- `npm test` → `npm run test` (now uses Vitest)
- Added `npm run preview` for production preview

### 4. Environment Variables
Environment variables must now be prefixed with `VITE_` instead of `REACT_APP_`:
- `REACT_APP_*` → `VITE_APP_*`

### 5. HTML Template
- Moved from `public/index.html` to root `index.html`
- Removed `%PUBLIC_URL%` placeholders (Vite handles this automatically)
- Added module script tag for entry point

### 6. Dependencies
Added Vite-specific dependencies:
- `vite` - Build tool
- `@vitejs/plugin-react` - React support
- `vitest` - Testing framework
- `@vitest/coverage-v8` - Test coverage

### 7. Node.js Polyfills
The same Node.js polyfills are configured in `vite.config.ts`:
- stream → stream-browserify
- zlib → browserify-zlib
- assert → assert-browserify
- util → util
- buffer → buffer

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

5. Run tests:
   ```bash
   npm run test
   ```

## Benefits of Vite

- ⚡ Faster cold starts with native ES modules
- 🔥 Instant hot module replacement (HMR)
- 📦 Optimized production builds with Rollup
- 🛠️ Rich plugin ecosystem
- 📱 Better TypeScript support
- 🧪 Modern testing with Vitest

## Migration Notes

- Update any references to `process.env.REACT_APP_*` to `import.meta.env.VITE_APP_*`
- Static assets in `public/` are served from root path `/`
- Import paths starting with `/src` should be updated to use the `@` alias or relative paths
