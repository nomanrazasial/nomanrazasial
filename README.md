# Noman Raza Sial — Research Portfolio

An animated, responsive portfolio built from the supplied LinkedIn CV and portrait, with a complete list of connected public publication records, research projects, academic experience, research metrics, SAF news and EU policy source monitoring.

## Open the website

Extract this folder and open **dist/index.html** in a browser. The bundled snapshot works even without a local server. All public website files are inside `dist/`; there is no npm installation or build step.

The website includes:

- Your portrait, edited research introduction, CV download and verified profile links.
- An animated topic ribbon, floating research annotation, orbit accents, scroll reveals, hover motion and a reading-progress bar.
- Mobile navigation, keyboard focus states, a motion pause control and reduced-motion support.
- Publications searchable by title, author, DOI and journal, a year filter, and BibTeX export of the filtered results.
- Seven project summaries drawn from the supplied CV and a chronological experience section.
- Research metrics with explicit provider names and retrieval dates.
- Filterable SAF / EU policy updates, additional source documents, source links and per-source update status.
- A LinkedIn post integration with an honest disconnected state until authorized access is configured.

## Your connected identities

| Profile | Address |
| --- | --- |
| ORCID | https://orcid.org/0000-0002-8384-2646 |
| Google Scholar | https://scholar.google.com/citations?user=5YPiUm0AAAAJ&hl=en |
| OpenAlex | https://openalex.org/A5030531079 |
| LinkedIn | https://www.linkedin.com/in/nomanrazasial/ |

The ORCID record links to the same LinkedIn profile as your CV. OpenAlex was resolved by that exact ORCID identifier. Google Scholar was found under your full name. Check these identifiers before making the site public.

## What is working, and what still needs access

| Feature | Included status |
| --- | --- |
| ORCID publications | Successfully retrieved all 9 public work groups |
| OpenAlex publications & metrics | Successfully retrieved 11 work records; combined with ORCID into 10 unique entries after matching duplicate titles/DOIs |
| Citation totals | OpenAlex snapshot: 174 citations, h-index 6, i10-index 6; these are **not Google Scholar figures** |
| Google Scholar link | Connected to the identified public profile |
| Google Scholar metrics / publications | Adapter implemented; requires your SerpApi key; not live-tested with credentials |
| LinkedIn profile / activity links | Working direct links |
| Automatic LinkedIn posts | Official API adapter implemented; requires approved member read access and an OAuth token; not live-tested with credentials |
| SAF source collection | Successfully checked 8 of 9 configured sources in this environment; IRENA blocked automated retrieval, so its saved item remains |
| Scheduled refresh / deployment | GitHub Actions workflow supplied; activates after repository setup, not from opening an HTML file |

Retrieval timestamps in `dist/data/research.json` are authoritative. Metrics will change. The public records do not prove completeness of all your work, and provider coverage varies. ORCID dates take precedence when supplied; the source records contain some year differences from OpenAlex. Bibliographic fields missing in ORCID are supplemented from OpenAlex. The matching process combines an identically titled preprint/published record; it does not count these twice. The supplied CV is preserved as the downloadable PDF; website text has been edited separately.

## Option A — GitHub Pages

1. Create a new repository on GitHub and upload the **contents of this folder**. `dist`, `scripts`, `config.json`, and `.github` must sit at the repository root. Ensure the hidden `.github/workflows/update-and-publish.yml` file is included. Use `main` as the default branch.
2. Open repository **Settings → Pages** and select **GitHub Actions** as the publishing source.
3. Under **Settings → Actions → General**, allow the workflow to write repository contents. Branch protection must permit the workflow's data-update commit, or an administrator must configure the appropriate exception.
4. Open **Actions → Refresh research and SAF watch → Run workflow**.
5. The workflow refreshes public data, checks the files, saves the snapshot, and publishes the contents of `dist/`. The Pages deployment provides the website URL.

A daily schedule is included at **06:23 UTC**. GitHub schedules can be delayed or disabled for inactive public repositories; check Actions periodically. Manual runs are always available. No ChatGPT background task has been created.

You can configure your custom domain in GitHub Pages settings and use the DNS records GitHub displays. Enable HTTPS after domain verification. Relative asset links support a repository subpath as well as a custom-domain root.

If using Git locally, create the repository first, then from this folder:

```bash
git init -b main
git add .
git commit -m "Add research portfolio"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Authentication remains under your control. This package has not been pushed to any account.

## Option B — Hostinger

For a regular static/shared-hosting website, open your domain's File Manager in hPanel, then upload **the contents of `dist/`** into that domain's `public_html` folder. `index.html` must be directly inside `public_html`, beside `styles.css`, `app.js`, `site-settings.js`, `assets/`, and `data/`.

A convenient `hostinger-upload.zip` is included in the downloadable package. Upload it into an empty destination and extract it. Do not upload the source scripts, `.env` files, or repository configuration into the public website folder. If the domain already has a site, make a backup and choose the replacement destination deliberately. The package itself performs no deletion or server changes.

A one-time upload displays the saved snapshot. To keep a Hostinger site automatically updated without running Python on the hosting plan:

1. Put the full source project in a **public** GitHub repository as above.
2. Set repository Actions **variable** `HOSTINGER_ONLY` to `true`. This keeps the refresh and downloadable Hostinger artifact but skips GitHub Pages deployment.
3. In Hostinger's `site-settings.js`, set `researchFeedUrl` to:

```javascript
window.PORTFOLIO_SETTINGS = {
  researchFeedUrl: 'https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPOSITORY/main/dist/data/research.json'
};
```

4. Run the workflow once and check its result. Visitors then load the current public research, publication, LinkedIn and news data from your GitHub snapshot. There can be a short CDN delay. A failed request falls back to the bundled snapshot, with its original dates.

Only the data updates this way. Re-upload changed HTML/CSS/JavaScript or images when editing the design. For a private source repository, do not place a GitHub token in the website: deploy new `dist/` files through your own authenticated deployment process instead.

## Enable Google Scholar metrics

Google Scholar's page rejected direct automated access in this environment. The included adapter uses the third-party **SerpApi Google Scholar Author API**; this is not an official Google API. A provider account/key and potentially a paid plan are required. Nothing has been purchased or connected.

Add `SERPAPI_KEY` under repository **Settings → Secrets and variables → Actions → Secrets**. The author ID is already in `config.json`. On the next successful workflow run, the site prefers Scholar citation metrics, includes its recent-window figures, and merges its publication records. The adapter follows pagination. If retrieval fails, saved data and dates remain.

Provider documentation: https://serpapi.com/google-scholar-author-api

## Enable automatic LinkedIn posts

LinkedIn's official Posts API restricts `r_member_social` to approved users. An ordinary public LinkedIn URL, or a token that can only post content, does not grant permission to read your post history.

If your application has that approved permission, obtain an OAuth token for **your own profile**, then add these repository Actions secrets:

| Secret | Value |
| --- | --- |
| `LINKEDIN_ACCESS_TOKEN` | Your authorized OAuth access token with approved `r_member_social` access |
| `LINKEDIN_AUTHOR_URN` | Your API person identifier, in the form `urn:li:person:...` |

Set Actions variable `LINKEDIN_VERSION` to a supported version; the included default is `202604`. LinkedIn versions and tokens expire: update them as needed. The scheduled job only **reads** your latest public published posts, checks the author and visibility, and shows up to six. It never posts, likes, comments, or sends messages. The latest 20 records are requested and filtered for public visibility. Older/private posts are not imported. Text and source links are displayed; media and reactions are not replicated.

Without approved API access, the site keeps the profile/activity links visible. Do not put your LinkedIn password in the website. If authorized API access is unavailable, curated public post text and links can be entered into `linkedin.posts` in the snapshot; this is a manual alternative, not automatic access.

Official requirements: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api

## News and policy monitoring

`config.json` controls the approved publishers, topic keywords and collection URLs. The initial list includes EASA, the European Commission's ReFuelEU and RED pages, ICAO CORSIA, IEA, IRENA, NREL/NLR, and The Guardian's environment RSS. The snapshot also contains manually verified Financial Times coverage and an IRENA background note. Financial Times is an initial curated item, not a configured ongoing feed. Reuters and AP are allowed domains, but no feeds are configured for them.

RSS supplies dated article titles and source links. Official HTML pages supply topic-matched links, clearly marked **Source discovery** with a **Found** date when publication dates are not known. Monitor pages are checked for normalized content changes. A detected change is labeled **Page change**, not a confirmed legal change. Dynamic page content can produce false-positive change notices; legal interpretation and effective dates require reviewing the linked source. RED is legislation, not an agency; CORSIA is an ICAO scheme.

The collector uses HTTPS, an allowlist, title/topic filters, deduplication, timeouts and response-size limits. It stores short metadata and links, not full newspaper articles. Each source keeps its own success/attempt timestamps. Collection can be partial; a general collection date does not mean every source succeeded. Publisher redesigns, access restrictions and feed changes may require maintenance. IRENA was unavailable during the live collection; the source status says so. The package does not bypass login, paywalls or access restrictions.

## Edit your portfolio

| Change | File |
| --- | --- |
| Intro, contact details, education, layout | `dist/index.html` |
| Projects and experience entries | `dist/app.js` — `projects` and `roles` arrays |
| Colors, type, motion, responsive layout | `dist/styles.css` |
| Your photo | `dist/assets/portrait.png` |
| Downloadable CV | `dist/assets/Noman-Raza-Sial-CV.pdf` |
| ORCID / Scholar IDs and approved sources | `config.json` (also update visible profile links in HTML if identities change) |
| Hostinger public data feed | `dist/site-settings.js` |
| Cached data | `dist/data/research.json` |

After editing cached data, regenerate `snapshot.js` using the command below, or run the refresh script. Live-sourced fields will be overwritten on a successful future refresh.

```bash
python -c "import sys,json;sys.path.insert(0,'scripts');import sync;sync.save(json.loads(sync.FILE.read_text()))"
```

Python 3.10+ is required only for updates, not for serving the website. `sync.py` uses the standard library. Export secrets into its environment; `.env.example` is a template, not an automatically loaded file.

```bash
python scripts/sync.py
python scripts/validate.py
```

## Validation and remaining limits

The delivered snapshot was populated by real ORCID/OpenAlex and approved-source requests. Static checks validate local assets, anchors, record URLs, allowed news domains, metrics and JSON/snapshot parity. JavaScript syntax is checked. Focused data tests cover duplicate records and failure retention. No browser rendering test, GitHub workflow run, Hostinger deployment, credentialed Scholar request or credentialed LinkedIn request was performed in this environment.

Fonts load from Google Fonts with local system fallbacks. Images and the CV are bundled. No analytics or tracking scripts are included. Public profile data, CV and your email will be visible once you publish.

## Reference documentation

- ORCID public record reading: https://info.orcid.org/what-is-orcid/services/public-api/reading-orcid-records/
- OpenAlex API: https://help.openalex.org/api/
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Hostinger File Manager: https://docs.hostinger.com/websites/file-manager
- EASA feeds: https://www.easa.europa.eu/en/rss

The original portrait and CV were provided by you. External publications, reports and articles remain with their respective authors/publishers; the website links to their source pages.
