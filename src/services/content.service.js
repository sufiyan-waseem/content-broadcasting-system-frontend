import { getDB, saveDB, delay, generateId } from '@/mocks/db';

/**
 * Mock Content Service
 * Uses localStorage as the database. Swap with real axios calls when backend is ready.
 */

export const uploadContent = async (formData) => {
  await delay(800);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const file = formData.get('file');

  // Convert file to a base64 data URL for preview (since we can't upload to a server)
  const fileUrl = await new Promise((resolve) => {
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });

  const newContent = {
    id: generateId(),
    title: formData.get('title'),
    subject: formData.get('subject'),
    description: formData.get('description') || '',
    fileUrl,
    status: 'pending',
    teacherId: user.id,
    teacher: { name: user.name, email: user.email },
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    rotationDuration: formData.get('rotationDuration') ? Number(formData.get('rotationDuration')) : null,
    rejectionReason: null,
    createdAt: new Date().toISOString(),
  };

  const db = getDB();
  db.contents.unshift(newContent);
  saveDB(db);

  return { success: true, data: { content: newContent } };
};

export const getMyContent = async () => {
  await delay(400);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const db = getDB();
  const contents = db.contents.filter((c) => c.teacherId === user.id);
  return { success: true, data: contents };
};

export const getAllContent = async () => {
  await delay(400);
  const db = getDB();
  return { success: true, data: db.contents };
};

export const getPendingContent = async () => {
  await delay(400);
  const db = getDB();
  const contents = db.contents.filter((c) => c.status === 'pending');
  return { success: true, data: contents };
};

export const getLiveBroadcast = async (teacherId) => {
  await delay(500);
  const db = getDB();
  const now = new Date();

  // Find approved content that is currently active (within start-end window)
  const active = db.contents.find(
    (c) =>
      c.teacherId === teacherId &&
      c.status === 'approved' &&
      new Date(c.startTime) <= now &&
      new Date(c.endTime) >= now
  );

  return { success: true, data: active || null };
};
