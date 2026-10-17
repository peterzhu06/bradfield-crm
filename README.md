# Bradfield Advisors — Internal Dashboard (v3)

Deal pipeline, broking, financier intelligence, client targets, contacts, tasks and weekly snapshots — for the whole team, on one shared dataset.

This is a **static web app** (plain HTML/CSS/JS, no build step) backed by a **Supabase** database with email/password login. It can be hosted on any web server or static host.

```
bradfield-crm/
├── index.html              ← the app (login screen + shell)
├── css/app.css
├── js/
│   ├── config.js           ← ★ your Supabase URL + anon key go here
│   ├── main.js             ← boot: auth gate → load data → render
│   ├── app.js              ← state + routing
│   ├── core/
│   │   ├── store.js        ← shared persistence (diff sync + realtime)
│   │   ├── auth.js         ← sign-in / sign-out / password
│   │   └── ui.js           ← modal, toast, helpers
│   ├── data/defaults.js    ← initial dataset (seeded on first run)
│   ├── views/*.js          ← one file per screen
│   ├── snapshots.js        ← printable HTML snapshot reports
│   ├── logos.js
│   └── vendor/             ← chart.js 4.4.1, supabase-js 2.118 (no CDN needed)
├── supabase/schema.sql     ← database setup
└── README.md
```

---

## 1. Set up the shared database (one-off, ~10 minutes)

1. Create a free project at **https://supabase.com** (choose the Sydney region).
2. In the project: **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, click **Run**.
3. **Authentication → Providers → Email**: leave *Email* enabled. Turn **off** *"Allow new users to sign up"* (so only people you add can log in). Optionally turn off *"Confirm email"* so added users can log in immediately.
4. **Authentication → Users → Add user** for each team member (email + a temporary password, or *Send invite*). They can change their password from *Settings* inside the app.
5. **Project Settings → API**: copy the **Project URL** and the **anon public** key into `js/config.js`:

   ```js
   SUPABASE_URL:      'https://xxxxxxxxxxxx.supabase.co',
   SUPABASE_ANON_KEY: 'eyJhbGciOi...',
   ```

   The anon key is designed to be public; access is enforced by login + the row-level-security policies in the schema.

6. **Authentication → URL Configuration**: set *Site URL* to where the app will live (e.g. `https://intranet.bradfield.com.au/crm/`). This is needed for password-reset links.

The first person to log in seeds the database with the bundled *reference* data only (financiers, advisors, service providers, sub-type lists). Firm records — deals, targets, contacts, tasks, activity, documents — are **not** in this public repository. Load them once via **Settings → Import JSON** using the private seed/export file kept outside the repo. After that, everyone sees and edits the same live data; changes made by one user appear on the others' screens within a second or two.

> **Migrating from the old single-file dashboard:** open the old HTML file in the browser where it was used, click **Export** in the top bar to save `bradfield-crm-YYYY-MM-DD.json`, then in the new app go to **Settings → Import JSON**. (If the new app is opened in that same browser it will also detect the old data and offer to import it automatically.) The bundled defaults contain the deal pipeline as at 5 Sept 2026 but the sample contacts/tasks/activity from the original seed — importing the export replaces all of it with the real records.

## 2. Deploy

Copy the whole `bradfield-crm/` folder to any web server and serve `index.html`. It **must** be served over HTTP(S) — opening `index.html` directly from disk (`file://`) will not work with Supabase. Examples:

| Host | Steps |
|------|-------|
| **IIS** (Windows Server) | Copy the folder into `C:\inetpub\wwwroot\crm\`, browse to `https://server/crm/`. Make sure IIS serves `.json`/`.js` (default MIME types are fine). |
| **Azure Static Web Apps / Blob static site** | Upload the folder; set `index.html` as the index document. |
| **SharePoint** | SharePoint blocks custom HTML pages by default. Host the folder on IIS/Azure and link to it from SharePoint instead. |
| **Nginx / Apache** | Point the document root at the folder. |
| **Local preview** | `cd bradfield-crm && python -m http.server 8080` → http://localhost:8080 |

Nothing needs to be built or installed on the server — it's all static files. Only `js/config.js` differs between environments.

### Local / offline mode
If `js/config.js` is left blank, the app runs without login and keeps data in the browser's local storage (same behaviour as the old version). Useful for previewing or demoing.

## 3. Day-to-day

- **Quick Add** (top bar) creates a task, activity, deal or contact from anywhere.
- **Export** (top bar or Settings) downloads a complete JSON backup — do this periodically; Supabase free tier also keeps 7 days of backups on paid plans.
- **Snapshot** buttons on each page generate a self-contained printable HTML report (Weekly Pipeline Snapshot has a section picker).
- **Settings** → account (sign out, change password), data tools (export / import / reset), and the industry sub-type lists used by Client Targets.
- The "Saved" indicator in the top bar confirms each write reached the database; a red toast means a write failed (it retries on the next save).

## 4. Updating the app

Replace the files on the server with the new version, **keeping your `js/config.js`**. Data lives in Supabase, not in the files, so updates never touch records. If a release changes the data shape, `store.js → migrateLoadedData()` is where migrations go.

## 5. Security notes

- All data access requires a signed-in Supabase user; the policies in `schema.sql` deny anonymous access entirely.
- Every write is also appended to `records_history` (who/when/what) for an audit trail — query it in the Supabase table editor if you ever need to recover a deleted record.
- `index.html` carries `noindex`; still, host it behind your normal network/VPN controls if possible — it's an internal tool.
- For a stricter setup (e.g. read-only users), extend the RLS policies — the structure supports it without app changes.
