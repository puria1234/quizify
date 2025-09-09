'use server';

import { z } from 'zod';

const passwordSchema = z.string();

export async function verifyPassword(password: string) {
  try {
    const validatedPassword = passwordSchema.parse(password);
    const correctPassword = process.env.APP_PASSWORD || 'quizifyai';

    if (validatedPassword === correctPassword) {
      return { success: true };
    } else {
      return { success: false, error: 'Incorrect password' };
    }
  } catch (error) {
    return { success: false, error: 'Invalid input' };
  }
}
