import React, { useState } from 'react';
import { Check, X, UserCheck, ShieldAlert, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BookingRequest {
  id: string;
  user: string;
  room: string;
  date: string;
  time: string;
  type: 'Lecture' | 'Multi-Purpose';
  purpose: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const RequestInbox: React.FC = () => {
  const { userProfile } = useAuth();
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    { id: 'BK-101', user: 'Dr. Ahmed (Employee)', room: 'Hall A', date: '2026-04-20', time: '10:00 - 12:00', type: 'Multi-Purpose', purpose: 'Seminar on AI', status: 'Pending' },
    { id: 'BK-102', user: 'Sarah Ali (Secretary)', room: 'Room 302', date: '2026-04-21', time: '09:00 - 11:00', type: 'Lecture', purpose: 'Extra Section', status: 'Pending' },
  ]);

  const [userRequests, setUserRequests] = useState([
    { uid: 'U1', name: 'Zaid Omar', email: 'zaid@aastmt.edu', employeeId: '7788', selectedRole: 'Employee' },
  ]);

  const [rejectionData, setRejectionData] = useState<{ id: string; reason: string; alt: string } | null>(null);

  const isBranchManager = userProfile?.role === 'BranchManager';
  const isAdmin = userProfile?.role === 'Admin';

  const canApproveAccount = (reqRole: string) => {
    if (isBranchManager) return true;
    if (isAdmin && (reqRole === 'Employee' || reqRole === 'Secretary')) return true;
    return false;
  };

  const handleApproveBooking = (id: string) => {
    setBookingRequests(bookingRequests.filter(r => r.id !== id));
    alert('Booking approved and added to the calendar!');
  };

  const handleRejectBooking = (id: string) => {
    const req = bookingRequests.find(r => r.id === id);
    if (req) {
      setRejectionData({ id, reason: '', alt: '' });
    }
  };

  const submitRejection = () => {
    if (rejectionData) {
      setBookingRequests(bookingRequests.filter(r => r.id !== rejectionData.id));
      alert(`Rejection sent with reason: ${rejectionData.reason}`);
      setRejectionData(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Account Approval Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={20} color="#22c55e" /> Account Approval Requests
        </h3>
        {/* ... (User account list) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userRequests.map(u => (
            <div key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #334155', borderRadius: '8px', background: '#0f172a' }}>
               <div>
                  <strong>{u.name}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>ID: {u.employeeId} | Role: {u.selectedRole}</div>
               </div>
               <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={!canApproveAccount(u.selectedRole)}>Approve</button>
            </div>
          ))}
          {userRequests.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No pending accounts.</p>}
        </div>
      </div>

      {/* 2. Room Booking Requests Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="#3b82f6" /> Room Booking Requests
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookingRequests.map(req => (
            <div key={req.id} style={{ padding: '1.25rem', border: '1px solid #334155', borderRadius: '12px', background: '#0f172a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', background: req.type === 'Multi-Purpose' ? '#22c55e' : '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>{req.type}</span>
                    <strong style={{ fontSize: '1.1rem' }}>{req.room}</strong>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'white' }}>{req.date} | {req.time}</div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' }}>Requested by: {req.user}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleApproveBooking(req.id)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.5rem 1rem' }}>
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => handleRejectBooking(req.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', color: '#cbd5e1' }}>
                <HelpCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 
                <strong>Purpose:</strong> {req.purpose}
              </div>
            </div>
          ))}
          {bookingRequests.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No pending booking requests.</p>}
        </div>
      </div>

      {/* Rejection Modal / Form Overlay */}
      {rejectionData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: '2rem', maxWidth: '500px', width: '90%' }}>
            <h3>Reject Booking Request</h3>
            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label>Reason for Rejection</label>
              <textarea 
                value={rejectionData.reason} 
                onChange={(e) => setRejectionData({...rejectionData, reason: e.target.value})}
                placeholder="e.g. Room occupied by fixed schedule"
                style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px', minHeight: '80px' }}
              />
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label>Suggest Alternative (Optional)</label>
              <input 
                type="text" 
                value={rejectionData.alt}
                onChange={(e) => setRejectionData({...rejectionData, alt: e.target.value})}
                placeholder="e.g. Suggest Room C at 12 PM"
                style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={submitRejection} className="btn btn-primary" style={{ flex: 1, background: '#ef4444' }}>Send Rejection</button>
              <button onClick={() => setRejectionData(null)} className="btn" style={{ flex: 1, background: '#334155', color: 'white' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestInbox;
