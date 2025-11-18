# React Frontend Deployment Guide

## Project Structure
This is a modern React application built with Vite, ready for Cloudflare Pages deployment.

## Prerequisites
- Node.js 18+
- npm or yarn
- Git

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
# Start backend API server (in separate terminal)
npm start

# Start frontend development server (in another terminal)
npm run dev
```

The app will be available at `http://localhost:3003` (frontend)
Backend API will be available at `http://localhost:3005` (API)

**Architecture:**
- Frontend (React/Vite): `http://localhost:3003`
- Backend (Express API): `http://localhost:3005`
- API proxy automatically routes frontend requests to backend

### 3. Build for Production
```bash
npm run build
```
Built files will be in the `dist/` directory

## Deployment to Cloudflare Pages

### Option 1: Via GitHub (Recommended)
1. Push your code to a GitHub repository
2. Connect your repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set Node.js version: `18`

### Option 2: Direct Deployment
```bash
npm run build
npm run deploy
```

### Option 3: Manual Upload
1. Run `npm run build`
2. Upload the `dist/` folder contents to Cloudflare Pages

## Environment Variables
The app automatically detects the environment:
- Development: `http://localhost:3003` → API at `http://localhost:3005`
- Production: Uses same origin for API calls

## File Structure
```
src/
├── components/         # React components
│   ├── common/        # Shared components
│   ├── user/          # User page components
│   └── admin/         # Admin page components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── utils/             # Utility functions
└── styles/            # CSS styles
```

## Key Features
- ✅ Smart tab switching based on search results
- ✅ Combined search across Top Spender and VDO Call
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript support
- ✅ Modern React hooks
- ✅ Optimized for Cloudflare deployment

## Performance Optimizations
- Code splitting for vendor libraries
- Lazy loading for admin features
- Optimized bundle size
- Image optimization
- CSS minification with Tailwind

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Development Issues
- Ensure backend server is running on port 3005
- Check API endpoints are accessible
- Verify environment variables

### Deployment Issues
- Check build logs in Cloudflare dashboard
- Verify all dependencies are installed
- Ensure Node.js version compatibility

## Migration from HTML Version
All functionality from the original HTML version has been migrated:
- Search functionality with smart tab switching
- Countdown timer
- Data masking for privacy
- Admin authentication
- Responsive design
- Thai language support

The new React version provides better performance, maintainability, and deployment options while preserving all existing features.