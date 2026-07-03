# Redistricting Map Contact Dashboard

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge&color=0A3161)
![License](https://img.shields.io/github/license/howlcipher/redistricting-map-contact?style=for-the-badge&color=B31942)
![Last Commit](https://img.shields.io/github/last-commit/howlcipher/redistricting-map-contact?style=for-the-badge&color=0A3161)

A premium dashboard built to track outreach to government officials, media, and political organizations regarding the algorithm-based state voting districts project. 

## 🎯 What This Application Does Now

This application serves as a **fully functional, serverless CRM and Outreach Tracker** that uses a GitHub repository as its backend database. 

### Key Features:
- **Serverless Architecture**: It reads and writes directly to `public/data.json` on your GitHub repository via the GitHub API, eliminating the need for a separate backend or database.
- **Admin Dashboard**: Users with a GitHub Personal Access Token can log in to enter Admin mode.
- **Dynamic Contact Management**: Admins can add new contacts, specify their category, and assign a customizable **Category Icon** (e.g. Building, Megaphone, Shield) via a dropdown form.
- **Edit Existing Contacts**: Admins can hit the 'Edit' button on any row to fix typos, change categories, or update contact routes on the fly.
- **One-Click Status Tracking**: Progress a contact through outreach phases: `Pending` -> `Drafted` -> `Sent` -> `Replied` -> `Unresponsive` -> `Undeliverable`.
- **Public Response Logging**: If a contact is marked as "Replied", you can attach their exact message text in a modal for public viewing.
- **Auto-Sorting**: Contacts are grouped logically by their assigned category and automatically sorted alphabetically by name.
- **Conflict-Free Saving**: Changes are debounced and stamped with a unique cache-busting timestamp so rapid clicks never result in 409 API conflicts.
- **Minimalist Retro Patriotic UI**: A beautifully clean interface with Old Glory accents and typewriter typography, featuring Dark/Light mode toggles.

## 🛠️ Built With

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
</div>

*Icons and badges sourced from [shields.io](https://shields.io/) and [devicon.dev](https://devicon.dev/).*

---

## 📦 Data Sourcing & Geometries

The data utilized in the primary redistricting algorithm project—including demographic metrics, shapefiles, and geographical geometries—is strictly maintained in the core repository: **[howlcipher/redistricting-map](https://github.com/howlcipher/redistricting-map)**. 

This contact dashboard focuses exclusively on the outreach and tracking component of the project. It uses a lightweight `data.json` structure to map entities and their corresponding contact status without bundling heavy map topologies or algorithms.

---

## 📐 Mathematical & Open-Source Legitimacy (TL;DR)

This project fundamentally shifts the redistricting paradigm by removing human bias. Utilizing **Markov Chain Monte Carlo (MCMC)** and **ReCom** algorithms, it generates mathematically verifiable, strictly fair state voting districts based on natural political geography. 

By making the codebase open-source and the metrics (such as the Efficiency Gap) fully transparent, anyone can independently verify the fairness of a map or detect artificial skewing. 

For a comprehensive breakdown of the mathematics, algorithms, and how to interpret the data, please read the **[Mathematical & Open-Source Legitimacy Guide](./GUIDE.md)**.

---

## ⚠️ Potential Pitfalls & Limitations

Since this dashboard uses a purely serverless, GitHub-driven architecture, there are a few technical and operational limitations to be aware of:

- **Browser Security**: The GitHub Personal Access Token (PAT) used for Admin Mode is stored in your browser's `localStorage`. Ensure you only log in on trusted, private devices. If your device is compromised, your token could be extracted.
- **Concurrent Editing**: If multiple admins attempt to edit the dashboard at the exact same moment, the last save will overwrite previous ones. While the system prevents stale data conflicts for a single user, it does not support real-time collaborative editing (like Google Docs).
- **Data Scaling**: The entire database is a single `public/data.json` file. This is highly efficient and lightning-fast for hundreds or even thousands of contacts, but it is not built to scale to millions of entries without implementing pagination.
- **API Rate Limits**: Editing contacts relies on the GitHub REST API. Authenticated requests are limited to 5,000 per hour. While this is exceptionally high for manual data entry, aggressive automated scripts interacting with the frontend could trigger throttling.

---

## 🚀 How to Fork & Use Your Own Tracker

You can easily clone this project to use as a CRM/Tracker for your own campaigns! Because it uses GitHub as the database, hosting is 100% free.

### 1. Fork the Repository
Click the **Fork** button at the top right of this page to create your own copy.

### 2. Third-Party Data Integration
To integrate your own third-party data backend via the GitHub API, open `src/App.tsx` and update the `REPO_OWNER` and `REPO_NAME` constants at the top of the file to match your GitHub username and repository name.
Also update `package.json` and `vite.config.ts` if your GitHub Pages base URL changes.

### 3. Clear Existing Data
You don't want the default contacts. We've included a script to wipe the database clean instantly:
```bash
npm run clear-data
```
This empties `public/data.json`. Add, commit, and push this change to your repository.

### 4. Enable GitHub Pages
Go to your repository **Settings > Pages**. Set the source to **GitHub Actions** or the `gh-pages` branch. 
Run the deployment script to push the site live:
```bash
npm run deploy
```

### 5. Generate a Personal Access Token
To use Admin Mode on your live site, you need a token.
1. Go to your GitHub **Settings > Developer Settings > Personal Access Tokens > Tokens (classic)**.
2. Generate a new token and give it **`repo`** scope permissions.
3. Go to your live deployed site, click **Login**, and paste this token. You can now securely edit, add, and organize your own contacts live!

---

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Run Tests:
   ```bash
   npm run test
   ```

## Deployment

To deploy this project to GitHub Pages (which also runs automatically on push):
```bash
npm run deploy
```

## Email Draft
A draft of the email to be used for outreach is included in `email_draft.md`.

## Support
If you like this project, don't buy me a coffee—make a donation instead! 
**[Donate to the Arizzo Foundation](https://arizzofoundation.org/donate)**
