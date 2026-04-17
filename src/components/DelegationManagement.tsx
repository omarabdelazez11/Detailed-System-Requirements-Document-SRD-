import React, { useState } from 'react';
import { Shield, UserPlus, Clock, X, Check, Search, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

interface Delegation {
  id: string;
  userName: string;
  userId: string;
  authority: 'Manage Bookings' | 'User Approval' | 'System Settings';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

const DelegationManagement: React.FC = () => {
  const [delegations, setDelegations] = useState<Delegation[]>([
    { id: 'DL-001', userName: 'Sarah Ali', userId: 'USR-005', authority: 'Manage Bookings', startDate: '2026-04-15', endDate: '2026-04-20', status: 'Active' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newDelegation, setNewDelegation] = useState({
    userId: '', authority: 'Manage Bookings' as any, startDate: '', endDate: ''
  });

  const handleAdd = () => {
    if (newDelegation.userId && newDelegation.startDate && newDelegation.endDate) {
      const entry: Delegation = {
        id: `DL-${Math.floor(Math.random() * 900) + 100}`,
        userName: `User (${newDelegation.userId})`,
        userId: newDelegation.userId,
        authority: newDelegation.authority,
        startDate: newDelegation.startDate,
        endDate: newDelegation.endDate,
        status: 'Active'
      };
      setDelegations([entry, ...delegations]);
      setIsAdding(false);
    }
  };

  const revokeAccess = (id: string) => {
    setDelegations(delegations.map(d => d.id === id ? { ...d, status: 'Revoked' } : d));
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <ShieldCheck size={24} color="#a855f7" /> Authority Delegation
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Grant temporary management powers to trusted staff members.</p>
        </div>
        <button onClick={() => setIsAdding(true)} style={addBtnStyle}><UserPlus size={18} /> New Delegation</button>
      </div>

      {/* NEW DELEGATION FORM */}
      {isAdding && (
        <div style={formCard}>
          <h3 style={{ color: 'white', marginTop: 0, fontSize: '1rem' }}>Create Temporary Access</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            <div><label style={labelStyle}>Staff ID</label><input type="text" placeholder="USR-..." value={newDelegation.userId} onChange={e => setNewDelegation({...newDelegation, userId: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Power</label><select value={newDelegation.authority} onChange={e => setNewDelegation({...newDelegation, authority: e.target.value as any})} style={inputStyle}><option>Manage Bookings</option><option>User Approval</option></select></div>
            <div><label style={labelStyle}>Start Date</label><input type="date" value={newDelegation.startDate} onChange={e => setNewDelegation({...newDelegation, startDate: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>End Date</label><input type="date" value={newDelegation.endDate} onChange={e => setNewDelegation({...newDelegation, endDate: e.target.value})} style={inputStyle} /></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={handleAdd} style={saveBtn}>Confirm Delegation</button>
            <button onClick={() => setIsAdding(false)} style={cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* ACTIVE DELEGATIONS TABLE */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Deputized User</th>
              <th style={{ padding: '1rem' }}>Delegated Authority</th>
              <th style={{ padding: '1rem' }}>Valid Period</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {delegations.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>{d.userName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{d.userId}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 'bold' }}>{d.authority}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                    <Calendar size={14} /> {d.startDate} <Clock size={14} style={{ marginLeft: '4px' }} /> {d.endDate}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                   <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', background: d.status === 'Active' ? '#22c55e22' : '#ef444422', color: d.status === 'Active' ? '#22c55e' : '#ef4444' }}>
                    {d.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {d.status === 'Active' && (
                    <button onClick={() => revokeAccess(d.id)} style={revokeBtn} title="Revoke Immediately">Revoke Access</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {delegations.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#334155' }}>
            <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No active delegations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', fontSize: '0.85rem' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' };
const formCard = { background: '#0f172a', padding: '2rem', borderRadius: '20px', border: '1px solid #334155', marginBottom: '2.5rem' };
const addBtnStyle = { background: '#a855f7', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const saveBtn = { background: '#22c55e', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtn = { background: 'transparent', color: '#64748b', border: '1px solid #334155', padding: '0.85rem 2rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const revokeBtn = { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' };

export default DelegationManagement;
