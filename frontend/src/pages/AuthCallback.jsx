import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      navigate('/?error=auth_failed', { replace: true });
      return;
    }

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Hard redirect to dashboard — forces full React re-init with token present
      window.location.replace('/dashboard');
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      gap: 16
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '3px solid #1e40af',
        borderTopColor: '#60a5fa',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#93c5fd', fontSize: 14, fontFamily: 'sans-serif' }}>
        Signing you in...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallback;
