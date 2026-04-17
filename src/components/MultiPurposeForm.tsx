import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Phone, Briefcase, Mic, Laptop, Video, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { AASTMT_SLOTS, AASTMT_DOUBLE_SLOTS, ROOM_DATABASE } from '../utils/timeUtils';
import { useAuth } from '../context/AuthContext';

const MultiPurposeForm: React.FC = () => {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    room: '',
    date: '',
    timeSlot: '',
    purpose: '',
    managerName: userProfile?.name || '',
    managerJob: userProfile?.role || '',
    managerPhone: '',
    mics: false,
    micQty: 1,
    laptop: false,
    videoConf: false
  });

  const timeSlots = [...AASTMT_SLOTS, ...AASTMT_DOUBLE_SLOTS];
  const rooms = ROOM_DATABASE;
  const isManager = userProfile?.role === 'BranchManager';

  // 48-HOUR VALIDATION LOGIC
  const isDateValid = useMemo(() => {
    if (!formData.date) return false;
    if (isManager) return true; // Manager bypasses 48h rule

    const selectedDate = new Date(formData.date);
    const now = new Date();
    const fortyEightHoursLater = new Date(now.getTime() + (48 * 60 * 60 * 1000));
    
    // Reset hours for a clean date comparison if needed, or keep precise
    return selectedDate >= fortyEightHoursLater;
  }, [formData.date, isManager]);

  const canSubmit = formData.room && formData.date && formData.timeSlot && formData.purpose && (isManager || isDateValid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isManager) {
      alert('Branch Manager Privilege: Instant Booking Confirmed!');
    } else {
      alert('Multi-Purpose Request submitted for academic approval!');
    }
  };

  const inputStyle = { width: '100%', padding: '0.85rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '12px', outline: 'none' };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', maxWidth: '850px', margin: '0 auto', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <Calendar size={28} color="#3b82f6" /> Multi-Purpose Room Request
        </h2>
        {isManager && <span style={managerBadge}><CheckCircle size={14} /> Executive Privilege Active</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group">
          <label style={labelStyle}><MapPin size={14} /> Requested Room</label>
          <select value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} required style={inputStyle}>
            <option value="">Select Room</option>
            {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label style={labelStyle}>Target Date</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
            required 
            style={{ ...inputStyle, borderColor: (formData.date && !isDateValid && !isManager) ? '#ef4444' : '#334155' }} 
          />
          {formData.date && !isDateValid && !isManager && (
            <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
              <AlertTriangle size={12} /> Bookings must be made 48h in advance
            </span>
          )}
        </div>
      </div>

      <div className="input-group" style={{ marginTop: '1.5rem' }}>
        <label style={labelStyle}><Clock size={14} /> Available Time Window</label>
        <select value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} required style={inputStyle}>
          <option value="">Select Time Slot</option>
          {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
        </select>
      </div>

      <div className="input-group" style={{ marginTop: '1.5rem' }}>
        <label style={labelStyle}>Event Description & Purpose</label>
        <textarea value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} required style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} placeholder="Provide a brief summary of the event activities..." />
      </div>

      <h3 style={subHeader}>Technical Support & Equipment</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', background: '#1e293b55', padding: '1.5rem', borderRadius: '16px' }}>
        <label style={checkLabel}>
          <input type="checkbox" checked={formData.mics} onChange={(e) => setFormData({...formData, mics: e.target.checked})} style={checkboxStyle} />
          <Mic size={18} /> Microphones
          {formData.mics && <input type="number" value={formData.micQty} onChange={(e) => setFormData({...formData, micQty: parseInt(e.target.value)})} min="1" style={smallInput} />}
        </label>
        <label style={checkLabel}>
          <input type="checkbox" checked={formData.laptop} onChange={(e) => setFormData({...formData, laptop: e.target.checked})} style={checkboxStyle} />
          <Laptop size={18} /> Laptop Station
        </label>
        <label style={checkLabel}>
          <input type="checkbox" checked={formData.videoConf} onChange={(e) => setFormData({...formData, videoConf: e.target.checked})} style={checkboxStyle} />
          <Video size={18} /> Video Conferencing
        </label>
      </div>

      <button 
        type="submit" 
        disabled={!canSubmit} 
        style={!canSubmit ? disabledSubmit : (isManager ? managerSubmit : standardSubmit)}
      >
        {isManager ? 'Confirm Instant Executive Booking' : (!isDateValid && formData.date ? 'Select a Date > 48h' : 'Submit for Academic Approval')}
      </button>
    </form>
  );
};

// Styles
const labelStyle = { color: '#64748b', fontSize: '0.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' };
const subHeader = { margin: '2rem 0 1rem', fontSize: '1rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' as 'uppercase', letterSpacing: '1px' };
const checkLabel = { display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' };
const checkboxStyle = { width: '18px', height: '18px', accentColor: '#3b82f6' };
const smallInput = { width: '50px', marginLeft: '8px', padding: '4px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '4px' };
const standardSubmit = { width: '100%', marginTop: '2.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const managerSubmit = { width: '100%', marginTop: '2.5rem', background: '#22c55e', color: 'white', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 0 20px #22c55e33' };
const disabledSubmit = { width: '100%', marginTop: '2.5rem', background: '#1e293b', color: '#475569', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 'bold', cursor: 'not-allowed', fontSize: '1rem' };
const managerBadge = { background: '#22c55e15', color: '#22c55e', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' };

export default MultiPurposeForm;
