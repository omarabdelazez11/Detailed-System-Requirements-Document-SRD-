import React, { useState } from 'react';
import { ShieldAlert, UserCheck, Calendar, Clock, ArrowRight, Save, Trash2, Edit3, Shield, Power, UserPlus } from 'lucide-react';

interface Override { viewSchedules: boolean; bypassRestrictions: boolean; }
interface Delegation { id: string; originalId: string; substituteId: string; start: string; end: string; status: 'Active' | 'Expired'; }
interface ManagedUser { id: string; name: string; role: string; overrides: Override; }

const AuthorityManagementPage: React.FC = () => {
  const [users] = useState<ManagedUser[]>([
    { id: 'EMP-123', name: 'Eng. Khaled', role: 'Employee', overrides: { viewSchedules: false, bypassRestrictions: false } },
    { id: 'SEC-404', name: 'Nour Office', role: 'Secretary', overrides: { viewSchedules: true, bypassRestrictions: false } },
  ]);

  const [delegations, setDelegations] = useState<Delegation[]>([
    { id: 'DEL-1', originalId: 'Admin Master', substituteId: 'SEC-404', start: '2026-04-20', end: '2026-04-25', status: 'Active' }
  ]);

  const [isModifying, setIsModifying] = useState<ManagedUser | null>(null);
  const [isDelegating, setIsDelegating] = useState(false);

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={shieldCircle}><ShieldAlert size={32} color="#3b82f6" /></div>
        <div>
          <h2 style={{ margin: 0, color: 'white' }}>Advanced Authority Engine</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Override role defaults and manage temporary permission delegations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        
        {/* OVERRIDES TERMINAL */}
        <div style={sectionBox}>
          <h3 style={sectionTitle}><Power size={18} color="#22c55e" /> User-Level Overrides</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={thRow}>
                <th>User</th>
                <th>Role Vision</th>
                <th>Restriction Bypass</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={tdRow}>
                  <td>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>{u.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{u.id}</div>
                  </td>
                  <td><span style={u.overrides.viewSchedules ? activeBadge : inactiveBadge}>{u.overrides.viewSchedules ? 'Admin View' : 'Default'}</span></td>
                  <td><span style={u.overrides.bypassRestrictions ? activeBadge : inactiveBadge}>{u.overrides.bypassRestrictions ? 'Bypass On' : 'Enforced'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => setIsModifying(u)} style={editBtn}><Edit3 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DELEGATION MONITOR */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h3 style={sectionTitle}><UserCheck size={18} color="#f59e0b" /> Active Delegations</h3>
             <button onClick={() => setIsDelegating(true)} style={smallAddBtn}><UserPlus size={14} /> New</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {delegations.map(del => (
              <div key={del.id} style={delCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#64748b' }}>#{del.id}</span>
                  <span style={del.status === 'Active' ? activeBadge : inactiveBadge}>{del.status}</span>
                </div>
                <div style={delFlow}>
                   <div style={delUnit}><span style={roleLabel}>Original</span><div style={{ color: 'white' }}>{del.originalId}</div></div>
                   <ArrowRight size={16} color="#334155" />
                   <div style={delUnit}><span style={roleLabel}>Substitute</span><div style={{ color: '#3b82f6' }}>{del.substituteId}</div></div>
                </div>
                <div style={delTime}>
                   <Calendar size={12} /> {del.start} to {del.end}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OVERRIDE MODAL */}
      {isModifying && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ color: 'white', marginBottom: '2rem' }}>Adjust Permissions for {isModifying.name}</h3>
            <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
               <div style={toggleRow}>
                 <div><div style={{ color: 'white', fontWeight: 'bold' }}>Admin Schedule Vision</div><div style={{ fontSize: '0.7rem', color: '#64748b' }}>Allows the user to view all campus schedules like an Admin.</div></div>
                 <input type="checkbox" checked={isModifying.overrides.viewSchedules} style={toggleInput} />
               </div>
               <div style={{ ...toggleRow, borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
                 <div><div style={{ color: 'white', fontWeight: 'bold' }}>Bypass Time Restrictions</div><div style={{ fontSize: '0.7rem', color: '#64748b' }}>Disables the 48-hour booking restriction for this user.</div></div>
                 <input type="checkbox" checked={isModifying.overrides.bypassRestrictions} style={toggleInput} />
               </div>
            </div>
            <button onClick={() => setIsModifying(null)} style={saveBtn}>Sync Authority Overrides</button>
          </div>
        </div>
      )}

      {/* DELEGATION MODAL */}
      {isDelegating && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ color: 'white', marginBottom: '2rem' }}>Setup Temporary Delegation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div><label style={labelStyle}>Primary Employee</label><input placeholder="ID (e.g. Master Admin)" style={inputStyle} /></div>
                 <div><label style={labelStyle}>Designated Substitute</label><input placeholder="ID (e.g. SEC-404)" style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div><label style={labelStyle}>Start Date</label><input type="date" style={inputStyle} /></div>
                 <div><label style={labelStyle}>End Date (Auto-Revoke)</label><input type="date" style={inputStyle} /></div>
              </div>
            </div>
            <button onClick={() => setIsDelegating(false)} style={saveBtn}>Confirm Delegation Period</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const shieldCircle = { background: '#3b82f611', padding: '12px', borderRadius: '16px' };
const sectionBox = { background: '#0f172a', padding: '1.5rem', borderRadius: '24px', border: '1px solid #1e293b' };
const sectionTitle = { display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '1rem', marginBottom: '1.5rem' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as 'collapse', textAlign: 'left' as 'left' };
const thRow = { borderBottom: '1px solid #1e293b', color: '#64748b', fontSize: '0.7rem' };
const tdRow = { borderBottom: '1px solid #1e293b55' };
const activeBadge = { background: '#22c55e11', color: '#22c55e', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold' };
const inactiveBadge = { background: '#33415555', color: '#64748b', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem' };
const editBtn = { background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '1rem' };
const smallAddBtn = { background: '#3b82f6', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' };
const delCard = { background: '#1e293b', padding: '1.25rem', borderRadius: '16px', border: '1px solid #334155' };
const delFlow = { display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', marginBottom: '1rem' };
const delUnit = { display: 'flex', flexDirection: 'column', gap: '4px' };
const roleLabel = { fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase' as 'uppercase' };
const delTime = { fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 };
const modalCard: React.CSSProperties = { background: '#1e293b', padding: '2.5rem', borderRadius: '32px', border: '1px solid #334155', width: '95%', maxWidth: '600px' };
const toggleRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' };
const toggleInput = { width: '40px', height: '20px', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '12px' };
const labelStyle = { color: '#64748b', fontSize: '0.7rem', marginBottom: '8px', display: 'block' };
const saveBtn = { width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '15px', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' };

export default AuthorityManagementPage;
