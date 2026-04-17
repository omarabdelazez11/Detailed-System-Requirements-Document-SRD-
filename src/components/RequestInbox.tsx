import React, { useState } from 'react';
import { Check, X, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RequestInbox: React.FC = () => {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState([
    { id: 'REQ-1', user: 'Dr. Ahmed', room: 'Hall A', date: '2026-04-20', type: 'Multi-Purpose', purpose: 'Seminar on AI' },
  ]);

  const [userRequests, setUserRequests] = useState([
    { uid: 'U1', name: 'Zaid Omar', email: 'zaid@aastmt.edu', role: 'Employee' },
    { uid: 'U2', name: 'Noura Salem', email: 'noura@aastmt.edu', role: 'Secretary' },
    { uid: 'U3', name: 'Manager Bob', email: 'bob@aastmt.edu', role: 'Admin' },
  ]);

  const isBranchManager = userProfile?.role === 'BranchManager';
  const isAdmin = userProfile?.role === 'Admin';

  const canApprove = (reqRole: string) => {
    if (isBranchManager) return true; // Branch Manager can approve everyone
    if (isAdmin && (reqRole === 'Employee' || reqRole === 'Secretary')) return true; // Admin can approve Employee/Secretary
    return false; // Admin cannot approve another Admin
  };

  const approveUser = (uid: string) => {
    setUserRequests(userRequests.filter(u => u.uid !== uid));
    alert('User account activated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Account Requests */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={20} color="#22c55e" /> Account Approval Requests
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userRequests.map(u => (
            <div key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #334155', borderRadius: '8px', background: '#0f172a' }}>
              <div>
                <strong>{u.name}</strong> ({u.role})
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{u.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {canApprove(u.role) ? (
                  <button onClick={() => approveUser(u.uid)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Approve</button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={14} /> Branch Manager Only
                  </span>
                )}
                <button className="btn" style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', fontSize: '0.875rem' }}>Reject</button>
              </div>
            </div>
          ))}
          {userRequests.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center' }}>No pending accounts.</p>}
        </div>
      </div>

      {/* Booking Requests */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Pending Booking Requests</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map(req => (
            <div key={req.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '1rem', background: '#0f172a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#3b82f6' }}>{req.type}: {req.room}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>By: {req.user} | Date: {req.date}</p>
                  <p style={{ marginTop: '0.5rem' }}>{req.purpose}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer' }}>
                    <Check size={18} />
                  </button>
                  <button className="btn" style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestInbox;
