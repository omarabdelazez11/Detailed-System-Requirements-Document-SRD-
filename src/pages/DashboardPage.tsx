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
import ViewAvailableRoomsPage from './ViewAvailableRoomsPage';
import { Plus, List, LogOut, Layout, Calendar, Inbox, Settings, Users, Bell, FileText, ClipboardList, ShieldCheck, Clock, MapPin, CheckCircle, AlertCircle, BarChart3, PieChart, TrendingUp, UserCheck, ShieldAlert, Gavel, Eye, Activity, ArrowUpRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [view, setView] = useState<'overview' | 'my-requests' | 'book-multi' | 'book-lecture' | 'calendar' | 'inbox' | 'users' | 'settings' | 'report' | 'all-bookings' | 'fixed-schedule' | 'authority' | 'final-approvals' | 'view-rooms'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const stats = [
    { label: 'Total Bookings', value: '1,284', icon: <TrendingUp />, color: '#3b82f6' },
    { label: 'Pending Apps', value: '12', icon: <Clock />, color: '#f59e0b' },
    { label: 'Room Utilization', value: '78%', icon: <Layout />, color: '#22c55e' },
    { label: 'Active Users', value: '450', icon: <UserCheck />, color: '#a855f7' },
  ];

  const isAdmin = userProfile?.role === 'Admin' || userProfile?.role === 'BranchManager';
  const handleBookingSuccess = () => setView('my-requests');

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={{ color: '#3b82f6', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', fontSize: '1.25rem' }}>
          <ShieldCheck size={28} /> AASTMT Core
        </h2>
        
        {isAdmin && <SidebarButton icon={<BarChart3 />} label="Admin Overview" active={view === 'overview'} onClick={() => setView('overview')} />}
        <SidebarButton icon={<List />} label="My Requests" active={view === 'my-requests'} onClick={() => setView('my-requests')} />
        
        {isAdmin && (
          <>
            <div style={sideHeader}>Management</div>
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

        <div style={sideHeader}>Booking</div>
        <SidebarButton icon={<Eye />} label="View Available Rooms" active={view === 'view-rooms'} onClick={() => setView('view-rooms')} />
        <SidebarButton icon={<Plus />} label="Lecture Room" active={view === 'book-lecture'} onClick={() => setView('book-lecture')} />
        <SidebarButton icon={<Plus />} label="Multi-Purpose" active={view === 'book-multi'} onClick={() => setView('book-multi')} />

        <button onClick={() => auth.signOut()} style={logoutBtn}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.85rem' }}>Welcome, {userProfile?.name || 'Manager'}</h1>
            <p style={{ color: '#64748b', margin: '6px 0 0 0', fontSize: '0.9rem' }}>Academic Management Dashboard • {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={() => setShowNotifications(!showNotifications)} style={notifBtn}><Bell size={22} /></button>
        </header>

        {view === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {stats.map(s => (
                <div key={s.label} style={statCard}>
                  <div style={{ background: `${s.color}15`, color: s.color, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: 'white' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Charts would go here */}
          </div>
        )}

        {view === 'my-requests' && (
          <div>
            <h2 style={{ color: 'white', marginBottom: '2rem' }}>My Personal Requests</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                { id: 'MY-001', room: 'Hall A1', date: '2026-04-20', time: '10:20 AM', status: 'Approved' },
                { id: 'MY-002', room: 'Lab 101', date: '2026-04-22', time: '08:30 AM', status: 'Pending' }
              ].map(req => (
                <div key={req.id} style={statCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <MapPin size={22} color="#3b82f6" />
                    <span style={statusBadge(req.status)}>{req.status}</span>
                  </div>
                  <h3 style={{ color: 'white', margin: '0 0 0.75rem 0' }}>{req.room}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', borderTop: '1px solid #1e293b', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
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
        {view === 'view-rooms' && <ViewAvailableRoomsPage />}
      </main>

      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

const SidebarButton: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.25rem', borderRadius: '14px', border: 'none', background: active ? '#3b82f6' : 'transparent', color: active ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: active ? '700' : '500', transition: '0.2s' }}>
    {React.cloneElement(icon, { size: 18 })} {label}
  </button>
);

const sidebarStyle: React.CSSProperties = { width: '280px', borderRight: '1px solid #1e293b', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'sticky', top: 0, height: '100vh', background: '#0f172a', overflowY: 'auto' };
const sideHeader = { padding: '1.5rem 1rem 0.6rem', fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase' as 'uppercase', fontWeight: '800' };
const logoutBtn = { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', borderRadius: '12px', border: 'none', background: '#ef444415', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' };
const notifBtn = { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '0.75rem', color: '#94a3b8', cursor: 'pointer' };
const statCard = { background: '#0f172a', padding: '1.75rem', borderRadius: '24px', border: '1px solid #1e293b' };
const statusBadge = (s: string) => ({ fontSize: '0.7rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px', background: s === 'Approved' ? '#22c55e15' : '#f59e0b15', color: s === 'Approved' ? '#22c55e' : '#f59e0b', textTransform: 'uppercase' as 'uppercase' });

export default DashboardPage;
