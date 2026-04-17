import React, { useState } from 'react';
import { Settings, Clock, Upload, Plus, Trash2 } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [slots, setSlots] = useState([
    { id: '1', from: '08:00', to: '10:00' },
    { id: '2', from: '10:00', to: '12:00' },
  ]);

  const [rooms, setRooms] = useState([
    { id: '1', name: 'Room 101', type: 'Lecture' },
    { id: '2', name: 'Hall A', type: 'Multi-Purpose' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Time Slot Management */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="#3b82f6" /> Booking Time Slots
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Adjust durations (e.g., for Ramadan hours).</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {slots.map(slot => (
            <div key={slot.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#0f172a', padding: '0.5rem', borderRadius: '6px' }}>
              <input type="time" defaultValue={slot.from} style={{ background: 'transparent', border: '1px solid #334155', color: 'white', padding: '4px' }} />
              <span>to</span>
              <input type="time" defaultValue={slot.to} style={{ background: 'transparent', border: '1px solid #334155', color: 'white', padding: '4px' }} />
              <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
            </div>
          ))}
          <button className="btn" style={{ background: '#1e293b', marginTop: '0.5rem', fontSize: '0.875rem' }}><Plus size={16} /> Add Slot</button>
        </div>
      </div>

      {/* Room Management */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="#22c55e" /> Room Management
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {rooms.map(room => (
            <div key={room.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '1rem', background: '#0f172a', position: 'relative' }}>
              <strong>{room.name}</strong>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{room.type}</div>
              <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Upload */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={20} color="#f59e0b" /> Fixed Schedule Upload
        </h3>
        <div style={{ border: '2px dashed #334155', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Drag and drop CSV/Excel file or click to browse</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Upload File</button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
