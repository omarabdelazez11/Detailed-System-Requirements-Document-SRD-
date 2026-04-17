import React, { useState } from 'react';
import { Check, X, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RequestInbox: React.FC = () => {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState([
    { id: 'REQ-1', user: 'Dr. Ahmed', room: 'Hall A', date: '2026-04-20', type: 'Multi-Purpose', purpose: 'Seminar on AI' },
  ]);

  const [userRequests, setUserRequests] = useState([
    { uid: 'U1', name: 'Zaid Omar', email: 'zaid@aastmt.edu', employeeId: '7788', selectedRole: 'Employee' },
    { uid: 'U2', name: 'Noura Salem', email: 'noura@aastmt.edu', employeeId: '9900', selectedRole: 'Secretary' },
    { uid: 'U3', name: 'New Manager', email: 'manager@aastmt.edu', employeeId: '5566', selectedRole: 'Admin' },
  ]);

  const isBranchManager = userProfile?.role === 'BranchManager';
  const isAdmin = userProfile?.role === 'Admin';

  const canApprove = (reqRole: string) => {
    if (isBranchManager) return true;
    if (isAdmin && (reqRole === 'Employee' || reqRole === 'Secretary')) return true;
    return false;
  };

  const handleRoleChange = (uid: string, role: string) => {
    setUserRequests(userRequests.map(u => u.uid === uid ? { ...u, selectedRole: role } : u));
  };

  const approveUser = (uid: string, role: string) => {
    setUserRequests(userRequests.filter(u => u.uid !== uid));
    alert(`Account activated with role: ${role}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Account Requests */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={20} color="#22c55e" /> Account Approval Requests
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          As Admin/Manager, you must assign the role before approving.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userRequests.map(u => (
            <div key={u.uid} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', border: '1px solid #334155', borderRadius: '12px', background: '#0f172a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{u.name}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>ID: {u.employeeId} | {u.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => approveUser(u.uid, u.selectedRole)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} disabled={!canApprove(u.selectedRole)}>Approve</button>
                  <button className="btn" style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', fontSize: '0.875rem' }}>Reject</button>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Assign Role:</label>
                <select 
                  value={u.selectedRole} 
                  onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                  style={{ background: '#1e293b', color: 'white', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px' }}
                >
                  <option value="Employee">Employee</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Admin">Admin</option>
                </select>
                {!canApprove(u.selectedRole) && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={14} /> Branch Manager Required
                  </span>
                )}
              </div>
            </div>
          ))}
          {userRequests.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center' }}>No pending accounts.</p>}
        </div>
      </div>

      {/* Booking Requests */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Pending Booking Requests</h3>
        {/* ... (previous booking request UI) */}
      </div>
    </div>
  );
};

export default RequestInbox;
