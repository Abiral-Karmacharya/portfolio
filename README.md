# Abiral Karmacharya — Visual CV

A static React CV styled as a **modern terminal session** — boot sequence,
typed commands, an actually-typeable shell, and a two-stage CTF hidden inside.
No backend, no database.

## Editing your CV (the whole point)

**Open `src/data.js`. That is the only file you edit.**

| To change…        | Edit this array   | How                                        |
| ----------------- | ----------------- | ------------------------------------------ |
| Name, tagline     | `profile`         | Change the strings                         |
| Contact buttons   | `links`           | Set a value to `""` to hide a button       |
| Hero numbers      | `stats`           | 2–4 objects look best                      |
| Certifications    | `certifications`  | Copy an object, paste, edit                |
| GitHub projects   | `projects`        | Copy an object, paste, edit                |
| **CTF record**    | `ctfs`            | One object per event — delete to remove; a commented-out template is at the bottom of the array |
| Skills            | `skills`          | Plain string lists per group               |

No component knows about specific content — everything is generated from the
arrays, so adding/removing items can never break the layout.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Deploy to Netlify (two options)

**Option A — Git (recommended, auto-redeploys on every push):**
1. Push this folder to a GitHub repo.
2. In Netlify: *Add new site → Import an existing project* → pick the repo.
3. Netlify reads `netlify.toml` automatically (build `npm run build`, publish `dist`). Done.
4. From then on: edit `data.js` → commit → push → site updates itself.

**Option B — drag & drop:**
```bash
npm install
npm run build
```
Drag the generated `dist/` folder onto https://app.netlify.com/drop

## Before you publish — small checklist

- [ ] Add your TryHackMe profile URL in `links.tryhackme`
- [ ] Add an email in `links.email` (or leave `""` to hide)
- [ ] Point each project's `href` at its specific repo (currently your profile)
- [ ] Fill in real CTF dates/results in `ctfs`


## The hidden CTF

**Flag 1 (easy):** `flag{cur10sity_p4ys_r3nt}` — hidden base64-encoded in the
boot sequence ("auth token" line) and in an HTML comment in the page source.
Typing it into the terminal gives a joke response. Change it by editing
`easyFlagB64` in `data.js` (base64-encode your new flag).

**Flag 2 (your PDF challenge):**
1. Put your challenge PDF at `public/challenge.pdf` (delete the placeholder).
2. Run `node tools/encrypt-reward.mjs` — enter your flag and the reward
   message. It prints a hash + ciphertext.
3. Paste both into `terminalConfig.pdfCtf` in `data.js`, set `enabled: true`.

The site stores only a SHA-256 of your flag (unrecoverable), and the reward is
AES-encrypted **with the flag as the key** — so nobody can read either by
viewing your source. When someone solves it, the terminal decrypts the reward
live, asks their name, and records it via **Netlify Forms** (check your Netlify
dashboard → Forms → `ctf-solvers`). Verify them, then add them to `hallOfFame`
in `data.js` for public credit via the `hall of fame` command.

Note: forms only work on the deployed Netlify site, not `npm run dev`.
