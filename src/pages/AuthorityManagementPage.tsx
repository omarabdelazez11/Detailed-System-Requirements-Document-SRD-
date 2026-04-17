import React, { useState, useMemo, useEffect } from 'react';
import { ShieldAlert, UserCheck, Calendar, Clock, ArrowRight, Trash2, Edit3, Power, UserPlus, Eye, AlertCircle, CheckCircle2, XCircle, Timer, Infinity as InfinityIcon, ShieldCheck } from 'lucide-react';

interface Delegation { 
  id: string; 
  originalId: string; 
  substituteId: string; 
  power: 'View Available Rooms' | 'Manage Booking Requests';
  start: string; 
  end: string; 
  status: 'Active'; 
  isUnlimited: boolean; 
}

interface ManagedUser { id: string; name: string; role: string; }

const AuthorityManagementPage: React.FC = () => {
  const [registeredUsers] = useState<ManagedUser[]>([
    { id: 'admin_aastmt', name: 'Master Admin', role: 'Admin' },
    { id: 'manager_branch', name: 'Branch Manager', role: 'BranchManager' },
    { id: 'sec_office', name: 'Nour Secretary', role: 'Secretary' },
    { id: 'staff_member', name: 'Eng. Khaled', role: 'Employee' },
  ]);

  const [delegations, setDelegations] = useState<Delegation[]>(() => {
    const saved = localStorage.getItem('aastmt_delegations');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDelegating, setIsDelegating] = useState(false);
  const [delForm, setDelForm] = useState({ 
    primary: '', 
    sub: '', 
    power: 'View Available Rooms' as any, 
    start: '', 
    end: '', 
    isUnlimited: false 
  });

  // Sync delegations and visibility overrides to localStorage
  useEffect(() => {
    localStorage.setItem('aastmt_delegations', JSON.stringify(delegations));
    
    // Extract users who have "View Available Rooms" power
    const visibilityUsers = delegations
      .filter(d => d.power === 'View Available Rooms')
      .map(d => d.substituteId);
    
    localStorage.setItem('aastmt_visibility_overrides', JSON.stringify(visibilityUsers));
  }, [delegations]);

  const isPrimaryValid = useMemo(() => registeredUsers.some(u => u.id === delForm.primary), [delForm.primary]);
  const isSubValid = useMemo(() => registeredUsers.some(u => u.id === delForm.sub), [delForm.sub]);
  const canConfirm = isPrimaryValid && isSubValid && delForm.start && (delForm.isUnlimited || delForm.end);

  const handleConfirmDelegation = () => {
    if (!canConfirm) return;

    const newDel: Delegation = {
      id: `AUTH-${Math.floor(Math.random() * 900 + 100)}`,
      originalId: delForm.primary,
      substituteId: delForm.sub,
      power: delForm.power,
      start: delForm.start,
      end: delForm.isUnlimited ? '∞' : delForm.end,
      status: 'Active',
      isUnlimited: delForm.isUnlimited
    };

    setDelegations([newDel, ...delegations]);
    setIsDelegating(false);
    setDelForm({ primary: '', sub: '', power: 'View Available Rooms', start: '', end: '', isUnlimited: false });
  };

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={shieldCircle}><ShieldCheck size={32} color="#3b82f6" /></div>
          <div>
            <h2 style={{ margin: 0, color: 'white' }}>Academic Delegation Hub</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Activate user powers through strict ID verification.</p>
          </div>
        </div>
        <button onClick={() => setIsDelegating(true)} style={largeAddBtn}><UserPlus size={20} /> New Activation</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
        {delegations.map(del => (
          <div key={del.id} style={delCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <span style={powerBadge}>{del.power}</span>
               <span style={activeBadge}>● Active Power</span>
            </div>
            <div style={delFlow}>
               <div style={delUnit}><span style={roleLabel}>Source ID</span><div style={{ color: 'white', fontWeight: 'bold' }}>{del.originalId}</div></div>
               <ArrowRight size={20} color="#334155" />
               <div style={delUnit}><span style={roleLabel}>Activated User</span><div style={{ color: '#3b82f6', fontWeight: 'bold' }}>{del.substituteId}</div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
               <div style={delTime}><Calendar size={14} /> {del.start} — {del.isUnlimited ? <InfinityIcon size={14} /> : del.end}</div>
               <button onClick={() => setDelegations(delegations.filter(d => d.id !== del.id))} style={revokeBtn}><Trash2 size={16} /> Deactivate</button>
            </div>
          </div>
        ))}
      </div>

      {isDelegating && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
               <h3 style={{ color: 'white', margin: 0 }}>Activate Sub-System Power</h3>
               <button onClick={() => setIsDelegating(false)} style={closeBtn}><XCircle size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 <div>
                    <label style={labelStyle}>Primary Employee ID</label>
                    <input value={delForm.primary} onChange={e => setDelForm({...delForm, primary: e.target.value})} style={idInput(delForm.primary.length > 0 && !isPrimaryValid)} />
                    {delForm.primary.length > 0 && !isPrimaryValid && <span style={errorTxt}>ID Not Registered</span>}
                 </div>
                 <div>
                    <label style={labelStyle}>User to Activate</label>
                    <input value={delForm.sub} onChange={e => setDelForm({...delForm, sub: e.target.value})} style={idInput(delForm.sub.length > 0 && !isSubValid)} />
                    {delForm.sub.length > 0 && !isSubValid && <span style={errorTxt}>ID Not Registered</span>}
                 </div>
              </div>

              <div>
                 <label style={labelStyle}>Select Power to Enable</label>
                 <select value={delForm.power} onChange={e => setDelForm({...delForm, power: e.target.value as any})} style={selectInput}>
                    <option value="View Available Rooms">View Available Rooms</option>
                    <option value="Manage Booking Requests">Manage Booking Requests</option>
                 </select>
              </div>

              <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <input type="checkbox" checked={delForm.isUnlimited} onChange={e => setDelForm({...delForm, isUnlimited: e.target.checked})} />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Permanent Activation</span>
                 </div>
                 {!delForm.isUnlimited && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                       <div><label style={labelStyle}>Start Date</label><input type="date" value={delForm.start} onChange={e => setDelForm({...delForm, start: e.target.value})} style={idInput(false)} /></div>
                       <div><label style={labelStyle}>End Date</label><input type="date" value={delForm.end} onChange={e => setDelForm({...delForm, end: e.target.value})} style={idInput(false)} /></div>
                    </div>
                 )}
                 {delForm.isUnlimited && (
                    <div><label style={labelStyle}>Start Date</label><input type="date" value={delForm.start} onChange={e => setDelForm({...delForm, start: e.target.value})} style={idInput(false)} /></div>
                 )}
              </div>
            </div>

            <button disabled={!canConfirm} onClick={handleConfirmDelegation} style={confirmBtn(canConfirm)}>
              {canConfirm ? 'Activate Power Now' : 'Enter Valid Registered IDs'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles (same as before)
const shieldCircle = { background: '#3b82f611', padding: '12px', borderRadius: '16px' };
const largeAddBtn = { background: '#3b82f6', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' };
const delCard = { background: '#0f172a', padding: '2rem', borderRadius: '28px', border: '1px solid #1e293b' };
const powerBadge = { background: '#3b82f615', color: '#3b82f6', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' };
const activeBadge = { color: '#22c55e', fontSize: '0.7rem', fontWeight: 'bold' };
const delFlow = { display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between' };
const delUnit = { flex: 1 };
const roleLabel = { fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' as 'uppercase', marginBottom: '4px', display: 'block' };
const delTime = { fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' };
const revokeBtn = { background: '#ef444411', border: 'none', color: '#ef4444', padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const modalCard: React.CSSProperties = { background: '#1e293b', padding: '3rem', borderRadius: '40px', border: '1px solid #334155', width: '95%', maxWidth: '650px' };
const labelStyle = { color: '#64748b', fontSize: '0.8rem', marginBottom: '10px', display: 'block' };
const idInput = (invalid: boolean) => ({ width: '100%', padding: '1rem', background: '#0f172a', border: `2px solid ${invalid ? '#ef4444' : '#334155'}`, color: 'white', borderRadius: '16px', outline: 'none' });
const selectInput = { width: '100%', padding: '1rem', background: '#0f172a', border: '2px solid #334155', color: 'white', borderRadius: '16px', outline: 'none', cursor: 'pointer' };
const errorTxt = { color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', display: 'block', fontWeight: 'bold' };
const confirmBtn = (active: boolean) => ({ width: '100%', background: active ? '#3b82f6' : '#1e293b', color: active ? 'white' : '#475569', border: 'none', padding: '1.25rem', borderRadius: '20px', fontWeight: 'bold', marginTop: '2.5rem', cursor: active ? 'pointer' : 'not-allowed' });
const closeBtn = { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' };

export default AuthorityManagementPage;
