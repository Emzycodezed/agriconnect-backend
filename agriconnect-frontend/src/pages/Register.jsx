import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  role: 'farmer',
  language: 'nyanja',
  lat: '',
  lng: '',
  district: '',
  ward: '',
  farm_size_ha: '',
  crops: '',
};

const roleOptions = [
  { value: 'farmer',    icon: '🌾', label: 'Farmer' },
  { value: 'buyer',     icon: '🏪', label: 'Buyer' },
  { value: 'supplier',  icon: '🏭', label: 'Supplier' },
  { value: 'extension', icon: '🤝', label: 'Extension' },
  { value: 'admin',     icon: '⚙️', label: 'Admin' },
];

const langOptions = [
  { value: 'nyanja',  label: 'Nyanja' },
  { value: 'bemba',   label: 'Bemba' },
  { value: 'english', label: 'English' },
];

export default function Register() {
  const [form, setForm]       = useState(initialForm);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        name:     form.name.trim(),
        phone:    form.phone.trim(),
        password: form.password,
        role:     form.role,
      };
      if (form.email.trim())    payload.email    = form.email.trim();
      if (form.language)        payload.language = form.language;
      if (form.lat !== '')      payload.lat      = form.lat;
      if (form.lng !== '')      payload.lng      = form.lng;
      if (form.role === 'farmer') {
        if (form.district.trim())   payload.district     = form.district.trim();
        if (form.ward.trim())       payload.ward         = form.ward.trim();
        if (form.farm_size_ha !== '') payload.farm_size_ha = Number(form.farm_size_ha);
        if (form.crops.trim())      payload.crops        = form.crops.trim();
      }
      await api.post('/auth/register', payload);
      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions.find((r) => r.value === form.role);

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
        .reg-card { animation: fadeUp 0.6s ease both; }

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

        .role-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 2px solid #e8e2d9;
          background: #faf9f7;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          transition: all 0.2s;
          font-family: inherit;
          white-space: nowrap;
        }
        .role-chip:hover { border-color: #2d6a4f; color: #2d6a4f; }
        .role-chip.active {
          border-color: #2d6a4f;
          background: #d8f3dc;
          color: #1b4332;
          box-shadow: 0 2px 12px rgba(45,106,79,0.15);
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

        .farmer-section {
          background: linear-gradient(135deg, #f0faf4, #e8f5ed);
          border: 2px solid #b7dfc7;
          border-radius: 18px;
          padding: 24px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e2d9, transparent);
          margin: 8px 0;
        }
      `}</style>

      <div className="reg-card" style={{ width: '100%', maxWidth: '680px' }}>

        {/* ── Header card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1f0f 0%, #1b4332 50%, #2d6a4f 100%)',
          borderRadius: '24px 24px 0 0',
          padding: '36px 40px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* orbs */}
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', background:'radial-gradient(circle, rgba(134,239,172,0.15), transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:'160px', height:'160px', background:'radial-gradient(circle, rgba(230,100,30,0.15), transparent 70%)', borderRadius:'50%' }} />

          <div style={{ position:'relative' }}>
            <span style={{
              display:'inline-block', fontSize:'11px', fontWeight:700, letterSpacing:'0.18em',
              textTransform:'uppercase', color:'#86efac', background:'rgba(134,239,172,0.12)',
              border:'1px solid rgba(134,239,172,0.3)', padding:'4px 14px', borderRadius:'20px', marginBottom:'14px',
            }}>
              🌱 Zambia Agriculture Platform
            </span>
            <h1 style={{
              fontFamily:'"Playfair Display", serif', fontWeight:900,
              fontSize:'clamp(1.8rem, 4vw, 2.6rem)', color:'#fff', lineHeight:1.1, marginBottom:'10px',
            }}>
              Create Your Account
            </h1>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'14px', lineHeight:1.6 }}>
              Join farmers, buyers, suppliers, FRA, and cooperatives on one platform.
              <br />Already registered?{' '}
              <Link to="/login" style={{ color:'#86efac', fontWeight:600, textDecoration:'none' }}>Sign in here →</Link>
            </p>
          </div>
        </div>

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit} style={{
          background:'#fff',
          borderRadius:'0 0 24px 24px',
          padding:'36px 40px',
          border:'2px solid #f0ebe3',
          borderTop:'none',
          boxShadow:'0 20px 60px rgba(0,0,0,0.08)',
        }}>

          {/* Role selector */}
          <div style={{ marginBottom:'28px' }}>
            <span className="field-label">I am a</span>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {roleOptions.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-chip${form.role === r.value ? ' active' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                >
                  <span>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Core fields */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginTop:'24px' }}>
            <div>
              <label className="field-label">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chanda Mwale" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+260 97X XXX XXX" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="optional" className="field-input" />
            </div>
            <div>
              <label className="field-label">Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="min 6 characters" required className="field-input" />
            </div>
          </div>

          {/* Language + Location */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginTop:'16px' }}>
            <div>
              <label className="field-label">Language</label>
              <select name="language" value={form.language} onChange={handleChange} className="field-input" style={{ appearance:'none', cursor:'pointer' }}>
                {langOptions.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Latitude</label>
              <input name="lat" value={form.lat} onChange={handleChange} type="number" step="0.00000001" placeholder="optional" className="field-input" />
            </div>
            <div>
              <label className="field-label">Longitude</label>
              <input name="lng" value={form.lng} onChange={handleChange} type="number" step="0.00000001" placeholder="optional" className="field-input" />
            </div>
          </div>

          {/* Farmer-only section */}
          {form.role === 'farmer' && (
            <div className="farmer-section" style={{ marginTop:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                <span style={{ fontSize:'22px' }}>🌾</span>
                <div>
                  <p style={{ fontFamily:'"Playfair Display", serif', fontWeight:700, fontSize:'16px', color:'#1b4332', margin:0 }}>Farmer Profile</p>
                  <p style={{ fontSize:'12px', color:'#52b788', margin:0 }}>Tell us about your farm to personalise your AI advice</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div>
                  <label className="field-label" style={{ color:'#2d6a4f' }}>District</label>
                  <input name="district" value={form.district} onChange={handleChange} placeholder="e.g. Lusaka" className="field-input" />
                </div>
                <div>
                  <label className="field-label" style={{ color:'#2d6a4f' }}>Ward</label>
                  <input name="ward" value={form.ward} onChange={handleChange} placeholder="e.g. Chelstone" className="field-input" />
                </div>
                <div>
                  <label className="field-label" style={{ color:'#2d6a4f' }}>Farm Size (ha)</label>
                  <input name="farm_size_ha" value={form.farm_size_ha} onChange={handleChange} type="number" min="0" step="0.01" placeholder="e.g. 5.0" className="field-input" />
                </div>
                <div>
                  <label className="field-label" style={{ color:'#2d6a4f' }}>Crops Grown</label>
                  <input name="crops" value={form.crops} onChange={handleChange} placeholder="e.g. Maize, Soybeans" className="field-input" />
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {error && (
            <div style={{
              marginTop:'20px', padding:'14px 18px', borderRadius:'12px',
              background:'#fff5f5', border:'2px solid #fca5a5', color:'#b91c1c',
              fontSize:'14px', display:'flex', alignItems:'center', gap:'10px',
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{
              marginTop:'20px', padding:'14px 18px', borderRadius:'12px',
              background:'#f0faf4', border:'2px solid #86efac', color:'#1b4332',
              fontSize:'14px', display:'flex', alignItems:'center', gap:'10px',
            }}>
              ✅ {success}
            </div>
          )}

          {/* Submit */}
          <div style={{ marginTop:'28px' }}>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Creating account...' : `🌱 Register as ${selectedRole?.label}`}
            </button>
            <p style={{ textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#999' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#2d6a4f', fontWeight:700, textDecoration:'none' }}>Sign in →</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}