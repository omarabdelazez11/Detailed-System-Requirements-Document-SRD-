import React, { useState } from 'react';
import { Search, Filter, Check, X, Info, Clock, CheckCircle, XCircle } from 'lucide-react';

interface BookingRequest {
  id: string;
  user: string;
  room: string;
  date: string;
  time: string;
  type: 'Lecture' | 'Multi-Purpose';
  purpose: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
}

const BookingRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [search, setSearch] = useState('');
  
  const [requests, setRequests] = useState<BookingRequest[]>([
    { id: 'BK-101', user: 'Dr. Ahmed', room: 'Hall A', date: '2026-04-20', time: '10:00 - 12:00', type: 'Multi-Purpose', purpose: 'AI Seminar', status: 'Pending', submissionDate: '2026-04-15' },
    { id: 'BK-102', user: 'Sarah Ali', room: 'Room 302', date: '2026-04-21', time: '09:00 - 11:00', type: 'Lecture', purpose: 'Extra Section', status: 'Approved', submissionDate: '2026-04-16' },
    { id: 'BK-103', user: 'Zaid Omar', room: 'Hall B', date: '2026-04-18', time: '14:00 - 16:00', type: 'Multi-Purpose', purpose: 'Faculty Meeting', status: 'Rejected', submissionDate: '2026-04-14' },
  ]);

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesSearch = r.user.toLowerCase().includes(search.toLowerCase()) || r.room.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return { background: '#22c55e22', color: '#22c55e' };
      case 'Rejected': return { background: '#ef444422', color: '#ef4444' };
      default: return { background: '#f59e0b22', color: '#f59e0b' };
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={24} color="#3b82f6" /> All Booking Requests
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search user or room..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px', width: '250px' }}
            />
          </div>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ padding: '0.6rem 1rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem' }}>Request ID</th>
              <th style={{ padding: '1rem' }}>User / Employee</th>
              <th style={{ padding: '1rem' }}>Room & Type</th>
              <th style={{ padding: '1rem' }}>Event Schedule</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #1e293b', transition: 'background 0.2s' }}>
                <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>{req.id}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{req.user}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Submitted: {req.submissionDate}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div>{req.room}</div>
                  <span style={{ fontSize: '0.7rem', color: req.type === 'Multi-Purpose' ? '#22c55e' : '#3b82f6' }}>{req.type}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.9rem' }}>{req.date}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.time}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    ...getStatusStyle(req.status)
                  }}>
                    {req.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {req.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => alert('Approving...')} title="Approve" style={{ background: '#22c55e', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>
                        <Check size={16} />
                      </button>
                      <button onClick={() => alert('Rejecting...')} title="Reject" style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => alert('Edit mode opened for: ' + req.room)} style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => { if(confirm('Are you sure you want to cancel this booking?')) setRequests(requests.filter(r => r.id !== req.id)) }} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No requests found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequestsPage;
