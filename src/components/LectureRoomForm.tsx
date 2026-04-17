import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Phone, Briefcase, Mic, Laptop, Video, MapPin, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { AASTMT_SLOTS, AASTMT_DOUBLE_SLOTS, ROOM_DATABASE } from '../utils/timeUtils';
import { useAuth } from '../context/AuthContext';

interface FormProps { onSuccess?: () => void; }

const LectureRoomForm: React.FC<FormProps> = ({ onSuccess }) => {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({ room: '', date: '', timeSlot: '', course: '' });

  const timeSlots = AASTMT_SLOTS;
  const rooms = ROOM_DATABASE.filter(r => r.includes('Hall') || r.includes('Lab'));
  
  const isManager = userProfile?.role === 'BranchManager';
  const isEmployee = userProfile?.role === 'Employee';

  // DYNAMIC TIME LOCK (24h for Employee, 48h for Secretary/Others)
  const isDateValid = useMemo(() => {
    if (!formData.date) return false;
    if (isManager) return true;

    const selectedDate = new Date(formData.date);
    const now = new Date();
    const leadTimeHours = isEmployee ? 24 : 48;
    const threshold = new Date(now.getTime() + (leadTimeHours * 60 * 60 * 1000));
    
    return selectedDate >= threshold;
  }, [formData.date, isManager, isEmployee]);

  const canSubmit = formData.room && formData.date && formData.timeSlot && formData.course && (isManager || isDateValid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newBooking = {
      id: `BK-${Math.floor(Math.random() * 900 + 100)}`,
      requesterId: userProfile?.id,
      requesterName: userProfile?.name,
      room: formData.room,
      date: formData.date,
      time: formData.timeSlot,
      status: isManager ? 'Approved' : 'Pending',
      type: 'Lecture',
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('aastmt_all_bookings') || '[]');
    localStorage.setItem('aastmt_all_bookings', JSON.stringify([newBooking, ...existing]));

    alert(isManager ? 'Instant Lecture Booking Confirmed!' : 'Lecture Request submitted for academic approval!');
    if (onSuccess) onSuccess();
  };

  const inputStyle = { width: '100%', padding: '0.85rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '12px', outline: 'none' };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <BookOpen size={28} color="#3b82f6" /> Lecture Room Request
        </h2>
        {isManager && <span style={managerBadge}><CheckCircle size={14} /> Executive Privilege Active</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group">
          <label style={labelStyle}><MapPin size={14} /> Select Room</label>
          <select value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} required style={inputStyle}>
            <option value="">Select a Room</option>
            {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label style={labelStyle}>Date</label>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
            required 
            style={{ ...inputStyle, borderColor: (formData.date && !isDateValid && !isManager) ? '#ef4444' : '#334155' }} 
          />
          {formData.date && !isDateValid && !isManager && (
            <span style={errorTxt}><AlertTriangle size={12} /> Minimum {isEmployee ? '24h' : '48h'} lead time required</span>
          )}
        </div>
      </div>

      <div className="input-group" style={{ marginTop: '1.5rem' }}>
        <label style={labelStyle}><Clock size={14} /> Choose Time Period</label>
        <select value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} required style={inputStyle}>
          <option value="">Select a Time Slot</option>
          {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
        </select>
      </div>

      <div className="input-group" style={{ marginTop: '1.5rem' }}>
        <label style={labelStyle}>Purpose / Course Name</label>
        <input type="text" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required style={inputStyle} placeholder="e.g. CS101 Lecture" />
      </div>

      <button 
        type="submit" 
        disabled={!canSubmit} 
        style={!canSubmit ? disabledSubmit : (isManager ? managerSubmit : standardSubmit)}
      >
        {isManager ? 'Confirm Instant Lecture Booking' : (!isDateValid && formData.date ? `Select a Date > ${isEmployee ? '24h' : '48h'}` : 'Submit Request')}
      </button>
    </form>
  );
};

// Styles
const labelStyle = { color: '#64748b', fontSize: '0.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' };
const standardSubmit = { width: '100%', marginTop: '2.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const managerSubmit = { width: '100%', marginTop: '2.5rem', background: '#22c55e', color: 'white', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 0 20px #22c55e33' };
const disabledSubmit = { width: '100%', marginTop: '2.5rem', background: '#1e293b', color: '#475569', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 'bold', cursor: 'not-allowed', fontSize: '1rem' };
const managerBadge = { background: '#22c55e15', color: '#22c55e', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' };
const errorTxt = { color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' };

export default LectureRoomForm;
