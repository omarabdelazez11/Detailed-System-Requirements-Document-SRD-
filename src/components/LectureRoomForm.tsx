import React, { useState } from 'react';
import { BookOpen, Calendar, Clock } from 'lucide-react';

const LectureRoomForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'Lecture',
    date: '',
    fromTime: '',
    toTime: '',
    purpose: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Lecture Request:', formData);
    alert('Lecture request submitted blindly. Admin will review availability.');
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={24} color="#3b82f6" /> Lecture Room Request
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Note: Requests are blind. The system will validate availability after submission.
      </p>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
        <label>Purpose / Course Name</label>
        <input 
          type="text"
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          required
          placeholder="e.g. Moving online lecture to offline"
          style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Submit Request</button>
    </form>
  );
};

export default LectureRoomForm;
