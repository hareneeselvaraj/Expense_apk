import { todayISO } from "../utils/format.js";

export const driveService = {
  getDriveToken: (clientId, driveTokenRef) => new Promise((resolve, reject) => {
    if (driveTokenRef.current) { resolve(driveTokenRef.current); return; }
    if (!window.google?.accounts?.oauth2) { reject(new Error("Google API not loaded")); return; }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (resp) => {
        if (resp.error) { reject(new Error(resp.error)); return; }
        driveTokenRef.current = resp.access_token;
        setTimeout(() => { driveTokenRef.current = null; }, 50 * 60 * 1000);
        resolve(resp.access_token);
      },
    });
    tokenClient.requestAccessToken();
  }),

  saveToDrive: async (clientId, driveTokenRef, data) => {
    const token = await driveService.getDriveToken(clientId, driveTokenRef);
    const backupData = JSON.stringify(data, null, 2);
    const fileName = `ExpenseTracker_Backup_${todayISO()}.json`;

    const listRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name contains 'ExpenseTracker_Backup' and trashed=false&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listRes.json();
    const existingFile = listData.files?.[0];

    const metadata = { name: fileName, mimeType: "application/json" };
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", new Blob([backupData], { type: "application/json" }));

    let url, method;
    if (existingFile) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart&fields=id,name,modifiedTime`;
      method = "PATCH";
    } else {
      url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime";
      method = "POST";
    }

    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: form });
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
    return await res.json();
  },

  listBackups: async (clientId, driveTokenRef) => {
    const token = await driveService.getDriveToken(clientId, driveTokenRef);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=name contains 'ExpenseTracker_Backup' and trashed=false&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc&pageSize=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.files || [];
  },

  restoreFromDrive: async (clientId, driveTokenRef, fileId) => {
    const token = await driveService.getDriveToken(clientId, driveTokenRef);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }
};
