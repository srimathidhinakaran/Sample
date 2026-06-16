# Sample ATM (MERN) - Minimal Example

This workspace contains a minimal ATM application (frontend + backend).

## Run locally

Start backend:

```bash
cd Sample/backend
npm install
node server.js
```

Start frontend:

```bash
cd Sample/frontend
npm install
npm run dev
```

API base: `http://localhost:4000/api`

## Push to GitHub

Replace `<your-remote-url>` with your repository URL.

```bash
cd Sample
git init
git add .
git commit -m "Initial ATM app"
git remote add origin <your-remote-url>
git branch -M main
git push -u origin main
```

If you already have a repo, just add remote and push.
