# David Alter — Data Analysis and Data Engineering Portfolio

An English portfolio for student Data Analyst / Data Engineering opportunities, based on David's CV and original Excel movie-investment analysis and SQL/Excel retail group project.

## Features
- Dark responsive design, accessible SVG charts with exact-value tables.
- Comedy / Drama tabs update the metrics, budget chart and actor explanation together.
- All 23 original presentation slides, source downloads and click-to-load Google Drive video.
- Retail case study: SQL cleaning/ETL, Excel analysis, recommendations, 20 original slides and source downloads.
- Homepage carousel with distinct project insights and matching case-study links.
- Project registry and reusable routes for future work.
- Privacy page; no analytics, contact form, account system or database.

## Build
Use Node 22.13+ and the pnpm version specified in package.json.

```sh
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm run build:pages
```

`docs/` is the generated static website, ready for GitHub Pages. It includes `.nojekyll` and a per-page Content Security Policy. No server, paid subscription, domain purchase or Cloudflare account is needed for this output. Development-only Cloudflare packages belong to the starter; they are not deployed.

Publication was approved on 2026-10-20. Create the public user-site repository `DavidZviAlter.github.io`, commit the source and generated `docs/`, and configure Pages to deploy from branch `main`, folder `/docs`. This exact repository name supports the root-relative URLs. Confirm HTTPS after deployment. Live publication is not yet verified. The new retail project is published in the content registry and included in the default production build.

The CV PDF is excluded from public output and source uploads pending specific disclosure authorization; the homepage download link is hidden.

Read PROJECT_GUIDE.md for content updates and source evidence, SECURITY_REVIEW.md for the security scope and remaining build dependency findings, and CONTINUE_WITH_CHATGPT.md for the continuation prompt.

[LinkedIn](https://www.linkedin.com/in/david-alter-9a361833b/) · [GitHub](https://github.com/DavidZviAlter)
