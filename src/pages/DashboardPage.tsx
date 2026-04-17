import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import MultiPurposeForm from '../components/MultiPurposeForm';
import LectureRoomForm from '../components/LectureRoomForm';
import { Plus, List, LogOut, Layout } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [view, setView] = useState<'overview' | 'book-multi' | 'book-lecture'>('overview');

  const mockRequests = [
    { id: '1', room: 'Hall A', date: '2026-04-20', status: 'Approved', type: 'Multi-Purpose' },
    { id: '2', room: 'Room 101', date: '2026-04-22', status: 'Pending', type: 'Lecture' },
  ];

  const canBookLecture = userProfile?.role === 'Admin' || userProfile?.role === 'BranchManager' || userProfile?.role === 'Employee';
  const canBookMulti = true; // Everyone can book multi-purpose

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', borderRight: '1px solid #334155', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layout size={24} /> AASTMT
        </h2>
        
        <button 
          onClick={() => setView('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', background: view === 'overview' ? '#1e293b' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left' }}
        >
          <List size={20} /> My Requests
        </button>

        {canBookLecture && (
          <button 
            onClick={() => setView('book-lecture')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', background: view === 'book-lecture' ? '#1e293b' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left' }}
          >
            <Plus size={20} /> Book Lecture Room
          </button>
        )}

        <button 
          onClick={() => setView('book-multi')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', background: view === 'book-multi' ? '#1e293b' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left' }}
        >
          <Plus size={20} /> Book Multi-Purpose
        </button>

        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => auth.signOut()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#94a3b8' }}>Welcome back,</p>
          <h1 style={{ color: 'white' }}>{userProfile?.name || 'User'}</h1>
          <span style={{ fontSize: '0.75rem', background: '#3b82f6', padding: '2px 8px', borderRadius: '12px' }}>{userProfile?.role || 'Guest'}</span>
        </header>

        {view === 'overview' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Your Recent Requests</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '1rem' }}>Room</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockRequests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid #334155', color: 'white' }}>
                    <td style={{ padding: '1rem' }}>{req.room}</td>
                    <td style={{ padding: '1rem' }}>{req.date}</td>
                    <td style={{ padding: '1rem' }}>{req.type}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: req.status === 'Approved' ? '#22c55e' : '#f59e0b' }}>{req.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'book-multi' && <MultiPurposeForm />}
        {view === 'book-lecture' && <LectureRoomForm />}
      </main>
    </div>
  );
};

export default DashboardPage;
