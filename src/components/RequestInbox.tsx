import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const RequestInbox: React.FC = () => {
  const [requests, setRequests] = useState([
    { id: 'REQ-1', user: 'Dr. Ahmed', room: 'Hall A', date: '2026-04-20', type: 'Multi-Purpose', purpose: 'Seminar on AI' },
    { id: 'REQ-2', user: 'Eng. Sarah', room: 'Room 101', date: '2026-04-22', type: 'Lecture', purpose: 'Section 4' },
  ]);

  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleApprove = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    alert('Request approved!');
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    setRejecting(null);
    setReason('');
    alert('Request rejected with reason: ' + reason);
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Pending Requests</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map(req => (
          <div key={req.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '1rem', background: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ color: '#3b82f6' }}>{req.type}: {req.room}</h4>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>By: {req.user} | Date: {req.date}</p>
                <p style={{ marginTop: '0.5rem' }}>{req.purpose}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleApprove(req.id)}
                  style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer' }}
                >
                  <Check size={18} />
                </button>
                <button 
                  onClick={() => setRejecting(req.id)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {rejecting === req.id && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Rejection Reason & Suggestions</label>
                <textarea 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Room occupied. Try Room 102 instead."
                  style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '4px' }}
                />
                <button 
                  onClick={() => handleReject(req.id)}
                  style={{ marginTop: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  Confirm Rejection
                </button>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No pending requests.</p>
        )}
      </div>
    </div>
  );
};

export default RequestInbox;
