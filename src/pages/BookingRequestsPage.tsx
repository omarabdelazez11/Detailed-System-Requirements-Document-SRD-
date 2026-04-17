import React, { useState } from 'react';
import { Search, Check, X, Clock, Edit3, Lightbulb, MapPin, Filter, Calendar, Save, AlertTriangle, User, Hash } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

interface BookingRequest {
  id: string;
  requesterName: string;
  requesterRole: 'Employee' | 'Secretary' | 'Admin';
  room: string;
  date: string;
  time: string;
  type: 'Lecture' | 'Multi-Purpose';
  status: 'Pending' | 'Awaiting Manager' | 'Approved' | 'Declined' | 'Suggestion Sent';
}

const BookingRequestsPage: React.FC = () => {
  const { rooms, slots } = useSettings();
  const { userProfile } = useAuth();
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [requests, setRequests] = useState<BookingRequest[]>([
    { id: 'BK-101', requesterName: 'Dr. Ahmed', requesterRole: 'Employee', room: 'Hall A1', date: '2026-04-20', time: '08:30 AM - 10:00 AM', type: 'Lecture', status: 'Approved' },
    { id: 'BK-202', requesterName: 'Sarah Admin', requesterRole: 'Admin', room: 'Hall A1', date: '2026-04-20', time: '08:30 AM - 10:00 AM', type: 'Multi-Purpose', status: 'Pending' },
    { id: 'BK-505', requesterName: 'Hana Staff', requesterRole: 'Secretary', room: 'Event Hall', date: '2026-04-22', time: '10:20 AM - 11:50 AM', type: 'Multi-Purpose', status: 'Pending' },
  ]);

  const [editingReq, setEditingReq] = useState<BookingRequest | null>(null);
  const [suggestionReq, setSuggestionReq] = useState<BookingRequest | null>(null);

  const isAdmin = userProfile?.role === 'Admin';
  const isManager = userProfile?.role === 'BranchManager';

  const checkConflict = (req: BookingRequest) => {
    return requests.some(r => r.id !== req.id && r.status === 'Approved' && r.room === req.room && r.date === req.date && r.time === req.time);
  };

  const handleAction = (id: string, action: 'Approve' | 'Decline' | 'Suggest') => {
    setRequests(requests.map(r => {
      if (r.id !== id) return r;
      if (action === 'Approve') {
        if (isAdmin && r.type === 'Multi-Purpose' && r.requesterRole !== 'Admin') return { ...r, status: 'Awaiting Manager' };
        return { ...r, status: 'Approved' };
      }
      if (action === 'Suggest') return { ...r, status: 'Suggestion Sent' };
      return { ...r, status: 'Declined' };
    }));
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesRoom = roomFilter === 'All Rooms' || r.room === roomFilter;
    const matchesSearch = r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesRoom && matchesSearch;
  });

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
          <Clock size={24} color="#3b82f6" /> Booking Control Center
        </h2>

        <div style={filterBar}>
          <div style={filterGroup}>
             <Search size={16} color="#64748b" />
             <input placeholder="Search Staff or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={searchInput} />
          </div>
          <div style={filterGroup}>
            <MapPin size={16} color="#3b82f6" />
            <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)} style={selectStyle}>
              <option value="All Rooms">All Rooms</option>
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={filterGroup}>
            <Filter size={16} color="#64748b" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Awaiting Manager">Manager Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem' }}>
              <th style={{ padding: '1rem' }}>Requester Information</th>
              <th style={{ padding: '1rem' }}>Location & Timing</th>
              <th style={{ padding: '1rem' }}>Current Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => {
              const hasConflict = checkConflict(req) && (req.status === 'Pending' || req.status === 'Awaiting Manager');
              const canModify = req.status === 'Approved' || req.status === 'Declined' || hasConflict;
              
              return (
                <tr key={req.id} style={{ borderBottom: '1px solid #1e293b', background: hasConflict ? '#ef444405' : 'transparent' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{req.requesterName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}># {req.id}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: hasConflict ? '#ef4444' : 'white', fontWeight: '500' }}>{req.room}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.date} • {req.time}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ 
                        width: 'fit-content', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', 
                        background: getStatusColor(req.status) + '22', color: getStatusColor(req.status) 
                      }}>
                        {req.status}
                      </span>
                      {hasConflict && <span style={{ color: '#ef4444', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> Conflict</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {((isAdmin && req.status === 'Pending' && req.requesterRole !== 'Admin') || (isManager && req.status === 'Awaiting Manager')) && (
                        <>
                          {!hasConflict && <button onClick={() => handleAction(req.id, 'Approve')} style={btnStyle('#22c55e')} title="Approve"><Check size={18} /></button>}
                          <button onClick={() => setSuggestionReq(req)} style={btnStyle('#f59e0b')} title="Suggest Alternative"><Lightbulb size={18} /></button>
                          <button onClick={() => handleAction(req.id, 'Decline')} style={btnStyle('#ef4444')} title="Decline"><X size={18} /></button>
                        </>
                      )}
                      {(canModify || req.status === 'Pending' || req.status === 'Awaiting Manager') && (
                        <button onClick={() => setEditingReq(req)} style={btnStyle('transparent', '#3b82f6')} title="Modify Request"><Edit3 size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODALS (Suggest & Edit) ... same as previous version */}
      {suggestionReq && (
        <div style={modalOverlay}><div style={modalCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Propose Alternative</h3>
            <button onClick={() => setSuggestionReq(null)} style={iconBtn}><X size={24} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><label style={labelStyle}>New Room</label><select value={suggestionReq.room} onChange={e => setSuggestionReq({...suggestionReq, room: e.target.value})} style={inputStyle}>{rooms.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label style={labelStyle}>New Slot</label><select value={suggestionReq.time} onChange={e => setSuggestionReq({...suggestionReq, time: e.target.value})} style={inputStyle}>{slots.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => { handleAction(suggestionReq.id, 'Suggest'); setSuggestionReq(null); }} style={saveBtnStyle}>Send Suggestion</button>
            <button onClick={() => setSuggestionReq(null)} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div></div>
      )}

      {editingReq && (
        <div style={modalOverlay}><div style={modalCard}>
          <h3 style={{ color: 'white', marginBottom: '2rem' }}>Modify Booking Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><label style={labelStyle}>Update Room</label><select value={editingReq.room} onChange={e => setEditingReq({...editingReq, room: e.target.value})} style={inputStyle}>{rooms.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label style={labelStyle}>Update Slot</label><select value={editingReq.time} onChange={e => setEditingReq({...editingReq, time: e.target.value})} style={inputStyle}>{slots.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <button onClick={() => { setRequests(requests.map(r => r.id === editingReq.id ? editingReq : r)); setEditingReq(null); }} style={saveBtnStyle}>Update & Sync Status</button>
        </div></div>
      )}
    </div>
  );
};

const getStatusColor = (s: string) => {
  if (s === 'Approved') return '#22c55e';
  if (s === 'Awaiting Manager') return '#f59e0b';
  if (s === 'Suggestion Sent') return '#3b82f6';
  if (s === 'Declined') return '#ef4444';
  return '#64748b';
};

const filterBar = { display: 'flex', gap: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '16px', border: '1px solid #1e293b' };
const filterGroup = { flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '10px' };
const searchInput = { background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.85rem' };
const selectStyle = { background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', width: '100%' };
const btnStyle = (bg: string) => ({ background: bg, border: 'none', color: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer' });
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 };
const modalCard: React.CSSProperties = { background: '#1e293b', padding: '2.5rem', borderRadius: '24px', border: '1px solid #334155', width: '95%', maxWidth: '700px' };
const inputStyle = { width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '10px' };
const labelStyle = { color: '#64748b', fontSize: '0.75rem', marginBottom: '8px', display: 'block' };
const saveBtnStyle = { flex: 1.5, background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtnStyle = { flex: 1, background: '#334155', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const iconBtn = { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' };

export default BookingRequestsPage;
