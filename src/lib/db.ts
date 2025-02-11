import { openDB } from 'idb';

import { configSite } from 'config';
import type { LinkProps, TagProps } from '@models/general';

const dbName = `${configSite.name}-links-db`;
const storeName = 'links';

const dbNameTgas = `${configSite.name}-tags-db`;
const tagStoreName = 'tags';

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
    id: crypto.randomUUID(),
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

// Obtener base de datos, pasarla a JSON y descargar
export async function exportData() {
  const links = await getAllLinks();
  const tags = await getAllTags();

  const data = { links, tags };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'utility-links-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Importar: Recibe un JSON previamente exportado
export async function importData(jsonData: string) {
  try {
    const { links, tags } = JSON.parse(jsonData);
    const dbLinks = await initDB();
    const dbTags = await initTagDB();

    const txLinks = dbLinks.transaction(storeName, 'readwrite');
    const txTags = dbTags.transaction(tagStoreName, 'readwrite');

    await Promise.all([
      ...links.map((link: LinkProps) => txLinks.store.add({
        ...link,
        title: link?.title?.toLowerCase() || "Sin título",
        createdAt: new Date(link.createdAt),
      })),
      ...tags.map((tag: TagProps) => txTags.store.add({
        ...tag,
        title: tag?.title?.toLowerCase() || "Sin título",
        createdAt: new Date(tag.createdAt),
      })),
      txLinks.done,
      txTags.done
    ]);

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Initialize database for tags
export async function initTagDB() {
  const db = await openDB(dbNameTgas, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(tagStoreName)) {
        db.createObjectStore(tagStoreName, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

// Create a new tag
export async function addTag(title: string) {
  const db = await initTagDB();
  return db.add(tagStoreName, {
    id: crypto.randomUUID(),
    title: title?.toLowerCase(),
    createdAt: new Date()
  });
}

// Get all tags
export async function getAllTags() {
  const db = await initTagDB();
  return db.getAll(tagStoreName);
}

// Update a tag
export async function updateTag(id: string, title: string) {
  const db = await initTagDB();
  const existingTag = await db.get(tagStoreName, id);
  if (!existingTag) throw new Error('Tag not found');
  return db.put(tagStoreName, { ...existingTag, title: title?.toLowerCase() });
}

// Delete a tag
export async function deleteTag(id: string) {
  const db = await initTagDB();
  return db.delete(tagStoreName, id);
}

// Get multiple tags by IDs
export async function getTagsByIds(ids: string[]) {
  const db = await initTagDB();
  const tags = await Promise.all(ids.map(id => db.get(tagStoreName, id)));
  return tags.filter(tag => tag !== undefined); // Filtrar valores undefined si algún ID no existe
}
