# Cantonware Website

A clean, professional React-based website showcasing Cantonware's developer tools.

## Products

### CI Automation
A GitHub app designed to automate continuous integration workflows with intelligent automation and seamless GitHub integration.

### DAML MCP Server
An MCP (Model Context Protocol) server specialized for DAML code generation, providing AI-powered code assistance for smart contract development.

## Development

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Deployment

The site is automatically deployed to GitHub Pages on every push to the `main` branch via GitHub Actions.

To enable GitHub Pages:
1. Go to repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically build and deploy on pushes to `main`

The site will be available at `https://[username].github.io/[repository-name]/` (or custom domain if configured).

## Features

- Clean, professional design
- Fully responsive (mobile, tablet, desktop)
- Dark mode support
- Fast and optimized with Vite
- TypeScript for type safety
- Modern React 18

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS3 with responsive design