import { getDB, saveDB, delay } from '@/mocks/db';

/**
 * Mock Approval Service
 * Uses localStorage as the database. Swap with real axios calls when backend is ready.
 */

export const approveContent = async (contentId) => {
  await delay(500);
  const db = getDB();
  const idx = db.contents.findIndex((c) => c.id === contentId);
  if (idx === -1) throw new Error('Content not found');
  db.contents[idx].status = 'approved';
  db.contents[idx].rejectionReason = null;
  saveDB(db);
  return { success: true, data: { content: db.contents[idx] } };
};

export const rejectContent = async (contentId, reason) => {
  await delay(500);
  const db = getDB();
  const idx = db.contents.findIndex((c) => c.id === contentId);
  if (idx === -1) throw new Error('Content not found');
  db.contents[idx].status = 'rejected';
  db.contents[idx].rejectionReason = reason;
  saveDB(db);
  return { success: true, data: { content: db.contents[idx] } };
};
