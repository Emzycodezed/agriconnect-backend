import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const route = await login(phone, password);
      navigate(route, { replace: true });
    } catch (err) {
      const validationError = err?.response?.data?.errors?.[0]?.msg;
      setError(validationError || err?.response?.data?.message || err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: 'calc(100vh - 64px)',
      background: '#f7f4ef',
      display: 'grid',
      placeItems: 'center',
      padding: '40px 16px',
      fontFamily: '"DM Sans", sans-serif',
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp 0.6s ease both; }

        .field-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 2px solid #e8e2d9;
          background: #faf9f7;
          font-size: 14px;
          font-family: inherit;
          color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: #2d6a4f;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(45,106,79,0.1);
        }
        .field-input::placeholder { color: #aaa; }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 6px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #2d6a4f, #52b788);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(45,106,79,0.35);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(45,106,79,0.45);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e2d9, transparent);
          margin: 8px 0;
        }
      `}</style>

      <div className="login-card" style={{ width: '100%', maxWidth: '460px' }}>

        {/* ── Header banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1f0f 0%, #1b4332 50%, #2d6a4f 100%)',
          borderRadius: '24px 24px 0 0',
          padding: '36px 40px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Orbs */}
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', background:'radial-gradient(circle, rgba(134,239,172,0.15), transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:'160px', height:'160px', background:'radial-gradient(circle, rgba(230,100,30,0.15), transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

          <div style={{ position: 'relative' }}>
            <span style={{
              display:'inline-block', fontSize:'11px', fontWeight:700, letterSpacing:'0.18em',
              textTransform:'uppercase', color:'#86efac', background:'rgba(134,239,172,0.12)',
              border:'1px solid rgba(134,239,172,0.3)', padding:'4px 14px', borderRadius:'20px', marginBottom:'14px',
            }}>
              🌱 Zambia Agriculture Platform
            </span>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '10px',
            }}>
              Welcome Back
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6 }}>
              Sign in to your dashboard and access live market prices, AI advice, and your tools.
              <br />New here?{' '}
              <Link to="/register" style={{ color: '#86efac', fontWeight: 600, textDecoration: 'none' }}>Create an account →</Link>
            </p>
          </div>
        </div>

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit} style={{
          background: '#fff',
          borderRadius: '0 0 24px 24px',
          padding: '36px 40px',
          border: '2px solid #f0ebe3',
          borderTop: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}>

          {/* Quick-access role hints */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            {[
              { icon: '🌾', label: 'Farmer' },
              { icon: '🏪', label: 'Buyer' },
              { icon: '🏭', label: 'Supplier' },
              { icon: '🏛️', label: 'FRA' },
              { icon: '🤝', label: 'Cooperative' },
            ].map((r) => (
              <span key={r.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '20px',
                background: '#f0faf4', border: '1px solid #b7dfc7',
                fontSize: '12px', fontWeight: 600, color: '#2d6a4f',
              }}>
                {r.icon} {r.label}
              </span>
            ))}
          </div>

          <div className="divider" style={{ marginBottom: '24px' }} />

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label className="field-label">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+260 97X XXX XXX"
              required
              className="field-input"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '8px' }}>
            <label className="field-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="field-input"
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#fff5f5',
              border: '2px solid #fca5a5',
              color: '#b91c1c',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <div style={{ marginTop: '28px' }}>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Signing in...' : '🔑 Sign In'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#999' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2d6a4f', fontWeight: 700, textDecoration: 'none' }}>Register →</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}