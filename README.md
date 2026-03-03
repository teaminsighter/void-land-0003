# Void Land — Portfolio Website Collection

A curated collection of production-ready landing pages. Each folder is a standalone, deploy-ready website.

---

## Projects

| # | Folder | Type | Status |
|---|--------|------|--------|
| 1 | `real-estate/` | Luxury Real Estate Landing Page | Ready |

---

## How to Use

1. Pick a project folder (e.g. `real-estate/`)
2. Open `config.js` and update client details (company name, phone, email, analytics IDs)
3. Update `robots.txt` and `sitemap.xml` with the live domain
4. Deploy the folder to **Netlify / Vercel / GitHub Pages**

---

## Folder Naming Convention

```
kebab-case/          (e.g. real-estate, saas-landing, restaurant, portfolio)
├── index.html
├── style.css
├── script.js
├── config.js        ← client edits this only
├── robots.txt
├── sitemap.xml
└── 404.html
```

Each project is self-contained — no shared dependencies between folders.
