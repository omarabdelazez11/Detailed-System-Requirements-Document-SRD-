import React, { useState, useMemo } from 'react';
import { Settings, MapPin, Clock, Plus, Trash2, Edit3, Save, Zap, Calendar, Hash, Timer, ArrowRight, ShieldCheck, AlertCircle, Gavel } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SystemSettings: React.FC = () => {
  const { rooms, slots, addRoom, deleteRoom, setSlots } = useSettings();
  const [newRoom, setNewRoom] = useState('');
  
  // Policy States (The "Rules")
  const [policies, setPolicies] = useState({
    minLeadTime: 48, // The famous 48-hour rule
    maxDailySlots: 3,
    emergencyWindow: 12,
    allowAutoApprove: false
  });

  // Generator States
  const [genStart, setGenStart] = useState('08:30');
  const [genDuration, setGenDuration] = useState(90);
  const [genBreak, setGenBreak] = useState(20);
  const [genCount, setGenCount] = useState(5);

  const calculatedEnd = useMemo(() => {
    let current = new Date(`2026-01-01T${genStart}:00`);
    for (let i = 0; i < genCount; i++) {
      current = new Date(current.getTime() + genDuration * 60000);
      if (i < genCount - 1) current = new Date(current.getTime() + genBreak * 60000);
    }
    return current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [genStart, genDuration, genBreak, genCount]);

  const handleGenerate = () => {
    const newSlots: string[] = [];
    let currentTime = new Date(`2026-01-01T${genStart}:00`);
    for (let i = 0; i < genCount; i++) {
      const startStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = new Date(currentTime.getTime() + genDuration * 60000);
      const endStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      newSlots.push(`${startStr} - ${endStr}`);
      currentTime = new Date(endTime.getTime() + genBreak * 60000);
    }
    setSlots(newSlots);
    alert("Campus Reconfigured Successfully!");
  };

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <Settings size={32} color="#3b82f6" />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Global System Configuration</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage campus infrastructure, timing logic, and system rules.</p>
        </div>
      </div>

      {/* GLOBAL POLICY MANAGER (THE RULES) */}
      <div style={policyCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'white' }}>
          <Gavel size={22} color="#ef4444" /> <h3>Global Policy & Access Rules</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Min Lead Time (Hrs)</label>
            <input type="number" value={policies.minLeadTime} onChange={e => setPolicies({...policies, minLeadTime: parseInt(e.target.value)})} style={inputStyle} />
            <p style={hintText}>Standard 48-hour restriction</p>
          </div>
          <div>
            <label style={labelStyle}>Max Daily Slots / User</label>
            <input type="number" value={policies.maxDailySlots} onChange={e => setPolicies({...policies, maxDailySlots: parseInt(e.target.value)})} style={inputStyle} />
            <p style={hintText}>Prevent room hogging</p>
          </div>
          <div>
            <label style={labelStyle}>Emergency Window (Hrs)</label>
            <input type="number" value={policies.emergencyWindow} onChange={e => setPolicies({...policies, emergencyWindow: parseInt(e.target.value)})} style={inputStyle} />
            <p style={hintText}>Last-minute approval buffer</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <button onClick={() => alert("Global Policies Updated & Published!")} style={publishBtn}>Publish Global Rules</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        <div style={sectionCard}>
          <h3 style={sectionTitle}><MapPin size={20} color="#3b82f6" /> Campus Rooms</h3>
          <div style={inputGroup}>
            <input value={newRoom} onChange={e => setNewRoom(e.target.value)} placeholder="Add Room..." style={inputStyle} />
            <button onClick={() => { if(newRoom) addRoom(newRoom); setNewRoom(''); }} style={addBtn}><Plus size={20} /></button>
          </div>
          <div style={listScroll}>{rooms.map(room => <div key={room} style={listItem}><span>{room}</span><button onClick={() => deleteRoom(room)} style={delBtn}><Trash2 size={16} /></button></div>)}</div>
        </div>

        <div style={sectionCard}>
          <h3 style={sectionTitle}><Clock size={20} color="#f59e0b" /> Academic Time Slots</h3>
          <div style={listScroll}>{slots.map((slot, i) => <div key={i} style={listItem}><span style={{ color: 'white', fontWeight: 'bold' }}>{slot}</span><Trash2 size={16} color="#64748b" /></div>)}</div>
        </div>
      </div>

      <div style={generatorCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div><h3 style={{ margin: 0, color: 'white' }}>Precision Schedule Generator</h3><p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Daily Finish Time: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{calculatedEnd}</span></p></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div><label style={labelStyle}>Start Time</label><input type="time" value={genStart} onChange={e => setGenStart(e.target.value)} style={genInput} /></div>
          <div><label style={labelStyle}>Duration (m)</label><input type="number" value={genDuration} onChange={e => setGenDuration(parseInt(e.target.value))} style={genInput} /></div>
          <div><label style={labelStyle}>Break (m)</label><input type="number" value={genBreak} onChange={e => setGenBreak(parseInt(e.target.value))} style={genInput} /></div>
          <div><label style={labelStyle}>Slot Count</label><input type="number" value={genCount} onChange={e => setGenCount(parseInt(e.target.value))} style={genInput} /></div>
        </div>
        <button onClick={handleGenerate} style={generateBtn}>Deploy New Campus Schedule</button>
      </div>
    </div>
  );
};

// Styles
const policyCard = { background: '#0f172a', padding: '2rem', borderRadius: '24px', border: '1px solid #ef444433', marginBottom: '2.5rem' };
const publishBtn = { background: '#ef4444', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const hintText = { fontSize: '0.65rem', color: '#64748b', marginTop: '4px', fontStyle: 'italic' };
const sectionCard = { background: '#0f172a', padding: '1.5rem', borderRadius: '20px', border: '1px solid #1e293b' };
const sectionTitle = { display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', marginTop: 0, marginBottom: '1.5rem', fontSize: '1rem' };
const inputGroup = { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' };
const inputStyle = { flex: 1, background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '0.75rem 1rem', borderRadius: '10px', outline: 'none' };
const labelStyle = { color: '#64748b', fontSize: '0.7rem', marginBottom: '8px', display: 'block' };
const addBtn = { background: '#3b82f6', color: 'white', border: 'none', width: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const listScroll = { maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const listItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#1e293b', borderRadius: '10px', color: '#94a3b8', fontSize: '0.85rem' };
const delBtn = { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' };
const generatorCard = { background: '#0f172a', padding: '2rem', borderRadius: '24px', border: '1px solid #3b82f633' };
const genInput = { width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '0.85rem', borderRadius: '12px', outline: 'none' };
const generateBtn = { width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' };

export default SystemSettings;
