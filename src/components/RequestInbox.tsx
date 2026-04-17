import React, { useState } from 'react';
import { UserPlus, Check, X, Shield, ShieldCheck, User, Mail, Search } from 'lucide-react';

interface PendingAccount {
  id: string;
  name: string;
  email: string;
  academicId: string;
  date: string;
  selectedRole: 'Employee' | 'Secretary' | 'Admin' | 'BranchManager';
}

const RequestInbox: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingAccount[]>([
    { id: 'REG-101', name: 'Dr. Khaled Omar', email: 'khaled@aast.edu', academicId: '2023001', date: '2026-04-16', selectedRole: 'Employee' },
    { id: 'REG-202', name: 'Mona Hassan', email: 'mona.h@aast.edu', academicId: '2023002', date: '2026-04-17', selectedRole: 'Secretary' },
  ]);

  const updateRole = (id: string, role: any) => {
    setPendingUsers(pendingUsers.map(u => u.id === id ? { ...u, selectedRole: role } : u));
  };

  const handleApprove = (id: string) => {
    const user = pendingUsers.find(u => u.id === id);
    alert(`Account Approved! ${user?.name} is now a registered ${user?.selectedRole}.`);
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
  };

  const handleDecline = (id: string) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <UserPlus size={24} color="#3b82f6" /> Account Registration Inbox
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Review and assign roles to new system registrants.</p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Applicant Details</th>
              <th style={{ padding: '1rem' }}>Academic ID</th>
              <th style={{ padding: '1rem' }}>Assign Role</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {user.email}</div>
                </td>
                <td style={{ padding: '1rem', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {user.academicId}
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={user.selectedRole} 
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    style={roleSelectStyle}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Admin">Admin</option>
                    <option value="BranchManager">Branch Manager</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleApprove(user.id)} style={btnStyle('#22c55e')} title="Approve & Assign Role"><Check size={18} /></button>
                    <button onClick={() => handleDecline(user.id)} style={btnStyle('#ef4444')} title="Reject Registration"><X size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingUsers.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#334155' }}>
            <ShieldCheck size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No new account registrations pending.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const roleSelectStyle = { background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' };
const btnStyle = (bg: string) => ({ background: bg, border: 'none', color: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer' });

export default RequestInbox;
