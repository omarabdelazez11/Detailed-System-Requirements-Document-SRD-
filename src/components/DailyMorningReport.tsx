import React from 'react';
import { FileText, MapPin, Clock, User, Wrench, ShieldAlert, CheckCircle, Printer, Send } from 'lucide-react';

const DailyMorningReport: React.FC = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Mock Data: Only Approved events that are OUTSIDE the fixed schedule
  const exceptionEvents = [
    { 
      id: 'EX-501', 
      room: 'Conference Hall B', 
      user: 'Dr. Sarah Smith', 
      type: 'Multi-Purpose', 
      time: '10:30 AM - 12:00 PM', 
      tech: 'Projector, 4 Microphones, Video Conferencing setup',
      status: 'Confirmed'
    },
    { 
      id: 'EX-702', 
      room: 'Main Auditorium', 
      user: 'Engineering Dept', 
      type: 'Exceptional Lecture', 
      time: '02:00 PM - 03:30 PM', 
      tech: 'Stage Lighting, Laptop HDMI connection',
      status: 'Confirmed'
    }
  ];

  return (
    <div className="card" style={{ padding: '2.5rem', background: '#0f172a', border: '1px solid #334155' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', borderBottom: '1px solid #1e293b', paddingBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
            <FileText size={28} />
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Daily Operations Briefing</h1>
          </div>
          <p style={{ color: '#64748b', margin: 0 }}>Campus Maintenance & IT Preparation Plan • {today}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={actionBtn}><Printer size={18} /> Print for Staff</button>
          <button style={{ ...actionBtn, background: '#3b82f6', color: 'white' }}><Send size={18} /> Send to IT Team</button>
        </div>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
          <ShieldAlert size={20} color="#f59e0b" /> Exceptional Events (Outside Fixed Schedule)
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>These rooms require manual preparation and technical verification before the start times listed below.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {exceptionEvents.map(ev => (
          <div key={ev.id} style={reportRow}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={roomBadge}><MapPin size={14} /> {ev.room}</span>
                <span style={typeBadge(ev.type)}>{ev.type}</span>
              </div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>{ev.tech}</div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {ev.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {ev.user}</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'right', borderLeft: '1px solid #334155', paddingLeft: '2rem' }}>
              <div style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                <CheckCircle size={14} /> {ev.status}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <button style={prepBtn}><Wrench size={14} /> Mark as Prepared</button>
              </div>
            </div>
          </div>
        ))}
        {exceptionEvents.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#334155', background: '#1e293b55', borderRadius: '16px' }}>
            <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
            <p>No exceptional events scheduled for today. Normal timetable applies.</p>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '4rem', padding: '1.5rem', background: '#1e293b', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ background: '#3b82f622', padding: '10px', borderRadius: '50%' }}><Wrench size={20} color="#3b82f6" /></div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
          <strong>Note to Admin:</strong> This report highlights rooms that need manual technical setup. Please ensure IT staff have verified the sound and projection systems at least 30 minutes prior to the start times.
        </p>
      </footer>
    </div>
  );
};

const actionBtn = { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', borderRadius: '10px', background: '#1e293b', color: 'white', border: '1px solid #334155', fontWeight: 'bold', cursor: 'pointer' };
const reportRow = { background: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const roomBadge = { background: '#3b82f622', color: '#3b82f6', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' };
const typeBadge = (type: string) => ({ background: type === 'Multi-Purpose' ? '#f59e0b22' : '#a855f722', color: type === 'Multi-Purpose' ? '#f59e0b' : '#a855f7', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' });
const prepBtn = { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

export default DailyMorningReport;
