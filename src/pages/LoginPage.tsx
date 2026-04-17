import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Sign In with Employee ID
        let targetEmail = formData.email;

        // Hardcoded bypass for Fixed Admin Account
        if (formData.employeeId === '1234' && formData.password === '1234') {
          sessionStorage.setItem('mock_user', 'true');
          window.location.reload(); // Refresh to trigger AuthContext mock check
          return;
        }

        // Real logic: Find email by employeeId in Firestore
        const q = query(collection(db, 'users'), where('employeeId', '==', formData.employeeId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Employee ID not found.');
        }

        targetEmail = querySnapshot.docs[0].data().email;
        await signInWithEmailAndPassword(auth, targetEmail, formData.password);
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Create a pending user profile (Role is NOT selected by user)
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          employeeId: formData.employeeId,
          role: 'Pending', // Admin will assign the role later
          status: 'Pending',
          createdAt: serverTimestamp()
        });

        await auth.signOut();
        setMessage('Sign-up request sent! An Admin will review your data and assign your role.');
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
          {isLogin ? 'Sign in with your Employee ID.' : 'Request access to the system.'}
        </p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{message}</div>}

        <form onSubmit={handleAuth}>
          {isLogin ? (
            <div className="input-group">
              <label>Employee ID</label>
              <input type="text" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} required style={inputStyle} />
            </div>
          ) : (
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
                <label>Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={inputStyle} />
              </div>
            </>
          )}

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
            {isLogin ? "Request Access (Sign Up)" : "Back to Sign In"}
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
