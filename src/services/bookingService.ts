import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface BookingRequest {
  userId: string;
  room: string;
  date: string;
  fromTime: string;
  toTime: string;
  purpose: string;
  type: 'Lecture' | 'Multi-Purpose';
  technicalReqs?: any;
  managerDetails?: any;
}

export const bookingService = {
  validateBooking: (date: string, role: string, type: string) => {
    const bookingDate = new Date(date);
    const now = new Date();
    const diffInHours = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (role === 'Secretary' && diffInHours < 48) {
      return { valid: false, message: 'Secretaries must book at least 48 hours in advance.' };
    }

    if (role === 'Employee' && diffInHours < 24) {
      return { valid: false, message: 'Employees must book at least 24 hours in advance.' };
    }

    return { valid: true };
  },

  submitBooking: async (request: BookingRequest) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...request,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
