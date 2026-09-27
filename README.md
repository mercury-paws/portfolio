# mercury_paws — plain static website

This version uses HTML, CSS, browser JavaScript, JSON, and local fonts. There is no generator, package installation, build command, backend, or scheduled deployment.

**Images are deliberately not included in this ZIP.** They link to the original files in your `mercury-paws/portfolio` GitHub repository. Keep the existing `images/` folder in that repository. CV and branding PDFs also link to their existing GitHub Pages locations.

## Use this version

1. Unzip the archive.
2. Copy the contents of `portfolio-static/` into your repository root. Keep the repository's existing `images/` folder and `.git` history.
3. Remove the `scripts/`, `content/`, and `_site/` folders from the earlier generated version. Replace its `css/` and `js/` files with these files.
4. Replace the old Pages workflow with `.github/workflows/pages.yml` from this ZIP. Do not keep another old deployment workflow that contains a `schedule` trigger.
5. In GitHub, select **Settings → Pages → Source → GitHub Actions**, if using the included workflow.

The included workflow only uploads and publishes the existing files. It runs on a push to `main` or when you choose **Run workflow**. There is no `schedule`, `cron`, build job, or monthly run. Nothing has been deployed on your behalf.

You may instead use Pages' “Deploy from a branch” option with the repository root. In that case, remove the included workflow and let Pages publish the static files directly. The `.nojekyll` file is included.

## Editing

| Change | Edit |
| --- | --- |
| English home page and grouped skills | `index.html` |
| Other home languages | `indexcz.html`, `indexru.html`, `indexuk.html` |
| About and other page writing | The corresponding HTML file in `pages/`, `pagescz/`, `pagesru/`, or `pagesuk/` |
| Blog entries | `data/blogs.json` |
| Public reviews | `data/reviews.json` |
| Project summaries, status, and experience details | `data/projects.json` |
| Project labels in each language | `data/project-labels.json` |
| Layout, colors, text sizes | `css/site.css` |
| Navigation, contact drafting | `js/site.js` |
| Direct JSON loading and rendering | `js/content.js` |

Edit the files and push. JSON changes appear directly in the browser; there is nothing to regenerate. Shared navigation/footer HTML is intentionally present in each page, so it works without a JavaScript content injection step. Update those elements across the relevant pages if changing a shared link.

The existing HTML includes saved content for immediate display and no-JavaScript access. When hosted, browser JavaScript refreshes blogs, reviews, and project details from JSON. If a JSON request fails, the saved HTML stays readable. If you want the saved/no-JavaScript copy to reflect a new edit too, update that page's HTML manually; no build tool is required.

### Blog entries

Keep existing `_id` values stable. Each entry has `_id`, `title`, `header`, `text`, `date`, and `order`. IDs may contain letters, digits, underscores, and hyphens. New entries automatically appear in the blog list and open at `pages/blogArticle.html?id=YOUR_ID` (or the corresponding language folder). You do not need to create a new HTML file.

Article text accepts basic paragraph, heading, emphasis, list, quote, and link markup. Rendering discards executable elements and unsafe link protocols. Titles and summaries are rendered as plain text. Removing an entry from JSON makes its existing article route show an “Article not found” page when JavaScript is enabled.

### Reviews

Add only approved public reviews, with `name`, `comment`, and optionally `lang`. Never put private email addresses or inquiries in public JSON.

### Projects

See `docs/PROJECT-DETAILS.md`. Status and published summaries are supplied; fields that require your personal experience are deliberately empty. Filling them in makes those sections appear on the project's detail page.

## Preview

You can open `index.html` directly to inspect the saved pages. Internet access is required for the linked images and PDFs. For direct JSON loading, use a normal HTTP preview, such as an editor's Live Server feature, or GitHub Pages. Browsers commonly block JSON fetching from `file://` URLs, so local-file viewing deliberately uses the saved HTML.

## Contact

The contact form prepares an email draft and provides an **Open email app** link and **Copy message** button. The visitor sends the email through their own mail service. It never calls Render or claims that an email has been sent. Direct contact links work without JavaScript.

## What changed in this revision

- Removed all generation scripts and their source-template folders.
- Deployment is a plain file upload on push/manual dispatch only.
- Removed decorative stars and arched portrait frames.
- Added a visible résumé/CV button beside the home-page action in all four languages.
- Grouped skills by languages, frameworks/libraries, styling, tools, and practices. Project stacks are grouped too. Node.js is identified as a runtime in the main skills list.
- Meaningful text sizes are at least 14 px at the default 16 px browser base size.
- Project screenshots use `contain`; photos retain appropriate photo-specific treatment. No slider is used.
- Transitions are limited to links, buttons, navigation, and interactive project imagery. Reduced-motion preferences are respected.
- Added factual project summaries, status labels, and detail pages for the portfolio template, CRM template, and planned astrology website.
- Retained the original long-form project paragraphs and both About sections.

Read `docs/TEST-REPORT.md` for the checks performed and their limits. Read `docs/MEDIA.md` for how GitHub image links work.
