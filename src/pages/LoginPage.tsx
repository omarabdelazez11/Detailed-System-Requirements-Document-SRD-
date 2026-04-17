import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    employeeId: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Sign In
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Create a pending user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          employeeId: formData.employeeId,
          status: 'Pending', // Account is not active automatically
          createdAt: serverTimestamp()
        });

        // Sign out immediately so they can't access dashboard until approved
        await auth.signOut();
        setMessage('Sign-up request sent! An Admin or Branch Manager will review and approve your account.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
      <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '450px', borderRadius: '16px', background: '#1e293b', color: 'white' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>AASTMT Booking</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>
          {isLogin ? 'Welcome back! Please sign in.' : 'Create a new account request.'}
        </p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{message}</div>}

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
              </div>
              <div className="input-group">
                <label>Employee ID</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} required style={inputStyle} />
              </div>
              <div className="input-group">
                <label>Requested Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>
                  <option value="Employee">Employee</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={inputStyle} />
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={inputStyle} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
            {isLogin ? 'Sign In' : 'Submit Request'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: 'white',
  marginTop: '0.25rem'
};

export default LoginPage;
