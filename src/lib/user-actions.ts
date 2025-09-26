'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const adminEmail = process.env.ADMIN_EMAIL;

async function verifyAdmin(currentUserEmail?: string | null) {
  if (!currentUserEmail || currentUserEmail !== adminEmail) {
    throw new Error('You are not authorized to perform this action.');
  }
}

export async function isAdmin(email: string): Promise<boolean> {
  return email === adminEmail;
}

export async function checkUserAuthorization(
  email: string
): Promise<boolean> {
  if (!email) return false;
  if (email === adminEmail) return true; // Admin is always authorized

  const userDocRef = doc(db, 'authorizedUsers', email);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists();
}

export async function getAuthorizedUsers(): Promise<string[]> {
  const usersCollection = collection(db, 'authorizedUsers');
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map((doc) => doc.id);
}

export async function addUser(
  email: string,
  currentUserEmail?: string | null
): Promise<{ success: boolean; message: string }> {
  await verifyAdmin(currentUserEmail);

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email format.' };
  }

  try {
    await setDoc(doc(db, 'authorizedUsers', email), {
      addedAt: new Date().toISOString(),
      addedBy: currentUserEmail,
    });
    return { success: true, message: 'User added successfully.' };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, message: 'Failed to add user.' };
  }
}

export async function removeUser(
  email: string,
  currentUserEmail?: string | null
): Promise<{ success: boolean; message: string }> {
  await verifyAdmin(currentUserEmail);

  if (email === adminEmail) {
    return { success: false, message: 'Cannot remove the admin account.' };
  }

  try {
    await deleteDoc(doc(db, 'authorizedUsers', email));
    return { success: true, message: 'User removed successfully.' };
  } catch (error) {
    console.error('Error removing user:', error);
    return { success: false, message: 'Failed to remove user.' };
  }
}
