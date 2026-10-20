# Security and privacy review — 2026-09-19

## Scope and result
Code review, dependency advisories, build checks and browser checks for David Alter's portfolio. This is not a penetration test, legal review, OWASP ASVS certification or guarantee of no vulnerabilities. No public deployment exists yet, so production HTTPS, actual response headers and live-host behavior remain to be checked after publication approval.

## Architecture and controls
- The publication package contains HTML, CSS, JavaScript, slides and the intentionally supplied downloadable documents. No Node server, database, login, file-upload endpoint, payment flow or contact form is deployed.
- The site sets no first-party analytics, cookies or local-storage identifiers. GitHub may log IP addresses for security; the privacy page discloses hosting and third-party processing.
- Google Drive is contacted only after the visitor clicks Play or follows the external video link. The iframe has a restricted sandbox (`allow-scripts allow-same-origin allow-presentation`), fullscreen/picture-in-picture permissions and no-referrer. Public-by-link access to this exact video was verified through Drive metadata. The embedded player loaded and started playback in the browser; play/pause and the seek control responded. This was not a separate signed-out/incognito test.
- Each generated HTML page gets a Content Security Policy: same-origin scripts plus hashes for framework inline scripts; no inline event attributes, object embeds, base URL changes or form submission; frames restricted to drive.google.com. Styles allow inline declarations required by the charts and UI. This is defense in depth, not an XSS guarantee.
- External links use noopener/noreferrer where a new tab is opened. Referrer metadata is no-referrer. Source maps are omitted from the publication package.
- No browser-accessible API keys or application secrets are required. Original public downloads still contain the personal/professional information David chose to present; the owner must review the supplied documents as part of the already-requested final publication approval.

## Dependency audit
The full lockfile audit reports 2 high-severity advisories, both in **image-size 2.0.2**, a development dependency reached through `vinext`:

- GHSA-w3rx-r6r6-pgpr: an ICNS parser infinite loop / denial of service.
- GHSA-5p2g-fcmc-qvqq: JXL and HEIF parser infinite loops / denial of service.

Both are fixed in image-size >=2.0.3. That release was published on 2026-09-14 and is not eligible under the project's existing seven-day minimum-release-age rule as of this review. The rule was preserved. Apply the patched override when eligible, rerun the full audit and rebuild. Until then, builds should use the verified supplied assets rather than process unknown ICNS/JXL/HEIF uploads. This is a developer-build risk; image-size and the Node build pipeline are not shipped in `docs/`, and this static site accepts no uploads.

The production-dependency audit reports **0 known advisories**. Available eligible fixes were applied to React, React DOM, react-server-dom-webpack, Vite, Babel, browserslist, baseline-browser-mapping, esbuild, ws, undici, js-yaml, brace-expansion and fflate. Lockfile and release-age controls are retained. Advisory absence is not proof of vulnerability absence.

## Free hosting and platform limits
The planned host is GitHub Pages using a public repository on GitHub Free and GitHub's github.io address. No paid domain, paid hosting, server subscription or paid video service is required. The generated package is within the documented 1 GB site limit; GitHub also documents a soft 100 GB/month bandwidth limit. Provider terms and future pricing can change.

GitHub supplies HTTPS for github.io sites. Confirm the final URL uses HTTPS and enforce HTTPS in Pages settings after deployment. GitHub Pages does not provide arbitrary response-header configuration through a static repository: meta CSP cannot enforce frame-ancestors or replace headers such as X-Frame-Options or Permissions-Policy. Those protections are not claimed here. No claim of complete GDPR, Israeli privacy-law or formal accessibility compliance has been made.

## Validation performed
- Successful static prerender and TypeScript checking.
- Browser review of the charts, strategy-dependent actor content and presentation slide advancement in the static production build, served with a test asset prefix. The standalone review also passed its interaction checks.
- Generated HTML contains the chart marks directly, so the charts are not empty while JavaScript initializes.
- CSP hashes and asset references checked against the generated package.
- Video public-link permission verified; embedded playback, pause and a seek-control interaction worked in the review browser.

## References
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://github.com/advisories/GHSA-w3rx-r6r6-pgpr
- https://github.com/advisories/GHSA-5p2g-fcmc-qvqq
- https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
- https://policies.google.com/privacy

## 2026-10-20 continuation
The retail draft adds local aggregate charts, a category selector and original static course files. It adds no dependencies, external service calls, database execution, user accounts or visitor uploads. The SQL example is text only. The standalone review CSP hash and embedded asset references were verified. No new dependency audit, penetration test or public-host verification was performed in this continuation; the audit findings above are dated results.
