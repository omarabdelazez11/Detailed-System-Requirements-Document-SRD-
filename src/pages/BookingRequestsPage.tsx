import React, { useState, useEffect, useMemo } from 'react';
import { Search, Check, X, Clock, Edit3, Lightbulb, MapPin, Filter, Calendar, Save, AlertTriangle, User, Hash, ArrowUpRight, XCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

interface BookingRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  room: string;
  date: string;
  time: string;
  type: string;
  status: 'Pending' | 'Awaiting Manager' | 'Approved' | 'Declined' | 'Suggestion Sent';
}

const BookingRequestsPage: React.FC = () => {
  const { rooms, slots } = useSettings();
  const { userProfile } = useAuth();
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [editingReq, setEditingReq] = useState<BookingRequest | null>(null);
  const [suggestionReq, setSuggestionReq] = useState<BookingRequest | null>(null);

  // LOAD DYNAMIC DATA
  useEffect(() => {
    const loadData = () => {
      const saved = JSON.parse(localStorage.getItem('aastmt_all_bookings') || '[]');
      setRequests(saved);
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const isAdmin = userProfile?.role === 'Admin';
  const isManager = userProfile?.role === 'BranchManager';

  const checkConflict = (req: BookingRequest) => {
    return requests.some(r => r.id !== req.id && r.status === 'Approved' && r.room === req.room && r.date === req.date && r.time === req.time);
  };

  const handleAction = (id: string, action: 'Approve' | 'Decline' | 'Suggest') => {
    const updated = requests.map(r => {
      if (r.id !== id) return r;
      if (action === 'Approve') {
        if (isAdmin && r.type === 'Multi-Purpose' && !isManager) return { ...r, status: 'Awaiting Manager' };
        return { ...r, status: 'Approved' };
      }
      if (action === 'Suggest') return { ...r, status: 'Suggestion Sent' };
      return { ...r, status: 'Declined' };
    });

    setRequests(updated as any);
    localStorage.setItem('aastmt_all_bookings', JSON.stringify(updated));
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesRoom = roomFilter === 'All Rooms' || r.room === roomFilter;
    const matchesSearch = r.requesterName?.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesRoom && matchesSearch;
  });

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: 0, color: 'white' }}>
          <Clock size={28} color="#3b82f6" /> Live Booking Control Center
        </h2>

        <div style={filterBar}>
          <div style={filterGroup}><Search size={18} color="#64748b" /><input placeholder="Search Staff or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={searchInput} /></div>
          <div style={filterGroup}>
            <MapPin size={18} color="#3b82f6" />
            <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)} style={selectStyle}>
              <option value="All Rooms">All Rooms</option>
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={filterGroup}>
            <Filter size={18} color="#64748b" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1.25rem' }}>Staff Information</th>
              <th style={{ padding: '1.25rem' }}>Location & Timing</th>
              <th style={{ padding: '1.25rem' }}>Current Status</th>
              <th style={{ padding: '1.25rem', textAlign: 'right' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => {
              const hasConflict = checkConflict(req) && (req.status === 'Pending' || req.status === 'Awaiting Manager');
              const canAct = req.status === 'Pending' || req.status === 'Awaiting Manager';
              
              return (
                <tr key={req.id} style={{ borderBottom: '1px solid #1e293b', background: hasConflict ? '#ef444405' : 'transparent' }}>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{req.requesterName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.type} • {req.id}</div>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <div style={{ fontSize: '0.95rem', color: hasConflict ? '#ef4444' : 'white', fontWeight: '600' }}>{req.room}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.date} • {req.time}</div>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <span style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800', background: getStatusColor(req.status) + '15', color: getStatusColor(req.status), textTransform: 'uppercase' }}>{req.status}</span>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      {canAct && (
                        <>
                          {!hasConflict && <button onClick={() => handleAction(req.id, 'Approve')} style={actionBtn('#22c55e')}><Check size={16} /> Approve</button>}
                          <button onClick={() => setSuggestionReq(req)} style={actionBtn('#3b82f6')}><Lightbulb size={16} /> Suggest</button>
                          <button onClick={() => handleAction(req.id, 'Decline')} style={actionBtn('#ef4444')}><X size={16} /> Decline</button>
                        </>
                      )}
                      {!canAct && <button onClick={() => setEditingReq(req)} style={editBtn}><Edit3 size={16} /> Modify</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredRequests.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>No incoming requests found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Suggestion Modal */}
      {suggestionReq && (
        <div style={modalOverlay}><div style={modalCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Propose Alternative</h3>
            <button onClick={() => setSuggestionReq(null)} style={iconBtn}><XCircle size={24} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div><label style={labelStyle}>Room</label><select value={suggestionReq.room} onChange={e => setSuggestionReq({...suggestionReq, room: e.target.value})} style={inputStyle}>{rooms.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label style={labelStyle}>Slot</label><select value={suggestionReq.time} onChange={e => setSuggestionReq({...suggestionReq, time: e.target.value})} style={inputStyle}>{slots.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <button onClick={() => { handleAction(suggestionReq.id, 'Suggest'); setSuggestionReq(null); }} style={saveBtnStyle}>Send Official Suggestion</button>
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

const filterBar = { display: 'flex', gap: '1rem', background: '#0f172a', padding: '1.25rem', borderRadius: '20px', border: '1px solid #1e293b' };
const filterGroup = { flex: 1, display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #334155' };
const searchInput = { background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' };
const selectStyle = { background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', width: '100%' };
const actionBtn = (color: string) => ({ background: color + '15', border: `1px solid ${color}33`, color: color, padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' });
const editBtn = { background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 };
const modalCard: React.CSSProperties = { background: '#1e293b', padding: '2.5rem', borderRadius: '32px', border: '1px solid #334155', width: '95%', maxWidth: '650px' };
const inputStyle = { width: '100%', padding: '0.85rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '12px' };
const labelStyle = { color: '#64748b', fontSize: '0.75rem', marginBottom: '8px', display: 'block' };
const saveBtnStyle = { width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const iconBtn = { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' };

export default BookingRequestsPage;
