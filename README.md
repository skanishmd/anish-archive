# Sk Anish Md (Personal Archive)

## Architecture

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation)
- **Islands**: React 19 (for interactivity & WebGL)
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP (ScrollTrigger, Flip) & Lenis (Smooth Scroll)
- **3D Graphics**: React Three Fiber (Three.js)
- **Content**: Astro Content Collections (Zod validated, Markdown + KaTeX + Shiki)

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Content Management

All content is managed through standard Markdown files in `src/content/`.
Every file must include proper frontmatter conforming to the schemas in `src/content.config.ts`.

Available content collections:
- `observations`
- `projects`
- `research`
- `writing`
- `achievements`
- `creative`

## Deployment

Designed for immediate deployment to **Cloudflare Pages**.
- Build command: `pnpm build`
- Output directory: `dist/`
- Root directory: `/`

Security headers are configured via `public/_headers`.
