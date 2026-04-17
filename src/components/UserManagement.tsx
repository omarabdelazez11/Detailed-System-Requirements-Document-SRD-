import React, { useState } from 'react';
import { UserPlus, Search, Shield, User, Mail, X, Check, Trash2, Filter, Key, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AppUser { id: string; name: string; email: string; role: string; status: 'Active' | 'Pending'; }

const UserManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const isManager = userProfile?.role === 'BranchManager';
  const isAdmin = userProfile?.role === 'Admin';

  const [users, setUsers] = useState<AppUser[]>([
    { id: '1', name: 'Dr. Ahmed', email: 'ahmed@aast.edu', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Mona Secretary', email: 'mona@aast.edu', role: 'Secretary', status: 'Active' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee' });

  const handleAddUser = () => {
    const user: AppUser = { id: Date.now().toString(), ...newUser, status: 'Active' };
    setUsers([...users, user]);
    setIsAdding(false);
    setNewUser({ name: '', email: '', role: 'Employee' });
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <User size={24} color="#3b82f6" /> Staff Management Console
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage campus personnel, roles, and system access.</p>
        </div>
        {(isManager || isAdmin) && (
          <button onClick={() => setIsAdding(true)} style={addUserBtn}><UserPlus size={18} /> Add New User</button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem' }}>
              <th style={{ padding: '1rem' }}>Name & Email</th>
              <th style={{ padding: '1rem' }}>Assigned Role</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{u.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold',
                    background: u.role === 'Admin' ? '#f59e0b11' : '#3b82f611',
                    color: u.role === 'Admin' ? '#f59e0b' : '#3b82f6'
                  }}>
                    {u.role === 'Admin' && <Crown size={10} style={{ marginRight: '4px' }} />}
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 'bold' }}>● {u.status}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} style={iconBtn}><Trash2 size={18} color="#ef4444" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ color: 'white', margin: 0 }}>Onboard New Staff Member</h3>
              <button onClick={() => setIsAdding(false)} style={iconBtn}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div><label style={labelStyle}>Full Name</label><input value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={inputStyle} /></div>
              <div><label style={labelStyle}>AAST Email</label><input value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Assign System Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={inputStyle}>
                  <option value="Employee">Employee (Staff)</option>
                  <option value="Secretary">Secretary</option>
                  {/* EXCLUSIVE: ONLY BRANCH MANAGER CAN CREATE ADMINS */}
                  {isManager && <option value="Admin">System Administrator</option>}
                </select>
                {!isManager && <p style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: '4px' }}>* Only the Branch Manager can grant Admin status.</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={handleAddUser} style={saveBtn}>Confirm & Register</button>
              <button onClick={() => setIsAdding(false)} style={cancelBtn}>Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const addUserBtn = { background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const iconBtn = { background: 'transparent', border: 'none', cursor: 'pointer' };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 };
const modalCard: React.CSSProperties = { background: '#1e293b', padding: '2.5rem', borderRadius: '24px', border: '1px solid #334155', width: '95%', maxWidth: '500px' };
const inputStyle = { width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '10px', outline: 'none' };
const labelStyle = { color: '#64748b', fontSize: '0.75rem', marginBottom: '8px', display: 'block' };
const saveBtn = { flex: 2, background: '#22c55e', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtn = { flex: 1, background: '#334155', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };

export default UserManagement;
