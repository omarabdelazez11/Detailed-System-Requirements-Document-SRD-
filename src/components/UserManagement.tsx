import React, { useState } from 'react';
import { UserPlus, Shield, Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Ahmed Ali', email: 'ahmed@aastmt.edu', role: 'Employee', canViewRooms: false },
    { id: '2', name: 'Sarah Hassan', email: 'sarah@aastmt.edu', role: 'Secretary', canViewRooms: false },
  ]);

  const [delegation, setDelegation] = useState({ primary: '', substitute: '', start: '', end: '' });

  const toggleOverride = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, canViewRooms: !u.canViewRooms } : u));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* User List & Overrides */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={20} color="#3b82f6" /> User Permissions & Overrides
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>View Available Rooms</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #334155', color: 'white' }}>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>{user.role}</td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => toggleOverride(user.id)}
                    style={{ 
                      background: user.canViewRooms ? '#22c55e' : '#1e293b', 
                      color: 'white', 
                      border: '1px solid #334155', 
                      borderRadius: '20px', 
                      padding: '4px 12px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {user.canViewRooms ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {user.canViewRooms ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Access Delegation */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="#f59e0b" /> Temporary Access Delegation
        </h3>
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Primary User (On Leave)</label>
            <select style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}>
              <option>Select User</option>
              {users.map(u => <option key={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Substitute User</label>
            <select style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}>
              <option>Select User</option>
              {users.map(u => <option key={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Start Date</label>
            <input type="date" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }} />
          </div>
          <div className="input-group">
            <label>End Date</label>
            <input type="date" style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }} />
          </div>
          <button type="button" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Create Delegation</button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
