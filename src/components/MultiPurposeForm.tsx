import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Briefcase, Mic, Laptop, Video, MapPin } from 'lucide-react';
import { AASTMT_SLOTS, AASTMT_DOUBLE_SLOTS, ROOM_DATABASE } from '../utils/timeUtils';

const MultiPurposeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    room: '',
    date: '',
    timeSlot: '',
    purpose: '',
    managerName: '',
    managerJob: '',
    managerPhone: '',
    mics: false,
    micQty: 1,
    laptop: false,
    videoConf: false
  });

  const timeSlots = [...AASTMT_SLOTS, ...AASTMT_DOUBLE_SLOTS];
  const rooms = ROOM_DATABASE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    alert('Multi-Purpose Request submitted for approval!');
  };

  const inputStyle = { width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={24} color="#3b82f6" /> Multi-Purpose Room Request
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group">
          <label><MapPin size={16} style={{ marginRight: '4px' }} /> Requested Room</label>
          <select 
            value={formData.room} 
            onChange={(e) => setFormData({...formData, room: e.target.value})}
            required
            style={inputStyle}
          >
            <option value="">Select Room</option>
            {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label>Date</label>
          <input 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label><Clock size={16} style={{ marginRight: '4px' }} /> Time Period (90m Slots)</label>
        <select 
          value={formData.timeSlot}
          onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
          required
          style={inputStyle}
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>Purpose of Event</label>
        <textarea 
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          required
          style={{ ...inputStyle, minHeight: '80px' }}
        />
      </div>

      <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: '#3b82f6' }}>Event Manager Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group">
          <label><User size={16} style={{ marginRight: '4px' }} /> Name</label>
          <input type="text" value={formData.managerName} onChange={(e) => setFormData({...formData, managerName: e.target.value})} required style={inputStyle} />
        </div>
        <div className="input-group">
          <label><Briefcase size={16} style={{ marginRight: '4px' }} /> Job Title</label>
          <input type="text" value={formData.managerJob} onChange={(e) => setFormData({...formData, managerJob: e.target.value})} required style={inputStyle} />
        </div>
      </div>
      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label><Phone size={16} style={{ marginRight: '4px' }} /> Mobile Number</label>
        <input type="tel" value={formData.managerPhone} onChange={(e) => setFormData({...formData, managerPhone: e.target.value})} required style={inputStyle} />
      </div>

      <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: '#3b82f6' }}>Technical Requirements</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={formData.mics} onChange={(e) => setFormData({...formData, mics: e.target.checked})} />
          <Mic size={18} /> Microphones
          {formData.mics && <input type="number" value={formData.micQty} onChange={(e) => setFormData({...formData, micQty: parseInt(e.target.value)})} min="1" style={{ width: '50px', marginLeft: '5px', padding: '2px', background: '#0f172a', color: 'white', border: '1px solid #334155' }} />}
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={formData.laptop} onChange={(e) => setFormData({...formData, laptop: e.target.checked})} />
          <Laptop size={18} /> Laptop
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={formData.videoConf} onChange={(e) => setFormData({...formData, videoConf: e.target.checked})} />
          <Video size={18} /> Video Conference
        </label>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Submit Booking Request</button>
    </form>
  );
};

export default MultiPurposeForm;
