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
      {/* Sidebar - FIXED SCROLLING */}
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
            <p style={{ color: '#64748b', margin: '6px 0 0 0', fontSize: '0.9rem' }}>AASTMT Academic Management Dashboard • {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={() => setShowNotifications(!showNotifications)} style={notifBtn}><Bell size={22} /></button>
        </header>

        {view === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {stats.map(s => (
                <div key={s.label} style={statCard}>
                  <div style={{ background: `${s.color}15`, color: s.color, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: 'white', letterSpacing: '-0.5px' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
              <div style={chartCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h3 style={{ color: 'white', margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={20} color="#3b82f6" /> Weekly Booking Activity</h3>
                  <span style={{ fontSize: '0.75rem', color: '#22c55e', background: '#22c55e11', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>+12% vs Last Week</span>
                </div>
                <div style={barChartContainer}>
                   {[45, 78, 52, 90, 64, 42, 35].map((val, i) => (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                       <div style={{ width: '100%', maxWidth: '35px', height: `${val * 1.8}px`, background: i === 3 ? '#3b82f6' : '#1e293b', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                          {i === 3 && <div style={peakBadge}>{val}</div>}
                       </div>
                       <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div style={chartCard}>
                <h3 style={{ color: 'white', marginBottom: '2.5rem', fontSize: '1rem' }}>Resource Allocation</h3>
                <div style={pieContainer}>
                   <div style={pieContent}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>65%</div><div style={{ fontSize: '0.65rem', color: '#64748b' }}>Lectures</div></div>
                   <div style={pieRing}></div>
                </div>
                <div style={pieLegend}>
                  <div style={legendItem}><span style={{ ...dot, background: '#3b82f6' }}></span> <span>Lecture Halls</span> <span style={legendVal}>65%</span></div>
                  <div style={legendItem}><span style={{ ...dot, background: '#1e293b' }}></span> <span>Multi-Purpose</span> <span style={legendVal}>35%</span></div>
                </div>
              </div>
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

// Styles
const sidebarStyle: React.CSSProperties = { 
  width: '280px', 
  borderRight: '1px solid #1e293b', 
  padding: '2rem 1rem', 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '0.4rem', 
  position: 'sticky', 
  top: 0, 
  height: '100vh', 
  background: '#0f172a',
  overflowY: 'auto', // ENABLE SCROLLING
  scrollbarWidth: 'thin',
  scrollbarColor: '#3b82f6 #0f172a'
};

const SidebarButton: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.25rem', borderRadius: '14px', border: 'none', background: active ? '#3b82f6' : 'transparent', color: active ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: active ? '700' : '500', transition: '0.2s' }}>
    {React.cloneElement(icon, { size: 18 })} {label}
  </button>
);

const sideHeader = { padding: '1.5rem 1rem 0.6rem', fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase' as 'uppercase', fontWeight: '800', letterSpacing: '1px' };
const logoutBtn = { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', borderRadius: '12px', border: 'none', background: '#ef444415', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' };
const notifBtn = { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '0.75rem', color: '#94a3b8', cursor: 'pointer' };
const statCard = { background: '#0f172a', padding: '1.75rem', borderRadius: '24px', border: '1px solid #1e293b' };
const chartCard = { background: '#0f172a', padding: '2rem', borderRadius: '28px', border: '1px solid #1e293b' };
const barChartContainer = { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', gap: '1.25rem' };
const peakBadge = { position: 'absolute' as 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' };
const pieContainer = { width: '180px', height: '180px', margin: '0 auto', position: 'relative' as 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const pieContent = { textAlign: 'center' as 'center', zIndex: 10 };
const pieRing = { position: 'absolute' as 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '14px solid #1e293b', borderRadius: '50%', borderTopColor: '#3b82f6', borderRightColor: '#3b82f6', transform: 'rotate(45deg)' };
const pieLegend = { marginTop: '2.5rem', display: 'flex', flexDirection: 'column' as 'column', gap: '1rem' };
const legendItem = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#64748b' };
const dot = { width: '8px', height: '8px', borderRadius: '50%' };
const legendVal = { marginLeft: 'auto', color: 'white', fontWeight: 'bold' };
const statusBadge = (s: string) => ({ fontSize: '0.7rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px', background: s === 'Approved' ? '#22c55e15' : '#f59e0b15', color: s === 'Approved' ? '#22c55e' : '#f59e0b', textTransform: 'uppercase' as 'uppercase' });

export default DashboardPage;
