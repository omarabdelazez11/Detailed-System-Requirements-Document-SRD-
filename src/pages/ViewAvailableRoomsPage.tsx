import React from 'react';
import { MapPin, Search, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ViewAvailableRoomsPage: React.FC = () => {
  const { rooms } = useSettings();

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Eye color="#3b82f6" /> View Available Rooms</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Real-time campus-wide room availability monitor.</p>
        </div>
        <div style={searchBar}>
           <Search size={16} color="#64748b" />
           <input placeholder="Search hall or lab..." style={searchInput} />
        </div>
      </div>

      <div style={roomGrid}>
        {rooms.map(room => (
          <div key={room} style={roomCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <div style={roomName}>{room}</div>
               <span style={availableBadge}><CheckCircle2 size={12} /> Available</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div style={detailItem}><MapPin size={12} /> <span>Ground Floor, Building A</span></div>
               <div style={capacityBadge}>Capacity: 50 Students</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const searchBar = { display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #1e293b', width: '300px' };
const searchInput = { background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.85rem' };
const roomGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' };
const roomCard = { background: '#0f172a', padding: '1.5rem', borderRadius: '20px', border: '1px solid #1e293b' };
const roomName = { color: 'white', fontWeight: 'bold', fontSize: '1rem' };
const availableBadge = { background: '#22c55e11', color: '#22c55e', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' };
const detailItem = { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem' };
const capacityBadge = { fontSize: '0.7rem', color: '#3b82f6', background: '#3b82f611', padding: '2px 8px', borderRadius: '4px', width: 'fit-content', marginTop: '4px' };

export default ViewAvailableRoomsPage;
