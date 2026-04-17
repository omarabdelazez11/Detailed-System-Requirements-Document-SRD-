import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, List as ListIcon, User, Clock, CalendarDays, LayoutGrid, LayoutList, Columns } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const CalendarGrid: React.FC = () => {
  const { rooms, slots } = useSettings();
  const [displayMode, setDisplayMode] = useState<'Split' | 'Grid' | 'List'>('Split');
  const [timeMode, setTimeMode] = useState<'Week' | 'Month'>('Week');
  const [selectedRoom, setSelectedRoom] = useState('All Rooms');
  const [periodFilter, setPeriodFilter] = useState('Current Week');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate 16 Academic Weeks
  const academicWeeks = Array.from({ length: 16 }, (_, i) => {
    const n = i + 1;
    let suffix = 'th';
    if (n === 1) suffix = 'st';
    else if (n === 2) suffix = 'nd';
    else if (n === 3) suffix = 'rd';
    return `${n}${suffix} Week`;
  });

  // Mock Results
  const mockResults = [
    { id: 1, room: 'Hall A1', course: 'Intro to CS', lecturer: 'Dr. Ahmed', time: '08:30 AM - 10:00 AM', date: '2026-04-19', week: '5th Week' },
    { id: 2, room: 'Lab 101', course: 'Data Structures', lecturer: 'Dr. Hana', time: '10:20 AM - 11:50 AM', date: '2026-04-19', week: '5th Week' },
  ];

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CalendarIcon size={24} color="#3b82f6" />
            <h2 style={{ margin: 0 }}>{timeMode === 'Week' ? 'Master Schedule' : 'Month View'}</h2>
            <div style={timeToggle}>
              <button onClick={() => setTimeMode('Week')} style={timeBtn(timeMode === 'Week')}>Week</button>
              <button onClick={() => setTimeMode('Month')} style={timeBtn(timeMode === 'Month')}>Month</button>
            </div>
          </div>
          
          <div style={layoutToggleGroup}>
            <button onClick={() => setDisplayMode('Grid')} style={layoutBtn(displayMode === 'Grid')}><LayoutGrid size={16} /></button>
            <button onClick={() => setDisplayMode('Split')} style={layoutBtn(displayMode === 'Split')}><Columns size={16} /></button>
            <button onClick={() => setDisplayMode('List')} style={layoutBtn(displayMode === 'List')}><LayoutList size={16} /></button>
          </div>
        </div>

        <div style={filterBar}>
          <div style={filterGroup}>
            <MapPin size={16} color="#3b82f6" />
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} style={selectStyle}>
              <option value="All Rooms" style={optionStyle}>All Rooms</option>
              {rooms.map(r => <option key={r} value={r} style={optionStyle}>{r}</option>)}
            </select>
          </div>
          <div style={filterGroup}>
            <CalendarDays size={16} color="#64748b" />
            <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} style={selectStyle}>
              <option value="Current Week" style={optionStyle}>Current Week</option>
              {academicWeeks.map(w => <option key={w} value={w} style={optionStyle}>{w}</option>)}
              <option value="Full Semester (All Weeks)" style={optionStyle}>Full Semester (All Weeks)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: displayMode === 'Split' ? '1.7fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* GRID VIEW */}
        {(displayMode === 'Grid' || displayMode === 'Split') && (
          <div style={panelStyle}>
            {timeMode === 'Week' ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr><th style={thStyle}>Time</th>{daysOfWeek.map(d => <th key={d} style={thStyle}>{d}</th>)}</tr></thead>
                  <tbody>
                    {slots.map(slot => (
                      <tr key={slot}><td style={slotTd}>{slot}</td>{daysOfWeek.map(d => <td key={d} style={gridTd}><div style={gridPlaceholder}></div></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={monthGrid}>
                {daysOfWeek.map(d => <div key={d} style={monthHead}>{d}</div>)}
                {Array.from({ length: 31 }).map((_, i) => <div key={i} style={monthCell}>{i + 1}</div>)}
              </div>
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {(displayMode === 'List' || displayMode === 'Split') && (
          <div style={{ ...panelStyle, maxHeight: '600px', overflowY: 'auto' }}>
            <h3 style={listTitle}><ListIcon size={18} /> {periodFilter} Agenda</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockResults.map(item => (
                <div key={item.id} style={resultCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={badgeStyle}>{item.room}</span>
                    <span style={{ fontSize: '0.6rem', color: '#64748b' }}>{item.week}</span>
                  </div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.course}</div>
                  <div style={cardDetail}><User size={12} /> {item.lecturer}</div>
                  <div style={cardFooter}><Clock size={12} /> {item.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const timeToggle = { display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' };
const timeBtn = (active: boolean) => ({ background: active ? '#3b82f6' : 'transparent', color: active ? 'white' : '#64748b', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' });
const layoutToggleGroup = { display: 'flex', gap: '0.5rem', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #1e293b' };
const layoutBtn = (active: boolean) => ({ background: active ? '#3b82f6' : 'transparent', color: active ? 'white' : '#64748b', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' });
const filterBar = { display: 'flex', gap: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '16px', border: '1px solid #1e293b' };
const filterGroup = { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '10px' };
const selectStyle = { background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' };
const optionStyle = { background: '#1e293b', color: 'white' };
const panelStyle = { background: '#0f172a', borderRadius: '24px', padding: '1.5rem', border: '1px solid #1e293b' };
const thStyle = { padding: '1rem', color: '#64748b', fontSize: '0.7rem', borderBottom: '1px solid #1e293b' };
const slotTd = { padding: '1rem 0.75rem', fontSize: '0.7rem', color: '#e2e8f0', borderRight: '1px solid #1e293b', borderBottom: '1px solid #1e293b' };
const gridTd = { padding: '0.5rem', borderBottom: '1px solid #1e293b' };
const gridPlaceholder = { height: '35px', background: '#3b82f605', borderRadius: '4px' };
const monthGrid = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' };
const monthHead = { textAlign: 'center', color: '#64748b', fontSize: '0.7rem', padding: '0.5rem' };
const monthCell = { background: '#1e293b33', height: '80px', borderRadius: '12px', padding: '8px', border: '1px solid #1e293b', color: '#334155', fontSize: '0.75rem' };
const listTitle = { margin: '0 0 1.5rem 0', fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' };
const resultCard = { background: '#1e293b', padding: '1.25rem', borderRadius: '16px', border: '1px solid #334155' };
const badgeStyle = { fontSize: '0.6rem', color: '#3b82f6', fontWeight: 'bold', background: '#3b82f611', padding: '2px 8px', borderRadius: '4px' };
const cardDetail = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' };
const cardFooter = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '8px', marginTop: '10px' };

export default CalendarGrid;
