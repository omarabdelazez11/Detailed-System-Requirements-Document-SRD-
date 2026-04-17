import React, { useState } from 'react';
import { Search, MapPin, Clock, Eye, User, Shield, Info, Calendar, Globe, Target, UserCheck, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const UserOverrideView: React.FC = () => {
  const { rooms, slots } = useSettings();
  const [searchId, setSearchId] = useState('');
  const [activeUser, setActiveUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'Specific' | 'Unlimited'>('Unlimited');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const mockUsers = [
    { id: 'USR-001', name: 'Dr. Ahmed', role: 'Employee', dept: 'Engineering', access: 'Standard' },
    { id: 'USR-505', name: 'Sarah Admin', role: 'Admin', dept: 'IT', access: 'Master View' },
    { id: 'USR-999', name: 'Director Omar', role: 'BranchManager', dept: 'Executive', access: 'Master View' }
  ];

  const handleSearch = () => {
    const user = mockUsers.find(u => u.id === searchId);
    if (user) setActiveUser(user);
    else alert('User ID not found.');
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Eye size={24} color="#3b82f6" /> Executive View Monitor
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Deep audit of staff perspectives and system-wide visibility permissions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* PERSPECTIVE TOGGLE */}
          <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #334155' }}>
            <button onClick={() => setViewMode('Unlimited')} style={{ ...toggleBtn, background: viewMode === 'Unlimited' ? '#3b82f6' : 'transparent', color: viewMode === 'Unlimited' ? 'white' : '#64748b' }}><Globe size={14} /> Unlimited</button>
            <button onClick={() => setViewMode('Specific')} style={{ ...toggleBtn, background: viewMode === 'Specific' ? '#3b82f6' : 'transparent', color: viewMode === 'Specific' ? 'white' : '#64748b' }}><Target size={14} /> Specific Period</button>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input type="text" placeholder="Staff ID (e.g. USR-505)..." value={searchId} onChange={(e) => setSearchId(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={handleSearch} style={searchBtnStyle}>Search</button>
        </div>
      </div>

      {viewMode === 'Specific' && (
        <div style={rangeBar}>
          <Calendar size={16} color="#3b82f6" />
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Select Audit Period:</span>
          <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} style={dateInput} />
          <span style={{ color: '#334155' }}>→</span>
          <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} style={dateInput} />
        </div>
      )}

      {activeUser && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* MONITORING PANEL */}
          <div style={monitorPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#3b82f622', padding: '10px', borderRadius: '50%' }}><User size={20} color="#3b82f6" /></div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{activeUser.name} <span style={{ fontSize: '0.7rem', color: '#22c55e', background: '#22c55e11', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>{activeUser.access}</span></div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{activeUser.role} • {activeUser.dept}</div>
                </div>
              </div>
              <div style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} /> AUDIT MODE ACTIVE: NO MODIFICATION ALLOWED
              </div>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ position: 'sticky', top: 0, background: '#0f172a' }}><th style={thStyle}>Room</th>{slots.map(s => <th key={s} style={thStyle}>{s}</th>)}</tr></thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ ...tdStyle, color: 'white', fontWeight: 'bold' }}>{room}</td>
                      {slots.map((s, i) => (
                        <td key={s} style={tdStyle}>
                          <div style={{ padding: '6px', borderRadius: '4px', background: i % 4 === 0 ? '#ef444411' : '#22c55e11', color: i % 4 === 0 ? '#ef4444' : '#22c55e', fontSize: '0.65rem', textAlign: 'center' }}>
                            {i % 4 === 0 ? 'Blocked' : 'Free'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRIVILEGED USERS LIST */}
          <div style={{ background: '#0f172a', borderRadius: '20px', padding: '2rem', border: '1px solid #1e293b' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '1rem' }}>
              <ShieldCheck size={20} color="#a855f7" /> Elevated Access Register
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {mockUsers.filter(u => u.access === 'Master View').map(u => (
                <div key={u.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>{u.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{u.role} • {u.id}</div>
                  </div>
                  <UserCheck size={18} color="#a855f7" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const toggleBtn = { border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' };
const inputStyle = { width: '180px', padding: '0.6rem 1rem 0.6rem 2.2rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px', fontSize: '0.85rem' };
const searchBtnStyle = { background: '#3b82f6', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const rangeBar = { background: '#0f172a', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #1e293b' };
const dateInput = { background: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', outline: 'none' };
const monitorPanel = { background: '#1e293b', padding: '2rem', borderRadius: '24px', border: '1px solid #334155' };
const thStyle = { padding: '0.75rem', fontSize: '0.65rem', color: '#64748b', textAlign: 'center', borderBottom: '1px solid #334155' };
const tdStyle = { padding: '0.5rem', borderRight: '1px solid #1e293b' };

export default UserOverrideView;
