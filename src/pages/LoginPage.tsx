import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(id, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={pageStyle}>
      <div style={loginCard}>
        <div style={headerSection}>
          <div style={logoCircle}><ShieldCheck size={32} color="#3b82f6" /></div>
          <h1 style={titleStyle}>AASTMT Management</h1>
          <p style={subtitleStyle}>Academic Room & Hall Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorBox}>{error}</div>}
          
          <div style={inputContainer}>
            <label style={labelStyle}>Staff ID / Username</label>
            <div style={fieldWrapper}>
              <User size={18} color="#64748b" style={fieldIcon} />
              <input 
                type="text" 
                value={id} 
                onChange={(e) => setId(e.target.value)} 
                placeholder="e.g. admin_aastmt" 
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={inputContainer}>
            <label style={labelStyle}>Secure Password</label>
            <div style={fieldWrapper}>
              <Lock size={18} color="#64748b" style={fieldIcon} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                style={inputStyle}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={eyeBtn}
              >
                {showPassword ? <EyeOff size={18} color="#3b82f6" /> : <Eye size={18} color="#64748b" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} style={submitBtn}>
            {isLoading ? 'Verifying...' : 'Access Dashboard'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={footerStyle}>
          <p>Don't have an account? <span style={linkStyle}>Register Staff ID</span></p>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle: React.CSSProperties = { minHeight: '100vh', background: '#020617', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, system-ui, sans-serif' };
const loginCard: React.CSSProperties = { background: '#0f172a', padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '450px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const headerSection: React.CSSProperties = { textAlign: 'center', marginBottom: '2.5rem' };
const logoCircle = { background: '#3b82f611', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' };
const titleStyle = { color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '800' };
const subtitleStyle = { color: '#64748b', margin: 0, fontSize: '0.9rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
const inputContainer = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const labelStyle = { color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', marginLeft: '4px' };
const fieldWrapper = { position: 'relative' as 'relative', display: 'flex', alignItems: 'center' };
const fieldIcon = { position: 'absolute' as 'absolute', left: '1rem' };
const inputStyle = { width: '100%', padding: '0.85rem 3rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none' };
const eyeBtn = { position: 'absolute' as 'absolute', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const submitBtn = { marginTop: '1rem', background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: '0.2s' };
const errorBox = { background: '#ef444411', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' as 'center', border: '1px solid #ef444433' };
const footerStyle = { marginTop: '2.5rem', textAlign: 'center' as 'center', color: '#64748b', fontSize: '0.85rem' };
const linkStyle = { color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' };

export default LoginPage;
