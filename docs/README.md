# Adminator Documentation — Retired

> **The Adminator documentation has moved to [adminator.colorlib.com/docs/](https://adminator.colorlib.com/docs/getting-started/).**

This directory still exists because GitHub Pages serves it as a redirect surface at <https://puikinsh.github.io/Adminator-admin-dashboard/>. Every page in this folder now meta-refreshes to its equivalent on the new docs site — preserving inbound links and SEO while users migrate.

## Why was it moved?

- **Single source of truth.** Two docs surfaces drift apart. One stays maintained.
- **Better SEO** on a real product domain (`adminator.colorlib.com`) instead of a GH Pages subdomain.
- **Same authoring + design system** as the marketing landing page — visually cohesive, easier to keep current.

## What lives here now

Just redirect stubs. Each page has front matter like:

```yaml
---
title: "Architecture — moved"
redirect_to: https://adminator.colorlib.com/docs/architecture/
nav_exclude: true
search_exclude: true
sitemap: false
---
```

The [`jekyll-redirect-from`](https://github.com/jekyll/jekyll-redirect-from) plugin handles the actual HTML redirect generation when Jekyll builds.

## What's NOT here anymore

The full doc content. If you want to see the source for the live docs, the Markdown files live in the [`tailwind-templates`](https://github.com/ColorlibHQ/tailwind-templates) monorepo at `templates/adminator-landing/src/content/docs/*.md` (private repo; the rendered output is at adminator.colorlib.com/docs/).

## When will GitHub Pages be turned off?

The plan is to leave the redirects running for **3–6 months** so search engines reindex to the new URLs and stale bookmarks resolve cleanly. After that, this directory will be deleted and GitHub Pages disabled at the repo level.

If you find a page on the new docs that's missing content from the old one, please [file an issue](https://github.com/puikinsh/Adminator-admin-dashboard/issues).
