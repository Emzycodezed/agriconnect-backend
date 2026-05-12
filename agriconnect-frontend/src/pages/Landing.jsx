import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

/* ─── Ticker cards – infinite horizontal marquee ─── */
const marqueeCards = [
  { emoji: '🌽', label: 'Maize', stat: 'K2,450/bag', sub: 'Live market price' },
  { emoji: '🫘', label: 'Soya Beans', stat: 'K890/kg', sub: 'Updated today' },
  { emoji: '🌿', label: 'Cotton', stat: 'K340/kg', sub: 'FRA rate' },
  { emoji: '🍠', label: 'Cassava', stat: 'K120/kg', sub: 'Lusaka depot' },
  { emoji: '🌻', label: 'Sunflower', stat: 'K410/kg', sub: 'Cooperative price' },
  { emoji: '🥜', label: 'Groundnuts', stat: 'K1,200/bag', sub: 'Premium grade' },
  { emoji: '🌾', label: 'Wheat', stat: 'K680/kg', sub: 'Milling grade' },
  { emoji: '🫛', label: 'Mixed Beans', stat: 'K950/kg', sub: 'Export quality' },
];

/* ─── Feature cards for slow upward scroll strip ─── */
const featureCards = [
  {
    icon: '📊',
    title: 'Live Price Visibility',
    desc: 'Real-time market prices across all provinces so every negotiation starts with facts, not guesswork.',
    tag: 'Market',
    accent: '#2d6a4f',
  },
  {
    icon: '🤖',
    title: 'AI Farm Advisor',
    desc: 'Practical crop guidance tailored to your soil type, weather forecast, and planting calendar.',
    tag: 'AI',
    accent: '#b5451b',
  },
  {
    icon: '👥',
    title: 'Role Dashboards',
    desc: 'Farmers, buyers, suppliers, FRA, cooperatives, and admins all get purpose-built workflows.',
    tag: 'Roles',
    accent: '#e07b39',
  },
  {
    icon: '🔐',
    title: 'Secure Identity',
    desc: 'JWT-protected sessions keep every account safe across all six role types.',
    tag: 'Security',
    accent: '#1b4332',
  },
  {
    icon: '🚜',
    title: 'Procurement Engine',
    desc: 'Structured buying workflows for FRA, cooperatives, and institutional buyers.',
    tag: 'FRA',
    accent: '#6b3a2a',
  },
  {
    icon: '🌍',
    title: 'National Reach',
    desc: 'Connect rural smallholders to urban markets and international buyers through one platform.',
    tag: 'Scale',
    accent: '#386641',
  },
  {
    icon: '📦',
    title: 'Inventory Tracking',
    desc: "Know what's in stock at every depot, warehouse, and cooperative store in real time.",
    tag: 'Logistics',
    accent: '#8b5e3c',
  },
  {
    icon: '🌦️',
    title: 'Weather Integration',
    desc: 'Seasonal forecasts and rainfall alerts help farmers plan harvest and storage timing.',
    tag: 'Weather',
    accent: '#2980b9',
  },
];

/* ─── Stats ─── */
const stats = [
  { value: '6', label: 'User Roles' },
  { value: '24/7', label: 'Market Access' },
  { value: 'AI', label: 'Advisory Engine' },
  { value: '100%', label: 'Zambia-Focused' },
];

/* ─── Marquee component ─── */
function Marquee({ items, speed = 32, reverse = false }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div
        style={{
          display: 'flex',
          gap: '16px',
          width: 'max-content',
          animation: `marquee${reverse ? 'Rev' : ''} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((c, i) => (
          <div
            key={i}
            style={{
              minWidth: '180px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '14px 18px',
              backdropFilter: 'blur(8px)',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{c.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', fontFamily: '"Playfair Display", serif' }}>{c.label}</div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#86efac', fontFamily: 'monospace' }}>{c.stat}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Vertical scroll strip ─── */
function VerticalStrip({ cards, reverse = false, speed = 28 }) {
  const doubled = [...cards, ...cards];
  return (
    <div style={{ overflow: 'hidden', height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          animation: `vscroll${reverse ? 'Rev' : ''} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((c, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: '18px',
              padding: '18px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              border: `2px solid ${c.accent}22`,
              minHeight: '130px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '26px' }}>{c.icon}</span>
              <span style={{
                background: c.accent,
                color: '#fff',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>{c.tag}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', fontFamily: '"Playfair Display", serif', marginBottom: '6px' }}>{c.title}</div>
            <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <main style={{ fontFamily: '"DM Sans", sans-serif', background: '#f7f4ef', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Google Fonts injection ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRev {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes vscroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes vscrollRev {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.6rem, 6vw, 5.2rem);
          line-height: 1.05;
          color: #fff;
          animation: fadeUp 0.8s ease both;
        }
        .hero-sub {
          animation: fadeUp 0.8s 0.2s ease both;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .hero-cta {
          animation: fadeUp 0.8s 0.4s ease both;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .stat-card {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 16px 20px;
          text-align: center;
          transition: transform 0.25s;
        }
        .stat-card:hover { transform: translateY(-4px) scale(1.04); }
        .pill-btn {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pill-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .ticker-row { padding: 6px 0; }
        .section-label {
          display: inline-block;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 700;
          color: #2d6a4f;
          background: #d8f3dc;
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }
        .section-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: #1a1a1a;
          line-height: 1.1;
        }
        .role-card {
          border-radius: 20px;
          padding: 24px;
          background: #fff;
          border: 2px solid #f0ebe3;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          cursor: default;
        }
        .role-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: #2d6a4f;
        }
        .cta-banner {
          background: linear-gradient(135deg, #0d1f0f 0%, #1b4332 40%, #2d6a4f 70%, #b5451b 100%);
          border-radius: 28px;
          padding: 56px 48px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(230,100,50,0.25), transparent 70%);
          border-radius: 50%;
        }
        .cta-banner::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(45,106,79,0.35), transparent 70%);
          border-radius: 50%;
        }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=90')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }} />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(13,31,15,0.93) 0%, rgba(27,67,50,0.88) 50%, rgba(181,69,27,0.72) 100%)',
        }} />

        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(134,239,172,0.12), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '0', left: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(230,100,30,0.15), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '100px 32px 60px', width: '100%' }}>
          {/* Badge */}
          <div style={{ animation: 'floatBadge 3s ease-in-out infinite', display: 'inline-block', marginBottom: '28px' }}>
            <span style={{
              background: 'rgba(134,239,172,0.15)',
              border: '1px solid rgba(134,239,172,0.4)',
              color: '#86efac',
              borderRadius: '50px',
              padding: '6px 18px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', display: 'inline-block' }} />
              Zambia Agriculture Platform
            </span>
          </div>

          {/* Headline + side stats layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'start' }}>
            <div style={{ maxWidth: '680px' }}>
              <h1 className="hero-headline">
                From Farm Gate<br />
                <span style={{ color: '#86efac' }}>to National Table</span>,<br />
                Every Step Connected.
              </h1>
              <p className="hero-sub" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.7, marginTop: '20px', maxWidth: '520px' }}>
                Agriconnect is Zambia's digital marketplace for farmers, buyers, suppliers, cooperatives, and FRA — built on transparent prices and AI-powered guidance.
              </p>
              <div className="hero-cta" style={{ display: 'flex', gap: '14px', marginTop: '36px', flexWrap: 'wrap' }}>
                <Link to="/register" className="pill-btn" style={{
                  background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(45,106,79,0.45)',
                }}>
                  🌱 Create Account
                </Link>
                <Link to="/login" className="pill-btn" style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                }}>
                  Sign In
                </Link>
              </div>
            </div>

            {/* Stats column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#86efac', fontFamily: '"Playfair Display", serif' }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live price ticker — sits at the bottom of the hero */}
        <div style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '0',
        }}>
          <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Marquee items={marqueeCards} speed={30} />
          </div>
          <div style={{ padding: '10px 0' }}>
            <Marquee items={[...marqueeCards].reverse()} speed={36} reverse />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES — vertical scroll strips
      ══════════════════════════════════════════ */}
      <section style={{ padding: '96px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <span className="section-label">Platform Features</span>
          <h2 className="section-headline">
            Everything you need<br />
            <span style={{ color: '#2d6a4f' }}>to grow and trade</span> better.
          </h2>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '520px', marginTop: '14px', lineHeight: 1.7 }}>
            Agriconnect bundles price intelligence, AI advisory, and multi-role workflows into one platform built for Zambia's agricultural economy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <VerticalStrip cards={featureCards.slice(0, 4)} speed={24} />
          <VerticalStrip cards={featureCards.slice(2, 7)} speed={30} reverse />
          <VerticalStrip cards={[...featureCards].reverse().slice(0, 4)} speed={26} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO IT'S FOR — role cards
      ══════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '96px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '52px' }}>
            <span style={{
              display: 'inline-block',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: 700,
              color: '#86efac',
              background: 'rgba(134,239,172,0.1)',
              padding: '4px 14px',
              borderRadius: '20px',
              marginBottom: '12px',
            }}>Who It's For</span>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: '#fff',
              lineHeight: 1.1,
            }}>
              Six roles.<br />
              <span style={{ color: '#86efac' }}>One ecosystem.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🌾', role: 'Farmers', desc: 'List produce, access AI advice, track prices, connect to buyers.' },
              { icon: '🏪', role: 'Buyers', desc: 'Browse verified supply, compare prices, place structured orders.' },
              { icon: '🏭', role: 'Suppliers', desc: 'Manage inputs, reach rural distributors, fulfill bulk orders.' },
              { icon: '🏛️', role: 'FRA', desc: 'Run national procurement, set strategic reserve prices.' },
              { icon: '🤝', role: 'Cooperatives', desc: 'Aggregate farmer output, negotiate better collective rates.' },
              { icon: '⚙️', role: 'Admins', desc: 'Oversee the platform, manage users, monitor market integrity.' },
            ].map((r) => (
              <div key={r.role} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '2px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px',
                transition: 'transform 0.25s, border-color 0.25s, background 0.25s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#52b788';
                  e.currentTarget.style.background = 'rgba(82,183,136,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{r.icon}</div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '8px' }}>{r.role}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — 3 steps
      ══════════════════════════════════════════ */}
      <section style={{ padding: '96px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="section-label">How It Works</span>
          <h2 className="section-headline">Up and running in<br /><span style={{ color: '#b5451b' }}>three simple steps.</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Create Your Account', desc: 'Register with your role — farmer, buyer, supplier, cooperative, FRA, or admin.', color: '#2d6a4f' },
            { step: '02', title: 'Access Your Dashboard', desc: 'See your personalised market data, AI advice, procurement tools, and listings.', color: '#b5451b' },
            { step: '03', title: 'Trade with Confidence', desc: 'Buy, sell, negotiate, and track — backed by transparent, live market intelligence.', color: '#e07b39' },
          ].map((s) => (
            <div key={s.step} style={{
              position: 'relative',
              background: '#fff',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
              border: '2px solid #f0ebe3',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-16px', right: '-16px',
                fontSize: '96px',
                fontWeight: 900,
                color: `${s.color}0d`,
                fontFamily: '"Playfair Display", serif',
                lineHeight: 1,
                userSelect: 'none',
              }}>{s.step}</div>
              <div style={{
                display: 'inline-block',
                background: s.color,
                color: '#fff',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '16px',
              }}>Step {s.step}</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '14px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section style={{ padding: '0 32px 96px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="cta-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '16px' }}>
              Ready to start?
            </p>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: '#fff',
              lineHeight: 1.1,
              maxWidth: '600px',
              marginBottom: '20px',
            }}>
              Join Zambia's growing agricultural marketplace today.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '480px', lineHeight: 1.7, marginBottom: '36px' }}>
              Thousands of farmers and buyers are already accessing fair prices and AI guidance. Your dashboard is waiting.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/register" className="pill-btn" style={{
                background: '#fff',
                color: '#1b4332',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}>
                🌱 Get Started Free
              </Link>
              <Link to="/login" className="pill-btn" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: '#fff',
              }}>
                Already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{
        background: '#0d1f0f',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '48px 32px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: '22px', color: '#86efac', marginBottom: '6px' }}>Agriconnect</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', maxWidth: '340px', lineHeight: 1.6 }}>
              Connecting Zambia's farmers, buyers, suppliers, FRA, and cooperatives through transparent data and AI-powered guidance.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Smart Agriculture Platform</p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '4px' }}>Built for Zambia. Powered by data.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}