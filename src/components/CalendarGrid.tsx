import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarGrid: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Helper to get start of the week
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>{formatMonthYear(startOfWeek)}</h2>
          <div style={{ display: 'flex', background: '#0f172a', borderRadius: '8px', padding: '4px' }}>
            <button onClick={() => navigateWeek(-1)} style={navButtonStyle}><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentDate(new Date())} style={{ ...navButtonStyle, fontSize: '0.875rem', padding: '0 1rem' }}>Today</button>
            <button onClick={() => navigateWeek(1)} style={navButtonStyle}><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
              style={{ padding: '0.5rem 1rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px', cursor: 'pointer' }} 
            />
          </div>
          <select style={{ padding: '0.5rem 1rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px' }}>
            <option>Weekly View</option>
            <option>Monthly View</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <div style={{ minWidth: '800px' }}>
          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(7, 1fr)', borderBottom: '1px solid #334155' }}>
            <div style={{ padding: '1rem' }}></div>
            {weekDays.map((day, i) => (
              <div key={i} style={{ padding: '1rem', textAlign: 'center', borderLeft: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div style={{ fontSize: '1.25rem', color: day.toDateString() === new Date().toDateString() ? '#3b82f6' : 'white', fontWeight: 'bold' }}>{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timeSlots.map((time, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px repeat(7, 1fr)', borderBottom: '1px solid #1e293b', minHeight: '80px' }}>
                <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>{time}</div>
                {weekDays.map((_, j) => (
                  <div key={j} style={{ borderLeft: '1px solid #1e293b', position: 'relative', padding: '4px' }}>
                    {/* Placeholder for random bookings for visualization */}
                    {Math.random() > 0.85 && (
                      <div style={{ 
                        background: '#3b82f633', 
                        borderLeft: '4px solid #3b82f6', 
                        borderRadius: '4px', 
                        padding: '8px', 
                        fontSize: '0.75rem', 
                        height: '100%',
                        color: 'white'
                      }}>
                        Fixed Lecture
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '6px',
  transition: 'background 0.2s'
};

export default CalendarGrid;
