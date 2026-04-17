import React, { useState } from 'react';
import { ShieldAlert, UserCheck, Calendar, Clock, ArrowRight, Save, Trash2, Edit3, Shield, Power, UserPlus, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Override { viewRooms: boolean; }
interface Delegation { id: string; originalId: string; substituteId: string; start: string; end: string; status: 'Active' | 'Expired'; }
interface ManagedUser { id: string; name: string; role: string; overrides: Override; }

const AuthorityManagementPage: React.FC = () => {
  // Mock DATABASE of Registered Users
  const [registeredUsers] = useState<ManagedUser[]>([
    { id: 'admin_aastmt', name: 'Master Admin', role: 'Admin', overrides: { viewRooms: true } },
    { id: 'manager_branch', name: 'Branch Manager', role: 'BranchManager', overrides: { viewRooms: true } },
    { id: 'sec_office', name: 'Nour Secretary', role: 'Secretary', overrides: { viewRooms: false } },
    { id: 'staff_member', name: 'Eng. Khaled', role: 'Employee', overrides: { viewRooms: false } },
  ]);

  const [delegations, setDelegations] = useState<Delegation[]>([
    { id: 'DEL-1', originalId: 'admin_aastmt', substituteId: 'sec_office', start: '2026-04-20', end: '2026-04-25', status: 'Active' }
  ]);

  const [isDelegating, setIsDelegating] = useState(false);
  const [delForm, setDelForm] = useState({ primary: '', sub: '', start: '', end: '' });
  const [error, setError] = useState('');

  const handleConfirmDelegation = () => {
    setError('');
    // CHECK IF USERS EXIST IN REGISTERED DATABASE
    const primaryExists = registeredUsers.find(u => u.id === delForm.primary);
    const subExists = registeredUsers.find(u => u.id === delForm.sub);

    if (!primaryExists || !subExists) {
      setError(`Verification Failed: ${!primaryExists ? 'Primary ID' : 'Substitute ID'} is not registered in the system.`);
      return;
    }

    const newDel: Delegation = {
      id: `DEL-${Math.floor(Math.random() * 900 + 100)}`,
      originalId: delForm.primary,
      substituteId: delForm.sub,
      start: delForm.start,
      end: delForm.end,
      status: 'Active'
    };

    setDelegations([newDel, ...delegations]);
    setIsDelegating(false);
    setDelForm({ primary: '', sub: '', start: '', end: '' });
  };

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={shieldCircle}><ShieldAlert size={32} color="#3b82f6" /></div>
        <div>
          <h2 style={{ margin: 0, color: 'white' }}>Academic Authority Engine</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Override defaults and manage high-priority delegations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
        
        {/* RULE 1: VIEW OVERRIDES */}
        <div style={sectionBox}>
          <h3 style={sectionTitle}><Eye size={18} color="#22c55e" /> Rule 1: View Available Rooms</h3>
          <p style={ruleHint}>Granting this override allows a user to see the full campus room grid without booking rights.</p>
          <table style={tableStyle}>
            <thead>
              <tr style={thRow}>
                <th>Registered User</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Visibility Override</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers.map(u => (
                <tr key={u.id} style={tdRow}>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>{u.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{u.id}</div>
                  </td>
                  <td><span style={roleBadge}>{u.role}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={u.overrides.viewRooms ? toggleBtnOn : toggleBtnOff}>
                       {u.overrides.viewRooms ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RULE 2: TEMPORARY DELEGATION */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <h3 style={sectionTitle}><UserCheck size={18} color="#f59e0b" /> Rule 2: Temporary Access</h3>
             <button onClick={() => setIsDelegating(true)} style={smallAddBtn}><UserPlus size={14} /> Add Delegation</button>
          </div>
          <p style={ruleHint}>Substitutes inherit the right to process booking requests during the defined dates.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {delegations.map(del => (
              <div key={del.id} style={delCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{del.id}</span>
                  <span style={activeBadge}>● {del.status}</span>
                </div>
                <div style={delFlow}>
                   <div style={delUnit}><span style={roleLabel}>Original</span><div style={{ color: 'white' }}>{del.originalId}</div></div>
                   <ArrowRight size={16} color="#334155" />
                   <div style={delUnit}><span style={roleLabel}>Substitute</span><div style={{ color: '#f59e0b' }}>{del.substituteId}</div></div>
                </div>
                <div style={delTime}><Calendar size={12} /> {del.start} — {del.end}</div>
                <button onClick={() => setDelegations(delegations.filter(d => d.id !== del.id))} style={delActionBtn}><Trash2 size={14} /> Revoke Early</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DELEGATION MODAL */}
      {isDelegating && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3 style={{ color: 'white', margin: 0 }}>Setup Temporary Delegation</h3>
               <button onClick={() => setIsDelegating(false)} style={{ background: 'transparent', border: 'none', color: '#64748b' }}><XCircle size={24} /></button>
            </div>

            {error && <div style={errorBox}><AlertCircle size={16} /> {error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div><label style={labelStyle}>Primary Employee ID</label><input value={delForm.primary} onChange={e => setDelForm({...delForm, primary: e.target.value})} placeholder="e.g. admin_aastmt" style={inputStyle} /></div>
                 <div><label style={labelStyle}>Designated Substitute ID</label><input value={delForm.sub} onChange={e => setDelForm({...delForm, sub: e.target.value})} placeholder="e.g. sec_office" style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div><label style={labelStyle}>Start Date</label><input type="date" value={delForm.start} onChange={e => setDelForm({...delForm, start: e.target.value})} style={inputStyle} /></div>
                 <div><label style={labelStyle}>End Date (Auto-Revoke)</label><input type="date" value={delForm.end} onChange={e => setDelForm({...delForm, end: e.target.value})} style={inputStyle} /></div>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>* System will verify IDs against the master registration database before confirming.</p>
            </div>
            <button onClick={handleConfirmDelegation} style={saveBtn}>Confirm Delegation Period</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const shieldCircle = { background: '#3b82f611', padding: '12px', borderRadius: '16px' };
const sectionBox = { background: '#0f172a', padding: '2rem', borderRadius: '24px', border: '1px solid #1e293b' };
const sectionTitle = { display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' };
const ruleHint = { fontSize: '0.75rem', color: '#64748b', marginBottom: '1.5rem' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as 'collapse', textAlign: 'left' as 'left' };
const thRow = { borderBottom: '1px solid #1e293b', color: '#64748b', fontSize: '0.7rem' };
const tdRow = { borderBottom: '1px solid #1e293b55' };
const roleBadge = { color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold' };
const toggleBtnOn = { background: '#22c55e11', color: '#22c55e', border: '1px solid #22c55e33', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' };
const toggleBtnOff = { background: '#33415533', color: '#64748b', border: 'none', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' };
const smallAddBtn = { background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' };
const delCard = { background: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155' };
const delFlow = { display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', marginBottom: '1rem' };
const delUnit = { display: 'flex', flexDirection: 'column', gap: '4px' };
const roleLabel = { fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase' as 'uppercase' };
const delTime = { fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' };
const delActionBtn = { background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' };
const activeBadge = { color: '#22c55e', fontSize: '0.65rem', fontWeight: 'bold' };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 };
const modalCard: React.CSSProperties = { background: '#1e293b', padding: '2.5rem', borderRadius: '32px', border: '1px solid #334155', width: '95%', maxWidth: '550px' };
const inputStyle = { width: '100%', padding: '0.85rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '12px', outline: 'none' };
const labelStyle = { color: '#64748b', fontSize: '0.75rem', marginBottom: '8px', display: 'block' };
const saveBtn = { width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '15px', fontWeight: 'bold', marginTop: '1.5rem', cursor: 'pointer' };
const errorBox = { background: '#ef444411', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ef444433' };

export default AuthorityManagementPage;
