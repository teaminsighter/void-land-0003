# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **monorepo containing independent landing page projects**. Each project folder (e.g., `real-estate/`, `donut/`) is a self-contained, deploy-ready website with no shared dependencies between folders.

## Technology Stack

- **Vanilla JavaScript** - No build tools, no package.json, no Node.js required
- **HTML5/CSS3** - Static files served directly
- **GSAP + ScrollTrigger** - Scroll animations (loaded via CDN)
- **Three.js** - 3D graphics (used in donut project, loaded via CDN)
- **Lenis** - Smooth scrolling library

## Development

**No build system** - Open any project's `index.html` directly in a browser.

For local development with ES modules (required for Three.js projects like `donut/`):
```bash
npx serve donut/
```

## Project Structure

Each project follows this pattern:
- `index.html` - Main page with semantic HTML
- `style.css` - Complete responsive styling with CSS custom properties
- `script.js` - All JavaScript (animations, interactions, form handling)
- `config.js` - Client-editable configuration (company info, analytics IDs, form endpoints)
- `robots.txt` / `sitemap.xml` - SEO files

## Architecture Patterns

### Config-Driven Content
Projects use `data-config` attributes in HTML that get populated from `config.js`. This allows clients to customize content without touching the main codebase:
```javascript
// config.js contains company name, contact info, analytics IDs
// script.js reads config and updates DOM elements with data-config attributes
```

### Animation Structure
GSAP ScrollTrigger animations are organized by section in `script.js`. Each section (hero, about, features, testimonials, etc.) has its own animation setup with configurable triggers and scrub values.

### Three.js Integration (donut project)
- 3D model loaded via GLTFLoader from CDN
- Interactive rotation with drag controls
- Scroll-driven model transformations using GSAP ScrollTrigger

## Deployment

Copy entire project folder to hosting service (Netlify, Vercel, GitHub Pages). No build step required. Client updates `config.js` with their information and analytics IDs.
