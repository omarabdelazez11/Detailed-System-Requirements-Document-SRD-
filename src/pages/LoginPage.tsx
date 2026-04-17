import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <form onSubmit={handleLogin} className="card" style={{ padding: '2rem', width: '350px', borderRadius: '12px', background: '#1e293b', color: 'white' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>AASTMT Login</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Employee Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        </div>
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        </div>
        <button type="submit" className="btn" style={{ width: '100%', padding: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
