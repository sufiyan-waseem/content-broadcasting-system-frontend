// ─── MOCK USERS ────────────────────────────────────────────────
export const MOCK_USERS = [
  {
    id: 'user-teacher-001',
    name: 'Rahul Sharma',
    email: 'teacher1@test.com',
    password: 'password123',
    role: 'teacher',
  },
  {
    id: 'user-teacher-002',
    name: 'Priya Singh',
    email: 'teacher2@test.com',
    password: 'password123',
    role: 'teacher',
  },
  {
    id: 'user-principal-001',
    name: 'Dr. Anil Kumar',
    email: 'principal1@test.com',
    password: 'password123',
    role: 'principal',
  },
];

// ─── SEED CONTENT ───────────────────────────────────────────────
const now = new Date();
const past = (h) => new Date(now.getTime() - h * 3600000).toISOString();
const future = (h) => new Date(now.getTime() + h * 3600000).toISOString();

export const SEED_CONTENT = [
  {
    id: 'content-001',
    title: 'Photosynthesis — Chapter 5',
    subject: 'Biology',
    description: 'Detailed explanation of the photosynthesis process in plants.',
    fileUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    status: 'approved',
    teacherId: 'user-teacher-001',
    teacher: { name: 'Rahul Sharma', email: 'teacher1@test.com' },
    startTime: past(5),
    endTime: future(3),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: past(10),
  },
  {
    id: 'content-002',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    description: 'Solving quadratic equations using the quadratic formula.',
    fileUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    status: 'pending',
    teacherId: 'user-teacher-001',
    teacher: { name: 'Rahul Sharma', email: 'teacher1@test.com' },
    startTime: future(1),
    endTime: future(5),
    rotationDuration: 20,
    rejectionReason: null,
    createdAt: past(2),
  },
  {
    id: 'content-003',
    title: 'French Revolution Overview',
    subject: 'History',
    description: 'Key events leading to the French Revolution.',
    fileUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800',
    status: 'rejected',
    teacherId: 'user-teacher-001',
    teacher: { name: 'Rahul Sharma', email: 'teacher1@test.com' },
    startTime: past(20),
    endTime: past(10),
    rotationDuration: 15,
    rejectionReason: 'Content is too advanced for the current curriculum level.',
    createdAt: past(25),
  },
  {
    id: 'content-004',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    description: 'Understanding Newton\'s three fundamental laws.',
    fileUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    status: 'pending',
    teacherId: 'user-teacher-002',
    teacher: { name: 'Priya Singh', email: 'teacher2@test.com' },
    startTime: future(2),
    endTime: future(8),
    rotationDuration: 45,
    rejectionReason: null,
    createdAt: past(1),
  },
  {
    id: 'content-005',
    title: 'Water Cycle Explained',
    subject: 'Geography',
    description: 'Evaporation, condensation, and precipitation.',
    fileUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800',
    status: 'approved',
    teacherId: 'user-teacher-002',
    teacher: { name: 'Priya Singh', email: 'teacher2@test.com' },
    startTime: past(3),
    endTime: future(6),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: past(8),
  },
];

// ─── DB INIT ─────────────────────────────────────────────────────
const DB_KEY = 'cbs_mock_db';

export const initDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify({ contents: SEED_CONTENT }));
  }
};

export const getDB = () => {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || { contents: [] };
  } catch {
    return { contents: SEED_CONTENT };
  }
};

export const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// ─── HELPERS ─────────────────────────────────────────────────────
export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const generateId = () => `content-${Date.now()}-${Math.random().toString(36).slice(2)}`;
