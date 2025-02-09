import { openDB } from 'idb';

import { configSite } from 'config';
import type { LinkProps } from '@models/general';

const dbName = `${configSite.title}-links-db`;
const storeName = 'links';

// Inicializar base de datos
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

// Agregar item a la base de datos, validando que no exista la misma URL
export async function addLink(link: Omit<LinkProps, 'id' | 'createdAt'>) {
  const db = await initDB();
  const allLinks = await db.getAll(storeName);

  // Verificar si ya existe un link con la misma URL
  const exists = allLinks.some(existingLink => existingLink.url === link.url);
  if (exists) {
    throw new Error("Ya existe un enlace con esta URL.");
  }

  return db.add(storeName, {
    ...link,
    createdAt: new Date(),
  });
}

// Actualizar un item, validando que no exista la misma URL en otro enlace
export async function updateLink(id: number, link: Omit<LinkProps, 'id' | 'createdAt'>) {
  const db = await initDB();
  const existingLink = await db.get(storeName, id);
  if (!existingLink) throw new Error('Link not found');

  // Obtener todos los enlaces y verificar si la URL ya existe en otro enlace
  const allLinks = await db.getAll(storeName);
  const exists = allLinks.some(existing => existing.url === link.url && existing.id !== id);
  if (exists) {
    throw new Error("Ya existe un enlace con esta URL.");
  }

  return db.put(storeName, {
    ...existingLink,
    ...link,
  });
}

// Obtener toda la lista de items
export async function getAllLinks() {
  const db = await initDB();
  return db.getAll(storeName);
}

// Buscar un item por tags, (title o descripton)
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

// Eliminar un item
export async function deleteLink(id: number) {
  const db = await initDB();
  return db.delete(storeName, id);
}

// Obtener base de datos, pasarla a json y descargar
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

// Importar: Recibe un json previamente exportado de otro navegador o dispositivo
export async function importData(jsonData: string) {
  try {
    const links = JSON.parse(jsonData);
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    await Promise.all([
      ...links.map((link: LinkProps) => tx.store.add({
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