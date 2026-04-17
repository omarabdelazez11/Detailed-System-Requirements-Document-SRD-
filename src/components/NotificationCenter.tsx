import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Multi-Purpose Approved', msg: 'Branch Manager approved "AI Seminar" for Hall A.', type: 'VIP', time: '5m ago' },
    { id: '2', title: 'Manual Intervention', msg: 'Branch Manager modified booking #REQ-002.', type: 'VIP', time: '1h ago' },
  ]);

  return (
    <div className="card" style={{ padding: '1.5rem', width: '350px' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bell size={20} color="#f59e0b" /> VIP Notifications
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.map(n => (
          <div key={n.id} style={{ borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.875rem' }}>
              <ShieldAlert size={14} /> {n.title}
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{n.msg}</p>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
