import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import MultiPurposeForm from '../components/MultiPurposeForm';
import LectureRoomForm from '../components/LectureRoomForm';
import CalendarGrid from '../components/CalendarGrid';
import RequestInbox from '../components/RequestInbox';
import UserManagement from '../components/UserManagement';
import SystemSettings from '../components/SystemSettings';
import { Plus, List, LogOut, Layout, Calendar, Inbox, Settings, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [view, setView] = useState<'overview' | 'book-multi' | 'book-lecture' | 'calendar' | 'inbox' | 'users' | 'settings'>('overview');

  const mockRequests = [
    { id: '1', room: 'Hall A', date: '2026-04-20', status: 'Approved', type: 'Multi-Purpose' },
    { id: '2', room: 'Room 101', date: '2026-04-22', status: 'Pending', type: 'Lecture' },
  ];

  const isAdmin = userProfile?.role === 'Admin' || userProfile?.role === 'BranchManager';
  const canBookLecture = isAdmin || userProfile?.role === 'Employee';

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid #334155', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
          <Layout size={24} /> AASTMT Booking
        </h2>
        
        <SidebarButton icon={<List />} label="My Requests" active={view === 'overview'} onClick={() => setView('overview')} />
        
        {isAdmin && (
          <>
            <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Management</div>
            <SidebarButton icon={<Calendar />} label="Calendar Grid" active={view === 'calendar'} onClick={() => setView('calendar')} />
            <SidebarButton icon={<Inbox />} label="Request Inbox" active={view === 'inbox'} onClick={() => setView('inbox')} />
            <SidebarButton icon={<Users />} label="User Management" active={view === 'users'} onClick={() => setView('users')} />
            <SidebarButton icon={<Settings />} label="System Settings" active={view === 'settings'} onClick={() => setView('settings')} />
          </>
        )}

        <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Booking</div>
        {canBookLecture && <SidebarButton icon={<Plus />} label="Book Lecture Room" active={view === 'book-lecture'} onClick={() => setView('book-lecture')} />}
        <SidebarButton icon={<Plus />} label="Book Multi-Purpose" active={view === 'book-multi'} onClick={() => setView('book-multi')} />

        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => auth.signOut()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#94a3b8' }}>Welcome back,</p>
            <h1 style={{ color: 'white' }}>{userProfile?.name || 'User'}</h1>
            <span style={{ fontSize: '0.75rem', background: '#3b82f6', padding: '2px 8px', borderRadius: '12px' }}>{userProfile?.role || 'Guest'}</span>
          </div>
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

        {view === 'calendar' && <CalendarGrid />}
        {view === 'inbox' && <RequestInbox />}
        {view === 'book-multi' && <MultiPurposeForm />}
        {view === 'book-lecture' && <LectureRoomForm />}
        {view === 'users' && <UserManagement />}
        {view === 'settings' && <SystemSettings />}
      </main>
    </div>
  );
};

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem 1rem', 
      borderRadius: '8px', 
      border: 'none', 
      background: active ? '#1e293b' : 'transparent', 
      color: active ? '#3b82f6' : 'white', 
      cursor: 'pointer', 
      textAlign: 'left',
      width: '100%',
      transition: 'all 0.2s ease'
    }}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    {label}
  </button>
);

export default DashboardPage;
