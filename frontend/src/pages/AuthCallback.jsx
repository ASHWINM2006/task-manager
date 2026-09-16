import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Read token from URL query string manually (avoids useSearchParams re-render loop)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      navigate('/?error=auth_failed', { replace: true });
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      fetchUser().then(() => {
        navigate('/dashboard', { replace: true });
      });
    } else {
      navigate('/', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '3px solid #1e40af', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#93c5fd', fontSize: 14 }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallback;
