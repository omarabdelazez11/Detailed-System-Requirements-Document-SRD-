import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Briefcase, Mic, Laptop, Video } from 'lucide-react';

const MultiPurposeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    room: '',
    date: '',
    fromTime: '',
    toTime: '',
    purpose: '',
    managerName: '',
    managerJob: '',
    managerPhone: '',
    mics: false,
    micQty: 1,
    laptop: false,
    videoConf: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    alert('Request submitted for approval!');
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={24} color="#3b82f6" /> Multi-Purpose Room Request
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group">
          <label>Requested Room</label>
          <select 
            value={formData.room} 
            onChange={(e) => setFormData({...formData, room: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
          >
            <option value="">Select Room</option>
            <option value="Hall A">Hall A</option>
            <option value="Hall B">Hall B</option>
          </select>
        </div>

        <div className="input-group">
          <label>Date</label>
          <input 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
          />
        </div>

        <div className="input-group">
          <label><Clock size={16} style={{ marginRight: '4px' }} /> From Time</label>
          <input 
            type="time" 
            value={formData.fromTime}
            onChange={(e) => setFormData({...formData, fromTime: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
          />
        </div>

        <div className="input-group">
          <label><Clock size={16} style={{ marginRight: '4px' }} /> To Time</label>
          <input 
            type="time" 
            value={formData.toTime}
            onChange={(e) => setFormData({...formData, toTime: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
          />
        </div>
      </div>

      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>Purpose of Event</label>
        <textarea 
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          required
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px', minHeight: '80px' }}
        />
      </div>

      <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: '#3b82f6' }}>Event Manager Details</h3>
      <div style={{ display: 'grid', gridTemplate-columns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group">
          <label><User size={16} style={{ marginRight: '4px' }} /> Name</label>
          <input type="text" value={formData.managerName} onChange={(e) => setFormData({...formData, managerName: e.target.value})} required style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }} />
        </div>
        <div className="input-group">
          <label><Briefcase size={16} style={{ marginRight: '4px' }} /> Job Title</label>
          <input type="text" value={formData.managerJob} onChange={(e) => setFormData({...formData, managerJob: e.target.value})} required style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }} />
        </div>
      </div>
      <div className="input-group">
        <label><Phone size={16} style={{ marginRight: '4px' }} /> Mobile Number</label>
        <input type="tel" value={formData.managerPhone} onChange={(e) => setFormData({...formData, managerPhone: e.target.value})} required style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }} />
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
