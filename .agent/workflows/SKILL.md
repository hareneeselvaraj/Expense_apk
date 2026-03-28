---
description: How to build and deploy a standalone React + IndexedDB Expense Tracker
---

# React + IndexedDB Standalone App Pattern

This pattern allows building powerful, offline-first web applications that store data locally in the browser's IndexedDB, requiring no backend server.

## Architecture

- **Frontend**: React (Vite) for the UI and logic.
- **Storage**: IndexedDB for local persistence.
- **Backup/Sync**: Manual JSON export/import for user-controlled cloud backup (e.g., to Google Drive).
- **Deployment**: Static hosting (Netlify, Vercel, GitHub Pages).

## Key Components

### 1. IndexedDB Wrapper
Use a simple Promise-based wrapper for IndexedDB operations:
```javascript
const openDB = () => new Promise((res, rej) => {
  const r = indexedDB.open("AppDB", 1);
  r.onupgradeneeded = e => e.target.result.createObjectStore("data");
  r.onsuccess = e => res(e.target.result);
  r.onerror = e => rej(e.target.error);
});
```

### 2. State Management & Persistence
Sync React state with IndexedDB using `useEffect`:
```javascript
useEffect(() => {
  const loadData = async () => {
    const data = await dbGet("appData");
    if (data) setState(data);
  };
  loadData();
}, []);

const saveData = (newData) => {
  setTransactions(newData);
  dbSet("appData", { transactions: newData });
};
```

### 3. CSV Parsing
Integrate `PapaParse` for importing bank statements:
```javascript
import Papa from "papaparse";
// or load via CDN if standalone
```

### 4. Google Authentication (GIS)
To implement real Google Login:
- Load `https://accounts.google.com/gsi/client` script.
- Initialize with `google.accounts.id.initialize({ client_id: YOUR_ID, callback: handleCallback })`.
- Use `google.accounts.id.renderButton` to show the official button.

## UI Guidelines (Premium Aesthetic)

- **Glassmorphism**: Use `backdrop-filter: blur(12px)` and semi-transparent backgrounds.
- **Gradients**: Use HSL-based vibrant gradients for cards and accents.
- **Typography**: Use modern sans-serif fonts like *Plus Jakarta Sans* or *Inter*.
- **Animations**: Implement smooth transitions for modals and list items.

## Deployment to Netlify

1. Create a `netlify.toml` file:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
2. Connect your repository to Netlify.
3. Set base directory to the project root.
