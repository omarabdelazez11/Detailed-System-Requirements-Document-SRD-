import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import MultiPurposeForm from '../components/MultiPurposeForm';
import LectureRoomForm from '../components/LectureRoomForm';
import CalendarGrid from '../components/CalendarGrid';
import RequestInbox from '../components/RequestInbox';
import UserManagement from '../components/UserManagement';
import SystemSettings from '../components/SystemSettings';
import NotificationCenter from '../components/NotificationCenter';
import DailyReport from '../components/DailyReport';
import FixedSchedule from '../components/FixedSchedule';
import BookingRequestsPage from '../pages/BookingRequestsPage';
import AuthorityManagementPage from './AuthorityManagementPage';
import ManagerApprovalPage from './ManagerApprovalPage';
import { Plus, List, LogOut, Layout, Calendar, Inbox, Settings, Users, Bell, FileText, ClipboardList, ShieldCheck, Clock, MapPin, CheckCircle, AlertCircle, BarChart3, PieChart, TrendingUp, UserCheck, ShieldAlert, Gavel } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [view, setView] = useState<'overview' | 'my-requests' | 'book-multi' | 'book-lecture' | 'calendar' | 'inbox' | 'users' | 'settings' | 'report' | 'all-bookings' | 'fixed-schedule' | 'authority' | 'final-approvals'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Data
  const [myBookings] = useState([
    { id: 'MY-001', room: 'Hall A1', date: '2026-04-20', time: '10:20 AM', status: 'Approved', type: 'Lecture' },
    { id: 'MY-002', room: 'Lab 101', date: '2026-04-22', time: '08:30 AM', status: 'Pending', type: 'Multi-Purpose' },
  ]);

  const stats = [
    { label: 'Total Bookings', value: '1,284', icon: <TrendingUp />, color: '#3b82f6' },
    { label: 'Pending Apps', value: '12', icon: <Clock />, color: '#f59e0b' },
    { label: 'Room Utilization', value: '78%', icon: <Layout />, color: '#22c55e' },
    { label: 'Active Users', value: '450', icon: <UserCheck />, color: '#a855f7' },
  ];

  const isAdmin = userProfile?.role === 'Admin' || userProfile?.role === 'BranchManager';
  const handleBookingSuccess = () => setView('my-requests');

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid #334155', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'sticky', top: 0, height: '100vh' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem' }}>
          <ShieldCheck size={28} /> AASTMT Core
        </h2>
        
        {isAdmin && <SidebarButton icon={<BarChart3 />} label="Admin Overview" active={view === 'overview'} onClick={() => setView('overview')} />}
        <SidebarButton icon={<List />} label="My Requests" active={view === 'my-requests'} onClick={() => setView('my-requests')} />
        
        {isAdmin && (
          <>
            <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Management</div>
            <SidebarButton icon={<Calendar />} label="Calendar Grid" active={view === 'calendar'} onClick={() => setView('calendar')} />
            <SidebarButton icon={<Inbox />} label="Account Inbox" active={view === 'inbox'} onClick={() => setView('inbox')} />
            <SidebarButton icon={<ClipboardList />} label="Booking Requests" active={view === 'all-bookings'} onClick={() => setView('all-bookings')} />
            <SidebarButton icon={<ShieldCheck />} label="Fixed Schedule" active={view === 'fixed-schedule'} onClick={() => setView('fixed-schedule')} />
            <SidebarButton icon={<ShieldAlert />} label="Authority Engine" active={view === 'authority'} onClick={() => setView('authority')} />
            {userProfile?.role === 'BranchManager' && <SidebarButton icon={<Gavel />} label="Final Approvals" active={view === 'final-approvals'} onClick={() => setView('final-approvals')} />}
            <SidebarButton icon={<Users />} label="User Management" active={view === 'users'} onClick={() => setView('users')} />
            <SidebarButton icon={<Settings />} label="System Settings" active={view === 'settings'} onClick={() => setView('settings')} />
          </>
        )}

        <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Booking</div>
        <SidebarButton icon={<Plus />} label="Lecture Room" active={view === 'book-lecture'} onClick={() => setView('book-lecture')} />
        <SidebarButton icon={<Plus />} label="Multi-Purpose" active={view === 'book-multi'} onClick={() => setView('book-multi')} />

        <button onClick={() => auth.signOut()} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', margin: 0 }}>Welcome, {userProfile?.name || 'Admin'}</h1>
            <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Academic Management Dashboard • {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '0.75rem', color: 'white', cursor: 'pointer' }}><Bell size={20} /></button>
        </header>

        {view === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '20px', border: '1px solid #334155' }}>
                  <div style={{ background: `${s.color}22`, color: s.color, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'my-requests' && (
          <div>
            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>My Personal Requests</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {myBookings.map(req => (
                <div key={req.id} style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <MapPin size={20} color="#3b82f6" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', background: req.status === 'Approved' ? '#22c55e22' : '#f59e0b22', color: req.status === 'Approved' ? '#22c55e' : '#f59e0b' }}>{req.status}</span>
                  </div>
                  <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{req.room}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                    <span>{req.date}</span>
                    <span>{req.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'calendar' && <CalendarGrid />}
        {view === 'inbox' && <RequestInbox />}
        {view === 'book-multi' && <MultiPurposeForm onSuccess={handleBookingSuccess} />}
        {view === 'book-lecture' && <LectureRoomForm onSuccess={handleBookingSuccess} />}
        {view === 'users' && <UserManagement />}
        {view === 'all-bookings' && <BookingRequestsPage />}
        {view === 'settings' && <SystemSettings />}
        {view === 'report' && <DailyReport />}
        {view === 'fixed-schedule' && <FixedSchedule />}
        {view === 'authority' && <AuthorityManagementPage />}
        {view === 'final-approvals' && <ManagerApprovalPage />}
      </main>

      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

const SidebarButton: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', background: active ? '#3b82f611' : 'transparent', color: active ? '#3b82f6' : 'white', cursor: 'pointer', textAlign: 'left', fontWeight: active ? 'bold' : 'normal', transition: 'all 0.2s' }}>
    {React.cloneElement(icon, { size: 20 })}
    {label}
  </button>
);

export default DashboardPage;
