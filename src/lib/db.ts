import { openDB } from 'idb';

export interface Link {
  id?: number;
  title: string;
  description: string;
  url: string;
  tags: string[];
  color: string;
  createdAt: Date;
}

const dbName = 'utility-links-db';
const storeName = 'links';

export async function initDB() {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
        store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
      }
    },
  });
  return db;
}

export async function addLink(link: Omit<Link, 'id' | 'createdAt'>) {
  const db = await initDB();
  return db.add(storeName, {
    ...link,
    createdAt: new Date(),
  });
}

export async function updateLink(id: number, link: Omit<Link, 'id' | 'createdAt'>) {
  const db = await initDB();
  const existingLink = await db.get(storeName, id);
  if (!existingLink) throw new Error('Link not found');

  return db.put(storeName, {
    ...existingLink,
    ...link,
  });
}

export async function getAllLinks() {
  const db = await initDB();
  return db.getAll(storeName);
}

export async function searchLinks(query: string, tags: string[]) {
  const db = await initDB();
  const allLinks = await db.getAll(storeName);
  
  return allLinks.filter(link => {
    const matchesQuery = query === '' || 
      link.title.toLowerCase().includes(query.toLowerCase()) ||
      link.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesTags = tags.length === 0 || 
      tags.every(tag => link.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });
}

export async function deleteLink(id: number) {
  const db = await initDB();
  return db.delete(storeName, id);
}

export async function exportData() {
  const links = await getAllLinks();
  const blob = new Blob([JSON.stringify(links, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'utility-links-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(jsonData: string) {
  try {
    const links = JSON.parse(jsonData);
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    await Promise.all([
      ...links.map((link: Link) => tx.store.add({
        ...link,
        createdAt: new Date(link.createdAt)
      })),
      tx.done
    ]);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}