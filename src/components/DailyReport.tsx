import React from 'react';
import { FileText, Download } from 'lucide-react';

const DailyReport: React.FC = () => {
  const reports = [
    { room: 'Hall A', user: 'Dr. Ahmed', type: 'Multi-Purpose', time: '10:00 - 14:00', tech: '2 Mics, Laptop' },
    { room: 'Room 101', user: 'Eng. Sarah', type: 'Exceptional Lecture', time: '12:00 - 14:00', tech: 'None' },
  ];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} color="#3b82f6" /> Daily Morning Report (Today)
        </h3>
        <button className="btn btn-primary" style={{ fontSize: '0.875rem', gap: '0.5rem' }}>
          <Download size={16} /> Export PDF
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reports.map((r, i) => (
          <div key={i} style={{ padding: '1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Room</div>
                <strong>{r.room}</strong>
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>User</div>
                <strong>{r.user}</strong>
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Time</div>
                <strong>{r.time}</strong>
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Technical Req.</div>
                <strong>{r.tech}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyReport;
