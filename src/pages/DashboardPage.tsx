import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="container" style={{ padding: '2rem', color: 'white', background: '#0f172a', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <button onClick={() => auth.signOut()} style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Logout</button>
      </header>
      <div className="card" style={{ padding: '2rem', background: '#1e293b', borderRadius: '12px' }}>
        <h2>Welcome, {userProfile?.name || 'User'}!</h2>
        <p>Role: {userProfile?.role || 'Guest'}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
