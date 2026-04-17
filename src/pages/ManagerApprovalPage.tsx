import React, { useState } from 'react';
import { ShieldCheck, Check, X, Clock, MapPin, Calendar, Star, AlertCircle, User, History, Inbox, Archive } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface ManagerBooking {
  id: string;
  requester: string;
  room: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Awaiting Manager' | 'Approved' | 'Declined';
}

const ManagerApprovalPage: React.FC = () => {
  const { rooms } = useSettings();
  const [activeTab, setActiveTab] = useState<'Awaiting Manager' | 'Approved' | 'Declined'>('Awaiting Manager');
  
  const [approvals, setApprovals] = useState<ManagerBooking[]>([
    { id: 'MP-901', requester: 'Dr. Ahmed (Admin)', room: 'Main Theatre', date: '2026-05-10', time: '10:00 AM - 02:00 PM', purpose: 'International Conference', status: 'Awaiting Manager' },
    { id: 'MP-902', requester: 'Sarah Secretary', room: 'Board Room', date: '2026-05-12', time: '09:00 AM - 11:00 AM', purpose: 'Faculty Meeting', status: 'Awaiting Manager' },
  ]);

  const handleFinalAction = (id: string, action: 'Approved' | 'Declined') => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: action } : a));
    // Alert removed as requested
  };

  const filteredList = approvals.filter(a => a.status === activeTab);

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={shieldIcon}><ShieldCheck size={32} color="#f59e0b" /></div>
          <div>
            <h2 style={{ margin: 0, color: 'white' }}>Executive Final Approvals</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>High-Priority decision history and pending tasks.</p>
          </div>
        </div>

        {/* TAB SYSTEM */}
        <div style={tabContainer}>
           <button onClick={() => setActiveTab('Awaiting Manager')} style={tabBtn(activeTab === 'Awaiting Manager', '#f59e0b')}><Inbox size={14} /> Pending</button>
           <button onClick={() => setActiveTab('Approved')} style={tabBtn(activeTab === 'Approved', '#22c55e')}><Check size={14} /> Approved</button>
           <button onClick={() => setActiveTab('Declined')} style={tabBtn(activeTab === 'Declined', '#ef4444')}><History size={14} /> History (Declined)</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filteredList.map(req => (
          <div key={req.id} style={approvalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={idBadge}>#{req.id}</span>
              <span style={statusBadge(req.status)}>{req.status === 'Awaiting Manager' ? 'Action Required' : req.status}</span>
            </div>
            
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>{req.purpose}</h3>
            
            <div style={detailGrid}>
              <div style={detailItem}><User size={14} /> <span>{req.requester}</span></div>
              <div style={detailItem}><MapPin size={14} /> <span>{req.room}</span></div>
              <div style={detailItem}><Calendar size={14} /> <span>{req.date}</span></div>
              <div style={detailItem}><Clock size={14} /> <span>{req.time}</span></div>
            </div>

            {req.status === 'Awaiting Manager' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => handleFinalAction(req.id, 'Approved')} style={approveBtn}><Check size={18} /> Grant Final Approval</button>
                <button onClick={() => handleFinalAction(req.id, 'Declined')} style={declineBtn}><X size={18} /> Deny</button>
              </div>
            )}
          </div>
        ))}

        {filteredList.length === 0 && (
          <div style={emptyState}>
            <Archive size={48} color="#334155" style={{ marginBottom: '1rem' }} />
            <p>No bookings found in the "{activeTab}" section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const shieldIcon = { background: '#f59e0b11', padding: '12px', borderRadius: '16px' };
const tabContainer = { display: 'flex', gap: '8px', background: '#0f172a', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b' };
const tabBtn = (active: boolean, color: string) => ({ 
  background: active ? `${color}22` : 'transparent', color: active ? color : '#64748b', border: active ? `1px solid ${color}33` : 'none', 
  padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' 
});
const approvalCard = { background: '#0f172a', padding: '1.5rem', borderRadius: '24px', border: '1px solid #1e293b', position: 'relative' as 'relative' };
const idBadge = { background: '#1e293b', color: '#64748b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' };
const statusBadge = (s: string) => ({ 
  background: s === 'Approved' ? '#22c55e11' : s === 'Declined' ? '#ef444411' : '#f59e0b11', 
  color: s === 'Approved' ? '#22c55e' : s === 'Declined' ? '#ef4444' : '#f59e0b',
  padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' 
});
const detailGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#1e293b55', padding: '1rem', borderRadius: '12px' };
const detailItem = { display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' };
const approveBtn = { flex: 2, background: '#22c55e', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' };
const declineBtn = { flex: 1, background: '#ef444411', color: '#ef4444', border: '1px solid #ef444433', padding: '0.85rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' };
const emptyState = { gridColumn: '1 / -1', textAlign: 'center' as 'center', padding: '5rem', color: '#334155' };

export default ManagerApprovalPage;
