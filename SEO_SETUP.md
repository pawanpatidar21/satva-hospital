# SEO Setup Guide

The frontend is configured for search engine optimization. Before going live, update these:

## 1. Domain & URLs

Replace `https://Sattva-hospital-nmh.vercel.app` with your actual domain in:

- **`public/index.html`** – `canonical`, `og:url`, `twitter:url`
- **`public/robots.txt`** – `Sitemap` URL
- **`public/sitemap.xml`** – `<loc>` URL
- **`.env`** – Add `REACT_APP_SITE_URL=https://yourdomain.com` (used by `SeoHead`)

## 2. Open Graph Image

Add an image at `public/og-image.png` (1200×630 px) for social sharing. If missing, shares may not show a preview image.

## 3. Sitemap

Update `lastmod` in `public/sitemap.xml` when you make significant changes. Add more URLs if you add new public pages.

## What’s already configured

- Meta tags (title, description, keywords)
- Open Graph & Twitter Card
- JSON-LD MedicalClinic schema
- Canonical URL
- robots.txt (allows `/`, disallows `/admin/`)
- Semantic HTML (main, header, footer, section, article)
- Skip link, ARIA labels, image `alt` and `loading="lazy"`
- Admin/Login pages set to `noindex, nofollow`
