export interface Booking {
  id: string;
  requesterId: string;
  requesterName: string;
  room: string;
  date: string;
  time: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Awaiting Manager' | 'Suggestion Sent';
  type: 'Multi-Purpose' | 'Lecture';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
  createdAt: string;
}

export const bookingService = {
  seedInitialData() {
    if (localStorage.getItem('aastmt_seeded')) return;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const initialBookings: Booking[] = [
      { id: 'BK-001', requesterId: 'staff_member', requesterName: 'Dr. Ahmed Ali', room: 'Hall A', date: today, time: '08:00 AM - 10:00 AM', status: 'Approved', type: 'Lecture', createdAt: new Date().toISOString() },
      { id: 'BK-002', requesterId: 'staff_member', requesterName: 'Dr. Ahmed Ali', room: 'Lab C', date: tomorrow, time: '10:00 AM - 12:00 PM', status: 'Pending', type: 'Multi-Purpose', createdAt: new Date().toISOString() },
      { id: 'BK-003', requesterId: 'sec_office', requesterName: 'Office Secretary', room: 'Meeting Room 1', date: today, time: '12:00 PM - 02:00 PM', status: 'Approved', type: 'Multi-Purpose', createdAt: new Date().toISOString() },
      { id: 'BK-004', requesterId: 'staff_member', requesterName: 'Dr. Ahmed Ali', room: 'Hall B', date: today, time: '02:00 PM - 04:00 PM', status: 'Declined', type: 'Lecture', createdAt: new Date().toISOString() },
    ];

    const initialNotifs: AppNotification[] = [
      { id: 'NT-001', userId: 'admin_aastmt', title: 'New Request', message: 'Dr. Ahmed Ali requested Lab C.', type: 'info', read: false, createdAt: new Date().toISOString() },
      { id: 'NT-002', userId: 'staff_member', title: 'Booking Approved', message: 'Your request for Hall A has been approved.', type: 'success', read: false, createdAt: new Date().toISOString() },
    ];

    localStorage.setItem('aastmt_all_bookings', JSON.stringify(initialBookings));
    localStorage.setItem('aastmt_notifs', JSON.stringify(initialNotifs));
    localStorage.setItem('aastmt_seeded', 'true');
  },

  async createBooking(booking: Omit<Booking, 'id'>) {
    const existing = JSON.parse(localStorage.getItem('aastmt_all_bookings') || '[]');
    const newId = 'BK-' + Math.floor(Math.random() * 9000 + 1000);
    const newBooking = { ...booking, id: newId };
    localStorage.setItem('aastmt_all_bookings', JSON.stringify([newBooking, ...existing]));
    
    const notifs = JSON.parse(localStorage.getItem('aastmt_notifs') || '[]');
    localStorage.setItem('aastmt_notifs', JSON.stringify([{
      id: 'NT-' + Date.now(),
      userId: 'admin_aastmt',
      title: 'New Request',
      message: `${booking.requesterName} requested ${booking.room}.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    }, ...notifs]));
    return newId;
  },

  async updateBookingStatus(id: string, status: Booking['status'], requesterId?: string) {
    const local = JSON.parse(localStorage.getItem('aastmt_all_bookings') || '[]');
    const updated = local.map((b: any) => b.id === id ? { ...b, status } : b);
    localStorage.setItem('aastmt_all_bookings', JSON.stringify(updated));

    if (requesterId) {
      const notifs = JSON.parse(localStorage.getItem('aastmt_notifs') || '[]');
      localStorage.setItem('aastmt_notifs', JSON.stringify([{
        id: 'NT-' + Date.now(),
        userId: requesterId,
        title: `Booking ${status}`,
        message: `Your request has been marked as ${status}.`,
        type: status === 'Approved' ? 'success' : 'warning',
        read: false,
        createdAt: new Date().toISOString()
      }, ...notifs]));
    }
  },

  listenToAllBookings(callback: (bookings: Booking[]) => void) {
    const load = () => callback(JSON.parse(localStorage.getItem('aastmt_all_bookings') || '[]'));
    load();
    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  },

  listenToNotifications(userId: string, callback: (notifs: AppNotification[]) => void) {
    const load = () => {
      const all = JSON.parse(localStorage.getItem('aastmt_notifs') || '[]');
      callback(all.filter((n: any) => n.userId === userId));
    };
    load();
    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  },

  async markNotifRead(id: string) {
    const all = JSON.parse(localStorage.getItem('aastmt_notifs') || '[]');
    const updated = all.map((n: any) => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('aastmt_notifs', JSON.stringify(updated));
  }
};
