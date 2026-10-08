# Brasa Viamão: church website

Institutional website for Igreja Brasa Viamão (Brazil), rebuilt as an Angular standalone application.

**Live site:** https://brasaviamao.vercel.app

## Features

- Landing page with a video hero
- Sections for the church, social projects, services, ministries and contact
- Interactive gallery with cards and entrance animations
- Smooth scrolling between sections
- Single-page app deployed on Vercel

## Tech stack

- Angular (standalone components), TypeScript
- HTML and CSS
- Vercel (SPA fallback configured in `vercel.json`)

## Running locally

```bash
npm install
npm start
```

The app runs on `http://localhost:4200`.

## Production build

```bash
npm run build
```

The output goes to `dist/brasa-viamao/browser`.

## Note

The repository contains large video files in `src/assets/videos`. The site content is in Portuguese.
