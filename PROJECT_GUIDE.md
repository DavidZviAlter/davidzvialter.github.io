# David Alter portfolio

## Project identity and status
- Owner: David Alter. GitHub account: DavidZviAlter, updated by David on 2026-10-20.
- GitHub profile: https://github.com/DavidZviAlter
- LinkedIn: https://www.linkedin.com/in/david-alter-9a361833b/
- Purpose: obtain student Data Analyst or BI Engineer roles.
- English, restrained dark design, mint accent, violet for Drama.
- Current continuation: 2026-10-20. The last saved September 20 review was restored from Library. The former GitHub repository returns 404 through the connector; no current hosted source or deployment was verified. Do not claim the site is live. User requires review before publishing this new project.
- Persistent checkpoint: David-Alter-Portfolio-Source.zip. Search that exact filename when resuming if the checkout is unavailable.
- Local preview uses the Sites managed-linux starter. Use sites-building for any continuation; refresh execution profile before commands.

## Source map
- app/page.tsx: homepage.
- app/globals.css: complete responsive theme.
- content/projects.ts: project registry. Published entries appear automatically; drafts stay hidden.
- app/projects/[slug]/page.tsx: detailed movie case study and generic future-project template.
- content/movie-data.json: extracted numeric summaries; original values retain full precision.
- components/movie-charts.tsx: responsive SVG plots, accessible exact-value tables, strategy tabs and the actor decision section. All six genre points and both budget panels are present in the initial HTML.
- components/project-media.tsx: original 23-slide presentation viewer and click-to-load Google Drive video player, with an optional native MP4 fallback.
- content/media.json: videoEmbedSrc identifies the verified Google Drive recording; videoUrl is the connector-returned original URL. videoSrc supports a future hosted MP4 instead.
- public/slides: rendered original slide images, not rewritten slides.
- public/files: original CV PDF, Excel workbook, and PowerPoint.

## Adding a project through ChatGPT
Read this file and current site code before edits. Add a content/projects.ts entry with a unique slug, title, category, year, summary, tools, status, body sections and links. Set draft while preparing and published only when its content is approved. The generic route renders body sections and download links; create a specialized component only for genuinely new presentation needs. Future cards use generic previews, not movie-specific statistics. Preserve prior projects.

## Source evidence
The chosen workbook is Excel Final Project.xlsx (21 sheets, 3,725 source rows), not its 3-sheet early copy. Main source data is Sheet1 (2). Saved genre averages match 2005–2015 rows across available countries/languages, not USA+English only. Comedy: mean ROI 76.59069408749131%, sample SD 234.15673622583748 pp, 459 rows. Drama: 126.69980826164509%, SD 742.8759383145392 pp, 346 rows. These were independently reproduced from source rows.
Budget summaries come from comedy budget class and drama budget class. ROI=(Gross Revenue-Budget)/Budget*100; risk=sample standard deviation. All displayed ratios are computed from these figures. Do not describe this proxy as net investor profit or the ratio as Sharpe.
Presentation detailed slides 8–12 and 15–19 are the basis of the proposed profiles. Final summary slide has swapped labels. Keep the original deck unchanged. Comedy: Steve Carell, Seth Gordon, medium budget, 111–140 minutes, PG, March/October. Drama: Ryan Gosling, Alex Kendrick, medium budget, under 90 minutes, PG-13, May/August. Each factor analyzed separately; never claim a combined predictive model.
The actor field may not mean starring actor; comparisons involve tiny samples. Describe the highlighted actor rather than guarantee star-power effects.

## Video integration and access
The user supplied the exact Google Drive recording and said it does not need content review; it only needs a player. Metadata verified video/mp4, 496,244,383 bytes. Exact Drive ID: 1Z4xiTkKxc28MgvfqtZTwG4dOG2NbIrb8. Original URL returned by connector: https://drive.google.com/file/d/1Z4xiTkKxc28MgvfqtZTwG4dOG2NbIrb8/view?usp=drivesdk
The connector cannot download files larger than 268,435,456 bytes (HTTP 413). Earlier attachment materializations also failed. Do not download it again through that path. The website embeds Drive's video preview on Play and offers the verified original in a new tab; no local video copy is needed. User explicitly authorized including the recording but requires approval before publication.
On 2026-09-19, Drive metadata verified permission type=anyone, role=reader, allowFileDiscovery=false. David changed this permission himself and explicitly confirmed it. Do not ask again or change any permissions. The player loads only after a click, with a no-referrer policy, a restricted iframe sandbox and a Google privacy disclosure. Public sharing is verified. The embedded player loaded and started playback in the review browser; play/pause and the seek control responded. This was not a separate signed-out/incognito session. No video transcription is needed.

## Standalone review artifact
David-Alter-Portfolio-Review.html is a self-contained local design review, with embedded slide images and downloadable source files. Open it in a browser after downloading. Page navigation, strategy tabs, slide browsing and enlargement work without a build; video requires internet and Drive access. Its charts are responsive SVGs with visible data marks, focus/hover readouts and exact-value tables. Both strategy panels and their matching actor explanations are included. Mobile budget charts use readable labelled CSS bars on the same scale as desktop. This artifact is not the production deployment.

## Static publication and cost
The site is unpublished. The user requested a final review and approval before creating the public repository or publishing the website. Video viewing permission is already public and does not need further approval or changes.

`pnpm run build:pages` builds and prerenders the site, then generates `docs/`. Publish the `docs/` directory from the `main` branch of the public user-site repository `DavidZviAlter.github.io` only after the user approves. The source uses root-relative URLs, so do not silently deploy it to a project-repository subpath. Home, privacy, project and 404 HTML are exported; extensionless routes also receive directory aliases. Internal links are normal page links, requiring no server route handler. External CSS/JS and the supplied downloads are local static assets.

GitHub Pages is available for public repositories on GitHub Free. A github.io address requires no purchased domain or hosting subscription. As checked on 2026-09-19, the documented site limit is 1 GB and the soft bandwidth limit is 100 GB/month; the generated site is about 18 MB. The video stays on Google Drive. The user already has the GitHub account. Do not promise perpetual pricing or unlimited traffic. No payment or paid service has been enabled.

References: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages and https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Changes in the current review
- Title: Movie investment strategies.
- Objective-based intro: Using movie data to recommend two investment strategies for different risk profiles — a conservative approach and an aggressive approach.
- Genre and budget graphs render in the initial HTML, including in the standalone review.
- Comedy highlights Steve Carell; Drama highlights Ryan Gosling (229.96% average ROI, 53.94 pp sample SD, ratio 4.26; three films).
- Incident analysis → prioritization → action → follow-up uses the same color as body paragraphs.
- Click-to-load video, privacy page, CSP with script hashes and no-referrer policy added.

## Security and validation
Read SECURITY_REVIEW.md before interpreting audit results. Do not describe the site as impossible to hack or certified to a security/privacy standard. Runtime dependency audit: zero known findings. Two high findings remain in image-size 2.0.2, a build-only dependency of vinext; it is not part of the deployed static site. The patched release is temporarily blocked by the existing seven-day release-age policy. Keep that protection and apply the patch when eligible.

The production build and TypeScript check passed. The review's genre points, four budget groups per strategy and actor switch were checked in a browser. Regenerate both `docs/` and the standalone review after content or dependency changes. The source archive excludes generated build output and dependencies; the separate GitHub Pages archive contains the generated site.

To regenerate the standalone review after a build: install Python lxml if needed and run `python3 scripts/export-review.py /absolute/output/folder`. This embeds the original slides and downloads and uses hash navigation; it is a review artifact, not the deployed site.

## Presentation fidelity repair
The website slide images now come from a LibreOffice PDF render at about 1920×1080, including hidden slides 13 and 20. The earlier artifact-tool render lost the map, some icons, labels and connector lines. For the two chartEx objects on slide 4, the rendering copy uses the original PowerPoint cached fallback images already inside the PPTX. The public PPTX itself is byte-for-byte unchanged. Do not replace it with the temporary rendering copy.

`scripts/render-original-slides.py` reproduces this conversion with LibreOffice, PyMuPDF, Pillow and lxml. All 23 images were visually reviewed as a contact sheet, with detailed inspection of the map and final flowchart. The fallback map image has the resolution saved by PowerPoint itself. The browser slideshow and enlargement use complete slide images without cropping. Preserve these corrected images unless regenerating through this pipeline or receiving a native PowerPoint PDF/image export from David.

The project intro now says "Using movie data...". The genre plot labels every point directly on desktop and mobile, with Biography, Adventure, Action and Crime in gray. No legend is displayed.

Latest browser checks: all 23 slides were advanced through in the standalone review and each image decoded successfully at 1921×1080. Slides 9 and 22 were visually checked in the enlarged dialog. Both genre plots were inspected at desktop and 375px mobile widths: all six names are visible without a legend. Static build and TypeScript checks passed.

## Current corrections: homepage chart and missing slides
- Heading is "Higher return, At what risk?".
- Remove the word "historical" from all authored page/chart copy; the uploaded source documents stay original.
- Both homepage and case-study plots label all six genres directly, including mobile. No chart legend. Axis titles sit above the top of the y-axis and below the right end of the x-axis.
- Slide 9 and 22 WebP assets were found empty and restored from the complete PNG renders. All 23 images must be nonempty and decodable before packaging. Renderer now encodes and verifies in memory before atomically replacing each image. Both export pipelines fail on empty/malformed slide assets.
- Supersedes the earlier notes about compact plots or mobile relying on a legend. Do not hide any genre name on either layout.

## Copy update — 2026-09-20
- First approach step now names average ROI, ROI standard deviation and ROI over risk as KPIs, and describes an Excel ETL workflow for combining, cleaning, standardizing and grouping data. This does not claim a production data pipeline.
- Business question and conservative-strategy copy now explain the return–risk trade-off and comparisons within comedy more clearly. Numeric results and source files are unchanged.
- Communications Officer description and process line now cover precision, teamwork, operational execution and learning from debriefs.
- F-35 role now includes international collaboration and server setup; these additions were explicitly supplied by David and complement the CV’s infrastructure responsibilities.
- All three experience process lines retain the existing body-text color.
- Validation: production export completed; revised copy was checked in the standalone review on desktop and at 375px mobile width.

## Retail group project — 2026-10-20
- Slug: retail-shopping. Title: Customer shopping & promotions. It is a draft; build a local review with PORTFOLIO_PREVIEW_DRAFTS=1. getVisibleProjects() includes drafts only under that flag. After review approval, change its status to published and build without the flag. The flag is a review control, not authentication.
- Preserve the navy/mint design, all prior movie content, labels and video behavior. New code: components/retail-case-study.tsx, retail-charts.tsx and presentation-viewer.tsx. Homepage adds a second project card.
- Group attribution: David Zvi Samuel Alter, Shilat Ben Shimol Biton, Hagit Turjeman. David has not specified which tasks he personally owned; never invent individual contributions or claim sole authorship.
- Supplied sources: Retail-Shopping-Database.sql, Retail-Shopping-Analysis.xlsx (7 sheets) and Retail-Shopping-Presentation.pptx (20 slides), unchanged copies under public/files. Rendered slides are public/slides/retail-shopping/slide-1.webp through slide-20.webp.
- The MySQL attachment contains a database dump with two tables and INSERT records, not original analysis queries. The displayed JOIN is a reconstructed read-only example, clearly labelled. No database server, credentials, or visitor SQL execution are required.
- Both SQL tables contain 3,900 rows. A one-to-one Customer ID join reproduces all 19 raw workbook fields with zero differences. The workbook adds Age Group as its 20th field. The data is synthetic.
- content/retail-data.json is reproducible with python3 scripts/extract-retail-data.py. It stores aggregates, not customer rows. Metrics: purchase amount total $233,081; 25 product types; Clothing+Accessories share 76.567%; promotion exposure 1,677/3,900=43%; promo and discount fields match in every row; average amount exposed $59.2791 vs non-exposed $60.1305 (-1.416%); product rating/count correlation -0.149935. Use records/purchases, not units, because quantities are unavailable.
- Interactive promotion selector compares All categories, Clothing, Accessories, Footwear, Outerwear. Shared bar scale is $0–$70. Footwear difference is positive (about +4.6%); never describe an observational difference as causal lift or a completed A/B test.
- Source discrepancies: slide 7 incorrectly calls Footwear highest on purchase count per product (source: Outerwear 162). Slide 8 mislabels the lowest revenue/product as Accessories (source: Footwear $9,023.25). Slide 16 figures differ from source subscription exposure (source: subscribers 1053/1053, non-subscribers 624/2847). The Discount Impact sheet has formula errors in its summaries. The originals stay unchanged; the website uses raw-source recomputations and explains the differences in expandable methodology details.
- scripts/export-review.py now exports every built project route, uses separate slide-player states and hash routes for each project, and retains the movie strategy and actor switch. It verifies images before embedding. Retail review hash is #project/retail-shopping.
- Passing checks this turn: TypeScript and a static preview build with five prerendered routes, followed by standalone-export JavaScript syntax validation. All 20 new slides were rendered and reviewed as a contact sheet. No browser-control skill is currently available, so no live desktop/mobile interaction check is claimed.
- Publication is not part of this saved review. The earlier automatic approval block for public disclosure of the CV PDF is unresolved; private review/source copies retain it, and a future public upload must omit it unless David explicitly authorizes disclosure of the file itself. Do not bypass that block.

- Final static verification: default production build excludes the draft retail route; explicit review build includes it. The standalone review contains 49 byte-matching embedded assets and 43 valid slide images across both decks. All local downloads, unique IDs, category panels and the inline-script CSP hash passed checks.

## Review corrections — 2026-10-20
- GitHub profile link is now https://github.com/DavidZviAlter, as explicitly supplied by David. Update future user-site planning to DavidZviAlter.github.io; no repository creation or public hosting change has been performed.
- The retail introduction and first workflow step explicitly include SQL data cleaning and ETL. This clarification was supplied by David; the uploaded SQL remains an unchanged dump, and no original cleaning-query script was provided.
- The r=-0.15 finding moved from the product-preferences section to its own closed methodology details panel. Do not restore it as a prominent early callout.
- components/featured-projects.tsx replaces the single homepage hero plot. It receives getVisibleProjects(), so it previews the same projects as Selected Work. Both arrow buttons and keyboard Left/Right cycle in either direction, including wraparound. Every panel contains its own matching project link. Movie retains its six-genre plot; retail shows the purchase-value comparison and 43% exposure. Future projects receive a summary fallback. No autoplay.
- Drafts remain review-only. The standalone exporter includes equivalent arrow/keyboard handlers, preserving each panel’s static route link. The native and review implementations both begin with the movie project.
- Validation: TypeScript, the preview static build, exported JavaScript syntax, initial panel visibility, both project links, GitHub links, unique IDs and the script CSP hash passed. Browser interaction/visual QA remains unavailable in this environment.

## Homepage retail preview — product preferences
David requested replacing the promotion-based preview with findings from the product-preferences recommendations slide. Both the carousel and Selected Work card now ask “Which products deserve priority?” and share RetailPreferenceHighlight in retail-charts.tsx. The compact chart shows Jewelry 642.3, Pants 635.9, Blouse 629.9 and Jeans 452.4 on a shared 0–700 popularity-index scale, followed by “Keep the leaders stocked. Investigate Jeans.” The detailed promotions analysis and source files remain unchanged.

## Distinct homepage insights
David clarified that the top carousel and lower Selected Work card must not repeat the same retail finding. The carousel now uses RetailRevenueHighlight: category revenue shares, 76.6% combined revenue from Clothing and Accessories and 19/25 product types. Heading: “Revenue share reflects category size.” Kicker: “AN INSIGHT WE FOUND”. The lower card retains the product popularity leaders and Jeans recommendation. Preserve this distinction on future edits.

## Final homepage placement — supersedes the prior placement
David requested swapping the two retail insights to make the first impression more actionable. The top carousel now shows the product popularity leaders and Jeans (“Which products deserve priority?”). The lower Selected Work card now shows category revenue concentration (“Revenue share reflects category size.”). The findings remain distinct; do not put the same content in both.

The top product-preview label now says “Underperformers” and its recommendation says “Investigate underperformers”, as David requested. The gray bar remains the lowest-ranked individual product (452.4), not a group average; a short caption states that scope. The detailed project analysis keeps the original product names.


## Approved release — 2026-10-20
David approved moving the current version to publication. The retail-shopping project is now published in the registry and included in the default build without PORTFOLIO_PREVIEW_DRAFTS. The availability line is exactly “Seeking student roles in Data Analysis & Data Engineering”. All approved carousel placements and Underperformers wording remain. Both slide collections (23 + 20) are validated by the Pages packaging script.
The earlier automatic rejection of public CV disclosure remains unresolved. The public Download CV link is hidden, docs omits the CV PDF, and public source archives/uploads must exclude it. Keep any private original separate. Do not bypass the rejection.
Target: free GitHub Pages user-site repository DavidZviAlter/DavidZviAlter.github.io, main /docs. No live deployment has yet been verified. GitHub repository creation currently reaches a sign-in wall in the cloud browser; continue through secure browserAuth.
