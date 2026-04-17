import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, MapPin } from 'lucide-react';
import { AASTMT_SLOTS, AASTMT_DOUBLE_SLOTS, ROOM_DATABASE } from '../utils/timeUtils';

const LectureRoomForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'Lecture',
    room: '',
    date: '',
    timeSlot: '',
    purpose: ''
  });

  const timeSlots = [...AASTMT_SLOTS, ...AASTMT_DOUBLE_SLOTS];
  const rooms = ROOM_DATABASE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Lecture Request:', formData);
    alert('Lecture request submitted successfully!');
  };

  const inputStyle = { width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={24} color="#3b82f6" /> Lecture Room Request
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Note: Requests are evaluated against fixed schedules and existing bookings.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
        <div className="input-group">
          <label><MapPin size={16} style={{ marginRight: '4px' }} /> Select Room</label>
          <select 
            value={formData.room}
            onChange={(e) => setFormData({...formData, room: e.target.value})}
            required
            style={inputStyle}
          >
            <option value="">Select a Room</option>
            {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label><Calendar size={16} style={{ marginRight: '4px' }} /> Date</label>
          <input 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <label><Clock size={16} style={{ marginRight: '4px' }} /> Choose Time Period</label>
        <select 
          value={formData.timeSlot}
          onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
          required
          style={inputStyle}
        >
          <option value="">Select a Time Slot</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Purpose / Course Name</label>
        <input 
          type="text"
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          required
          placeholder="e.g. CS101 Lecture"
          style={inputStyle}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Submit Request</button>
    </form>
  );
};

export default LectureRoomForm;
