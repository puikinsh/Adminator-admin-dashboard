# Build & Deployment

This guide covers building Adminator for production and deploying it to various hosting platforms.

## Table of Contents

- Production Build
- Build Commands
- Build Output
- Build Optimization
- Deployment Options
- Static Hosting Platforms
- Server Deployment
- Environment Configuration
- Pre-Deployment Checklist
- Post-Deployment Verification
- Troubleshooting
- Next Steps

## Production Build

Before deploying, you need to create an optimized production build.

### Quick Build

```bash
npm run build
```

This creates an optimized, minified production build in the `dist/` directory.

## Build Commands

### Standard Production Build

```bash
npm run build
```

**Features:**
- Minified JavaScript and CSS
- Optimized assets
- Source maps disabled
- Production environment variables
- Compressed bundle sizes

### Minified Build

```bash
npm run release:minified
```

**Use case:** Maximum optimization for production deployment

**Features:**
- Aggressive minification
- Tree shaking
- Dead code elimination
- Smallest possible bundle size

### Unminified Build

```bash
npm run release:unminified
```

**Use case:** Debugging production issues

**Features:**
- Readable code
- No minification
- Easier to debug
- Larger file sizes

### Clean Build

```bash
# Clean and rebuild
npm run clean
npm run build
```

Removes the `dist/` directory before building to ensure a fresh build.

## Build Output

After running the build command, the `dist/` directory contains:

```
dist/
├── index.html              # Main dashboard page
├── 404.html                # Error pages
├── 500.html
├── signin.html             # Authentication pages
├── signup.html
├── email.html              # Application pages
├── compose.html
├── chat.html
├── calendar.html
├── charts.html
├── forms.html
├── buttons.html
├── ui.html
├── basic-table.html
├── datatable.html
├── google-maps.html
├── vector-maps.html
├── blank.html
└── assets/
    ├── bundle.[hash].js    # Compiled JavaScript
    ├── styles.[hash].css   # Compiled CSS
    └── static/             # Images, fonts, etc.
        ├── fonts/
        └── images/
```

### File Hashing

Production builds include content hashes in filenames (e.g., `bundle.a1b2c3d4.js`) for:
- Cache busting
- Long-term caching
- Version control

## Build Optimization

### Automatic Optimizations

The build process automatically applies:

1. **JavaScript Optimization**
   - Minification with Terser
   - Tree shaking (removes unused code)
   - Code splitting
   - ES6+ transpilation to ES5

2. **CSS Optimization**
   - Minification with CSS Minimizer
   - Autoprefixer for browser compatibility
   - Unused CSS removal
   - Critical CSS inlining (optional)

3. **Asset Optimization**
   - Image compression
   - Font subsetting
   - SVG optimization
   - Asset hashing

4. **Bundle Optimization**
   - Gzip compression ready
   - Brotli compression ready
   - Chunk splitting
   - Lazy loading support

### Bundle Size Analysis

To analyze your bundle size:

```bash
# Install webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to webpack config and rebuild
npm run build
```

## Deployment Options

Adminator can be deployed to various platforms:

### 1. Static Hosting (Recommended)
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

### 2. Traditional Hosting
- Apache
- Nginx
- IIS
- Any web server

### 3. Cloud Platforms
- AWS (S3, EC2, Amplify)
- Google Cloud Platform
- Microsoft Azure
- DigitalOcean

## Static Hosting Platforms

### Netlify

**1. Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

**2. Build your project:**
```bash
npm run build
```

**3. Deploy:**
```bash
netlify deploy --prod --dir=dist
```

**Or use Netlify's drag-and-drop:**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `dist/` folder to deploy
3. Done!

**netlify.toml configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy:**
```bash
vercel --prod
```

**vercel.json configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### GitHub Pages

**1. Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

**2. Add deploy script to package.json:**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**3. Deploy:**
```bash
npm run deploy
```

**4. Configure GitHub Pages:**
- Go to repository Settings → Pages
- Select `gh-pages` branch
- Save

### Cloudflare Pages

**1. Connect your repository:**
- Go to [pages.cloudflare.com](https://pages.cloudflare.com)
- Connect your GitHub/GitLab repository

**2. Configure build settings:**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

**3. Deploy:**
- Push to your repository
- Cloudflare automatically builds and deploys

### AWS S3 + CloudFront

**1. Build your project:**
```bash
npm run build
```

**2. Install AWS CLI:**
```bash
# Follow AWS CLI installation guide
aws configure
```

**3. Create S3 bucket and upload:**
```bash
# Create bucket
aws s3 mb s3://your-bucket-name

# Upload files
aws s3 sync dist/ s3://your-bucket-name --delete

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html
```

**4. Set up CloudFront (optional but recommended):**
- Create CloudFront distribution
- Point to S3 bucket
- Configure caching rules
- Add custom domain (optional)

## Server Deployment

### Apache

**1. Build your project:**
```bash
npm run build
```

**2. Copy files to web root:**
```bash
cp -r dist/* /var/www/html/
```

**3. Configure .htaccess:**
```apache
# .htaccess in dist/
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Nginx

**1. Build your project:**
```bash
npm run build
```

**2. Copy files to web root:**
```bash
cp -r dist/* /usr/share/nginx/html/
```

**3. Configure nginx.conf:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;

    # Browser caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**4. Restart Nginx:**
```bash
sudo systemctl restart nginx
```

## Environment Configuration

### Environment Variables

Create environment-specific configurations:

**Development (.env.development):**
```env
NODE_ENV=development
API_URL=http://localhost:3000
DEBUG=true
```

**Production (.env.production):**
```env
NODE_ENV=production
API_URL=https://api.yourdomain.com
DEBUG=false
```

### Using Environment Variables

In your JavaScript:
```javascript
const apiUrl = process.env.API_URL || 'http://localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';
```

## Pre-Deployment Checklist

Before deploying to production, verify:

### Code Quality
- [ ] All linting errors fixed (`npm run lint`)
- [ ] No console.log statements in production code
- [ ] All TODO/FIXME comments addressed
- [ ] Code reviewed and tested

### Build
- [ ] Production build succeeds (`npm run build`)
- [ ] No build warnings or errors
- [ ] Bundle sizes are acceptable
- [ ] All assets are included

### Testing
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Forms submit correctly
- [ ] Charts and visualizations display
- [ ] Dark mode toggle works
- [ ] Responsive design tested on mobile

### Performance
- [ ] Images optimized
- [ ] Lazy loading implemented where needed
- [ ] Bundle size optimized
- [ ] Caching configured

### Security
- [ ] No sensitive data in code
- [ ] API keys in environment variables
- [ ] HTTPS configured
- [ ] Security headers set
- [ ] CORS configured properly

### SEO (if applicable)
- [ ] Meta tags added
- [ ] Page titles set
- [ ] Alt text for images
- [ ] Sitemap generated
- [ ] robots.txt configured

### Browser Compatibility
- [ ] Tested in Chrome/Edge
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile devices

## Post-Deployment Verification

After deployment, verify:

1. **Site Accessibility**
   - Visit your deployed URL
   - Check all pages load
   - Test navigation

2. **Functionality**
   - Test interactive features
   - Verify forms work
   - Check API connections

3. **Performance**
   - Run Lighthouse audit
   - Check page load times
   - Verify asset loading

4. **Mobile Responsiveness**
   - Test on actual devices
   - Check responsive breakpoints
   - Verify touch interactions

5. **Console Errors**
   - Open browser DevTools
   - Check for JavaScript errors
   - Verify no 404s for assets

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Assets Not Loading

- Check file paths are relative
- Verify assets are in `dist/` folder
- Check server configuration
- Verify CORS settings

### Blank Page After Deployment

- Check browser console for errors
- Verify all files uploaded
- Check base URL configuration
- Verify server routing for SPA

### Styles Not Applied

- Check CSS file is loaded
- Verify CSS file path
- Check for CSS conflicts
- Clear browser cache

### 404 Errors

- Configure server for SPA routing
- Add `.htaccess` or nginx config
- Verify all HTML files uploaded

## Performance Optimization

### Enable Compression

Most hosting platforms enable Gzip/Brotli automatically. Verify:

```bash
# Check if Gzip is enabled
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

### CDN Configuration

Use a CDN for faster global delivery:
- Cloudflare
- AWS CloudFront
- Fastly
- KeyCDN

### Caching Strategy

Set appropriate cache headers:
- HTML: No cache or short cache
- CSS/JS: Long cache (1 year) with hashing
- Images: Long cache (1 year)
- Fonts: Long cache (1 year)

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=dist
```

## Next Steps

Congratulations on deploying Adminator! 🎉

Continue learning:

1. **[Theme System](../customization/theme-system.md)** - Customize colors and themes
2. **[API Reference](../api/theme-api.md)** - JavaScript API documentation
3. **[Examples](../examples/theme-integration.md)** - Integration examples

---

**Need Help?** Check the [main README](../../README.md) or [open an issue](https://github.com/puikinsh/Adminator-admin-dashboard/issues).
