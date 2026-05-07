import { MOCK_USERS, delay } from '@/mocks/db';

/**
 * Mock Auth Service
 * Replaces real API calls. Swap this file with real axios calls when backend is ready.
 */

export const login = async ({ email, password }) => {
  await delay(600); // Simulate network latency

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    const err = new Error('Invalid email or password');
    err.response = { data: { message: 'Invalid email or password' } };
    throw err;
  }

  // Return a structure identical to the real backend response
  const { password: _, ...safeUser } = user;
  return {
    success: true,
    data: {
      user: safeUser,
      token: `mock-jwt-${safeUser.id}-${Date.now()}`,
    },
  };
};

export const getMe = async () => {
  await delay(200);
  const stored = localStorage.getItem('user');
  if (!stored) throw new Error('Not authenticated');
  return { success: true, data: { user: JSON.parse(stored) } };
};
