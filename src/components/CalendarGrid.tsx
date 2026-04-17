import React from 'react';

const CalendarGrid: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const slots = ['08:00', '10:00', '12:00', '14:00', '16:00'];

  const mockBookings = [
    { day: 'Mon', slot: '10:00', room: 'Room 101', type: 'Fixed', color: '#3b82f6' },
    { day: 'Wed', slot: '12:00', room: 'Hall A', type: 'Multi-Purpose', color: '#22c55e' },
    { day: 'Thu', slot: '14:00', room: 'Room 102', type: 'Exceptional', color: '#f59e0b' },
  ];

  return (
    <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Weekly Schedule Overview</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(7, 1fr)', gap: '1px', background: '#334155' }}>
        {/* Header */}
        <div style={{ background: '#1e293b', padding: '1rem' }}></div>
        {days.map(day => (
          <div key={day} style={{ background: '#1e293b', padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{day}</div>
        ))}

        {/* Rows */}
        {slots.map(slot => (
          <React.Fragment key={slot}>
            <div style={{ background: '#1e293b', padding: '1rem', textAlign: 'right', color: '#94a3b8' }}>{slot}</div>
            {days.map(day => {
              const booking = mockBookings.find(b => b.day === day && b.slot === slot);
              return (
                <div key={`${day}-${slot}`} style={{ background: '#0f172a', height: '80px', padding: '0.5rem', position: 'relative' }}>
                  {booking && (
                    <div style={{ 
                      background: booking.color, 
                      borderRadius: '4px', 
                      height: '100%', 
                      padding: '0.5rem', 
                      fontSize: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <strong>{booking.room}</strong>
                      <span>{booking.type}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
