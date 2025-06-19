---
layout: default
title: Installation
nav_order: 1
parent: Getting Started
---

# Installation Guide
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

This guide will help you get Adminator up and running on your local machine.

## Prerequisites

Before installing Adminator, ensure you have the following installed:

### Required Software

- **Node.js** (v18.12.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **Yarn**
  - Verify npm: `npm --version`
- **Git** for version control
  - Download from [git-scm.com](https://git-scm.com/)

### System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: Minimum 4GB (8GB recommended for development)
- **Storage**: 500MB free space for dependencies

## Installation Methods

### Method 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/puikinsh/Adminator-admin-dashboard.git

# Navigate to the project directory
cd Adminator-admin-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

### Method 2: Download ZIP

1. Visit the [GitHub repository](https://github.com/puikinsh/Adminator-admin-dashboard)
2. Click **"Code"** → **"Download ZIP"**
3. Extract the downloaded file
4. Open terminal in the extracted folder
5. Run `npm install` and `npm start`

### Method 3: Use with Existing Project

```bash
# Add Adminator to your project
npm install --save adminator

# Or download specific release
wget https://github.com/puikinsh/Adminator-admin-dashboard/archive/v2.6.0.zip
```

## Verification

After installation, verify everything works:

### 1. Development Server
```bash
npm start
```

**Expected Output:**
```
> adminator@2.6.0 start
> webpack server

✓ Project is running at: http://localhost:4000/
✓ webpack compiled successfully
```

### 2. Build Process
```bash
npm run build
```

**Expected Output:**
```
> adminator@2.6.0 build
> npm run clean && cross-env webpack

✓ webpack compiled successfully in [time]ms
```

### 3. Access the Application

Open your browser and navigate to:
- **Local**: `http://localhost:4000`
- **Network**: `http://[your-ip]:4000`

You should see the Adminator dashboard with:
- ✅ Clean interface loading properly
- ✅ Dark/Light mode toggle in the header
- ✅ All components rendering correctly
- ✅ No console errors

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::4000
# Solution: Kill the process using port 4000
sudo lsof -ti:4000 | xargs kill -9

# Or use a different port
PORT=3000 npm start
```

#### Node Version Issues
```bash
# Check your Node.js version
node --version

# If version is below 18.12.0, update Node.js
# Use nvm (recommended):
nvm install 18
nvm use 18
```

#### Permission Errors
```bash
# On macOS/Linux, you might need sudo for global packages
sudo npm install -g npm@latest

# Better solution: Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Missing Dependencies
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Check for conflicting global packages
npm list -g --depth=0

# Update npm and dependencies
npm update
npm audit fix
```

### Getting Help

If you encounter issues:

1. **Check the [GitHub Issues](https://github.com/puikinsh/Adminator-admin-dashboard/issues)**
2. **Search existing solutions**
3. **Create a new issue** with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error message
   - Steps to reproduce

## Next Steps

After successful installation:

1. **[Explore Project Structure](project-structure.md)** - Understand the codebase
2. **[Development Workflow](development.md)** - Learn the development process
3. **[Customize Themes](../customization/theme-system.md)** - Set up dark mode and theming
4. **[Build for Production](build-deployment.md)** - Deploy your application

---

**Installation Complete!** 🎉 You're ready to start building with Adminator. 