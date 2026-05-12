import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};

/* ═══════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════ */
function Panel({ children, style = {} }) {
  return (
    <div style={{ background:'#fff', borderRadius:'20px', border:'2px solid #f0ebe3', boxShadow:'0 4px 24px rgba(0,0,0,0.05)', padding:'24px', ...style }}>
      {children}
    </div>
  );
}

function PanelTitle({ icon, children, badge, badgeColor }) {
  const bc = badgeColor || { bg:'#d8f3dc', color:'#1b4332', border:'#b7dfc7' };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
      {icon && <span style={{ fontSize:'20px' }}>{icon}</span>}
      <span style={{ fontFamily:'"Playfair Display",serif', fontWeight:700, fontSize:'17px', color:'#1a1a1a', flex:1 }}>{children}</span>
      {badge !== undefined && (
        <span style={{ background:bc.bg, color:bc.color, borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:700, border:`1px solid ${bc.border}` }}>{badge}</span>
      )}
    </div>
  );
}

function FieldInput({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#888', marginBottom:'5px' }}>{label}</label>}
      <input {...props} style={{ width:'100%', padding:'11px 14px', borderRadius:'10px', border:'2px solid #e8e2d9', background:'#faf9f7', fontSize:'13px', fontFamily:'inherit', color:'#1a1a1a', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s', ...props.style }}
        onFocus={e => { e.target.style.borderColor='#1e6fa5'; e.target.style.boxShadow='0 0 0 3px rgba(30,111,165,0.1)'; }}
        onBlur={e  => { e.target.style.borderColor='#e8e2d9'; e.target.style.boxShadow='none'; }}
      />
    </div>
  );
}

function Btn({ children, variant='blue', disabled, style={}, ...props }) {
  const variants = {
    blue:   { background:'linear-gradient(135deg,#1e40af,#2563eb)', color:'#fff', boxShadow:'0 6px 20px rgba(30,64,175,0.3)' },
    teal:   { background:'linear-gradient(135deg,#0f766e,#14b8a6)', color:'#fff', boxShadow:'0 6px 20px rgba(15,118,110,0.3)' },
    green:  { background:'linear-gradient(135deg,#2d6a4f,#52b788)', color:'#fff', boxShadow:'0 6px 20px rgba(45,106,79,0.3)' },
    amber:  { background:'linear-gradient(135deg,#92400e,#d97706)', color:'#fff', boxShadow:'0 6px 20px rgba(146,64,14,0.3)' },
    red:    { background:'linear-gradient(135deg,#991b1b,#dc2626)', color:'#fff', boxShadow:'0 6px 20px rgba(153,27,27,0.25)' },
    ghost:  { background:'rgba(30,64,175,0.07)', color:'#1e40af', border:'2px solid #bfdbfe', boxShadow:'none' },
    dark:   { background:'linear-gradient(135deg,#1a1a1a,#374151)', color:'#fff', boxShadow:'0 6px 20px rgba(0,0,0,0.2)' },
  };
  return (
    <button {...props} disabled={disabled} style={{ padding:'10px 20px', borderRadius:'50px', border:'none', fontSize:'13px', fontWeight:700, fontFamily:'inherit', cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.55:1, transition:'transform 0.15s, box-shadow 0.15s', ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.06)'; }}}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.filter=''; }}
    >{children}</button>
  );
}

/* ─────────────────────────────────────────────
   Product Detail Modal
───────────────────────────────────────────── */
function ProductModal({ product, qty, onQtyChange, onOrder, placing, onClose }) {
  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:'#fff',borderRadius:'24px',width:'100%',maxWidth:'500px',boxShadow:'0 32px 80px rgba(0,0,0,0.25)',overflow:'hidden',animation:'fadeUp 0.3s ease' }}>
        {/* Image */}
        <div style={{ position:'relative',height:'220px',background:'#f0ebe3',overflow:'hidden' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }} onError={e=>e.currentTarget.style.display='none'} />
          ) : (
            <div style={{ height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'56px' }}>🌽</div>
          )}
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
          <button onClick={onClose} style={{ position:'absolute',top:'14px',right:'14px',background:'rgba(0,0,0,0.35)',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
          <div style={{ position:'absolute',bottom:'14px',left:'16px' }}>
            <p style={{ fontFamily:'"Playfair Display",serif',fontWeight:900,fontSize:'22px',color:'#fff',margin:0 }}>{formatValue(product.name)}</p>
          </div>
        </div>

        <div style={{ padding:'24px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'20px' }}>
            {[['💰 Price','K '+formatValue(product.price),'#d8f3dc','#1b4332'],['📦 Stock',formatValue(product.quantity),'#dbeafe','#1e40af'],['🏷️ Status','Available','#ecfdf5','#065f46']].map(([l,v,bg,color])=>(
              <div key={l} style={{ background:bg,borderRadius:'12px',padding:'10px 12px',textAlign:'center' }}>
                <p style={{ fontSize:'11px',color:'#888',marginBottom:'3px' }}>{l}</p>
                <p style={{ fontSize:'14px',fontWeight:700,color }}>{v}</p>
              </div>
            ))}
          </div>

          {product.farmer_name && (
            <div style={{ background:'#f7f4ef',borderRadius:'12px',padding:'12px 14px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'10px' }}>
              <span style={{ fontSize:'20px' }}>🌾</span>
              <div>
                <p style={{ fontSize:'11px',color:'#888',margin:0 }}>Farmer</p>
                <p style={{ fontSize:'13px',fontWeight:700,color:'#1a1a1a',margin:0 }}>{product.farmer_name}</p>
              </div>
              {product.district && <div style={{ marginLeft:'auto' }}>
                <p style={{ fontSize:'11px',color:'#888',margin:0 }}>District</p>
                <p style={{ fontSize:'13px',fontWeight:600,color:'#555',margin:0 }}>{product.district}</p>
              </div>}
            </div>
          )}

          <div style={{ display:'flex',gap:'10px',alignItems:'flex-end' }}>
            <div style={{ flex:1 }}>
              <FieldInput label="Order Quantity" type="number" min="1" step="1" placeholder="e.g. 10" value={qty||''} onChange={e=>onQtyChange(product.id, e.target.value)} />
            </div>
            <Btn variant="blue" onClick={()=>onOrder(product)} disabled={placing===product.id||!qty} style={{ padding:'12px 24px',whiteSpace:'nowrap',flexShrink:0 }}>
              {placing===product.id?'⏳ Placing...':'🛒 Place Order'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function BuyerDashboard() {
  /* ── all original state (unchanged) ── */
  const [profile, setProfile]                         = useState(null);
  const [marketPrices, setMarketPrices]               = useState([]);
  const [availableProducts, setAvailableProducts]     = useState([]);
  const [orders, setOrders]                           = useState([]);
  const [orderQtyByProduct, setOrderQtyByProduct]     = useState({});
  const [loading, setLoading]                         = useState(true);
  const [placingOrderProductId, setPlacingOrderProductId] = useState(null);
  const [error, setError]                             = useState('');
  const [notice, setNotice]                           = useState('');

  /* ── NEW UI state ── */
  const [activeTab, setActiveTab]       = useState('browse');
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortBy, setSortBy]             = useState('default');   // 'price_asc' | 'price_desc' | 'name'
  const [selectedProduct, setSelectedProduct] = useState(null); // modal
  const [wishlist, setWishlist]         = useState(new Set());   // product ids

  /* ── original fetch (unchanged) ── */
  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const [profileRes, marketRes, dashboardRes, ordersRes] = await Promise.all([
        api.get('/dashboard/profile'),
        api.get('/dashboard/market-prices'),
        api.get('/dashboard'),
        api.get('/buyers/orders'),
      ]);
      setProfile(profileRes?.data?.data || null);
      setMarketPrices(marketRes?.data?.data || []);
      setAvailableProducts(dashboardRes?.data?.data?.availableProducts || []);
      setOrders(ordersRes?.data?.data?.orders || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load buyer dashboard.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  /* ── original placeOrder (unchanged) ── */
  const placeOrder = async (product) => {
    const qty = Number(orderQtyByProduct[product.id] || 0);
    if (!qty || qty <= 0) { setError('Enter a valid quantity before placing an order.'); return; }
    setPlacingOrderProductId(product.id); setError(''); setNotice('');
    try {
      const res = await api.post('/buyers/orders', { product_id:product.id, quantity:qty });
      const created = res?.data?.data?.order;
      if (created) setOrders(prev=>[created,...prev]);
      setNotice(`Order placed for ${product.name}.`);
      setOrderQtyByProduct(prev=>({...prev,[product.id]:''}));
      setSelectedProduct(null);
    } catch (err) { setError(err?.response?.data?.message||'Failed to place order.'); }
    finally { setPlacingOrderProductId(null); }
  };

  /* ── NEW helpers ── */
  const toggleWishlist = (id) => setWishlist(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const filteredProducts = useMemo(() => {
    let list = [...availableProducts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => (p.name||'').toLowerCase().includes(q) || (p.farmer_name||'').toLowerCase().includes(q) || (p.district||'').toLowerCase().includes(q));
    }
    if (sortBy === 'price_asc')  list.sort((a,b) => Number(a.price||0) - Number(b.price||0));
    if (sortBy === 'price_desc') list.sort((a,b) => Number(b.price||0) - Number(a.price||0));
    if (sortBy === 'name')       list.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    return list;
  }, [availableProducts, searchQuery, sortBy]);

  const wishlistProducts = availableProducts.filter(p => wishlist.has(p.id));
  const pendingOrders    = orders.filter(o => o.status === 'pending');
  const approvedOrders   = orders.filter(o => o.status === 'approved');

  const profileUser    = profile?.user    || {};
  const profileDetails = profile?.profile || {};

  const statCards = [
    { icon:'🛒', label:'Available Products', value:availableProducts.length, bg:'#dbeafe', color:'#1e40af', border:'#93c5fd' },
    { icon:'📦', label:'My Orders',          value:orders.length,            bg:'#d8f3dc', color:'#1b4332', border:'#b7dfc7' },
    { icon:'⏳', label:'Pending',            value:pendingOrders.length,     bg:'#fef3c7', color:'#92400e', border:'#fcd34d' },
    { icon:'✅', label:'Approved',           value:approvedOrders.length,    bg:'#ecfdf5', color:'#065f46', border:'#6ee7b7' },
    { icon:'❤️', label:'Wishlist',           value:wishlist.size,            bg:'#fce7f3', color:'#9d174d', border:'#f9a8d4' },
    { icon:'📊', label:'Market Prices',      value:marketPrices.length,      bg:'#fffbeb', color:'#b45309', border:'#fde68a' },
  ];

  const tabs = [
    { id:'browse',    icon:'🛍️', label:'Browse'     },
    { id:'orders',    icon:'📦', label:'My Orders'   },
    { id:'wishlist',  icon:'❤️', label:'Wishlist', alert: wishlist.size||null },
    { id:'market',    icon:'📊', label:'Market'      },
    { id:'profile',   icon:'👤', label:'Profile'     },
  ];

  const orderStatusStyle = (status) => ({
    pending:   { bg:'#fef3c7', color:'#92400e', border:'#fcd34d' },
    approved:  { bg:'#d8f3dc', color:'#1b4332', border:'#b7dfc7' },
    rejected:  { bg:'#fff5f5', color:'#b91c1c', border:'#fca5a5' },
    completed: { bg:'#dbeafe', color:'#1e40af', border:'#93c5fd' },
  }[status] || { bg:'#f3f4f6', color:'#374151', border:'#d1d5db' });

  return (
    <main style={{ minHeight:'calc(100vh - 64px)', background:'#f7f4ef', fontFamily:'"DM Sans",sans-serif' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badgePop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes heartbeat{ 0%,100%{transform:scale(1)} 30%{transform:scale(1.3)} }
        .tab-btn { transition:all 0.2s; border:none; cursor:pointer; font-family:inherit; }
        .tab-btn:hover { transform:translateY(-1px); }
        .stat-card { transition:transform 0.2s, box-shadow 0.2s; cursor:default; }
        .stat-card:hover { transform:translateY(-5px) scale(1.02); box-shadow:0 16px 40px rgba(0,0,0,0.1) !important; }
        .product-card { transition:transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .product-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.1) !important; border-color:#93c5fd !important; }
        .heart-btn { transition:transform 0.2s, color 0.2s; background:none; border:none; cursor:pointer; font-size:18px; padding:4px; line-height:1; }
        .heart-btn:hover { transform:scale(1.25); }
        .market-row { transition:background 0.15s; }
        .market-row:hover { background:#fffbeb !important; }
        .order-row { transition:box-shadow 0.15s; }
        .order-row:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); }
        .alert-badge { animation:badgePop 2s ease-in-out infinite; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:4px; }
        select.sort-sel { padding:9px 32px 9px 12px;border-radius:10px;border:2px solid #e8e2d9;background:#fff;font-size:13px;font-family:inherit;color:#1a1a1a;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center; }
        select.sort-sel:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
      `}</style>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          qty={orderQtyByProduct[selectedProduct.id]}
          onQtyChange={(id,v)=>setOrderQtyByProduct(p=>({...p,[id]:v}))}
          onOrder={placeOrder}
          placing={placingOrderProductId}
          onClose={()=>setSelectedProduct(null)}
        />
      )}

      {/* ══ HERO ══ */}
      <div style={{ background:'linear-gradient(135deg,#0c1445 0%,#1e3a8a 40%,#1e6fa5 75%,#0f766e 100%)', padding:'36px 32px 28px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'-60px',right:'-60px',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(147,197,253,0.13),transparent 70%)',borderRadius:'50%',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:'-40px',left:'-40px',width:'220px',height:'220px',background:'radial-gradient(circle,rgba(20,184,166,0.13),transparent 70%)',borderRadius:'50%',pointerEvents:'none' }} />
        <div style={{ position:'relative',maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px' }}>
          <div>
            <span style={{ display:'inline-flex',alignItems:'center',gap:'8px',fontSize:'11px',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#93c5fd',background:'rgba(147,197,253,0.1)',border:'1px solid rgba(147,197,253,0.25)',padding:'4px 14px',borderRadius:'20px',marginBottom:'12px' }}>
              <span style={{ width:'7px',height:'7px',borderRadius:'50%',background:'#93c5fd',display:'inline-block' }} /> Buyer Workspace
            </span>
            <h1 style={{ fontFamily:'"Playfair Display",serif',fontWeight:900,fontSize:'clamp(1.6rem,3vw,2.4rem)',color:'#fff',lineHeight:1.1,marginBottom:'8px' }}>
              Welcome, <span style={{ color:'#93c5fd' }}>{formatValue(profileUser.name||'Buyer')}</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.6)',fontSize:'14px',lineHeight:1.6 }}>Browse farmer listings, compare prices, place orders, and track your purchasing pipeline.</p>
          </div>
          <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
            {[['District',formatValue(profileDetails.district||profileUser.district),false],['Orders',orders.length,false],['Wishlist',wishlist.size,true]].map(([l,v,hi])=>(
              <div key={l} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',padding:'10px 16px',backdropFilter:'blur(8px)' }}>
                <p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'2px',textTransform:'uppercase',letterSpacing:'0.1em' }}>{l}</p>
                <p style={{ fontSize:'16px',fontWeight:800,color:hi?'#f9a8d4':'#fff' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TAB NAV ══ */}
      <div style={{ background:'#fff',borderBottom:'2px solid #f0ebe3',position:'sticky',top:0,zIndex:40 }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'0 24px',display:'flex',gap:'4px',overflowX:'auto' }}>
          {tabs.map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setActiveTab(t.id)} style={{ padding:'14px 16px',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600,whiteSpace:'nowrap',position:'relative',background:'transparent',color:activeTab===t.id?'#1e40af':'#888',borderBottom:activeTab===t.id?'3px solid #1e40af':'3px solid transparent' }}>
              <span>{t.icon}</span> {t.label}
              {t.alert && <span className="alert-badge" style={{ position:'absolute',top:'8px',right:'4px',background:'#e11d48',color:'#fff',borderRadius:'50%',width:'18px',height:'18px',fontSize:'10px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center' }}>{t.alert}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'28px 24px',display:'flex',flexDirection:'column',gap:'24px' }}>

        {error  && <div style={{ padding:'14px 18px',borderRadius:'12px',background:'#fff5f5',border:'2px solid #fca5a5',color:'#b91c1c',fontSize:'14px',display:'flex',gap:'10px',alignItems:'center' }}>⚠️ {error}</div>}
        {notice && <div style={{ padding:'14px 18px',borderRadius:'12px',background:'#eff6ff',border:'2px solid #93c5fd',color:'#1e40af',fontSize:'14px',display:'flex',gap:'10px',alignItems:'center' }}>✅ {notice}</div>}

        {/* ── STAT CARDS (shown on all tabs) ── */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'14px' }}>
          {statCards.map(c=>(
            <div key={c.label} className="stat-card" style={{ background:`linear-gradient(135deg,${c.bg},#fff)`,border:`2px solid ${c.border}`,borderRadius:'18px',padding:'18px',boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'22px',marginBottom:'6px' }}>{c.icon}</div>
              <div style={{ fontSize:'24px',fontWeight:900,color:c.color,fontFamily:'"Playfair Display",serif',marginBottom:'3px' }}>{loading?'—':c.value}</div>
              <div style={{ fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#888' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* ═══════════════ BROWSE TAB ═══════════════ */}
        {activeTab==='browse' && (
          <Panel>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',marginBottom:'20px' }}>
              <PanelTitle icon="🛍️" badge={`${filteredProducts.length} listings`} badgeColor={{ bg:'#dbeafe',color:'#1e40af',border:'#93c5fd' }}>
                Available Products
              </PanelTitle>
            </div>

            {/* Search + sort bar */}
            <div style={{ display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'20px' }}>
              <div style={{ flex:'1 1 240px',position:'relative' }}>
                <span style={{ position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',color:'#aaa' }}>🔍</span>
                <input
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  placeholder="Search by product, farmer, or district..."
                  style={{ width:'100%',padding:'11px 14px 11px 36px',borderRadius:'10px',border:'2px solid #e8e2d9',background:'#faf9f7',fontSize:'13px',fontFamily:'inherit',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s' }}
                  onFocus={e=>e.target.style.borderColor='#2563eb'}
                  onBlur={e=>e.target.style.borderColor='#e8e2d9'}
                />
              </div>
              <select className="sort-sel" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="name">Name: A → Z</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign:'center',padding:'48px 0',color:'#aaa' }}>
                <div style={{ fontSize:'40px',marginBottom:'12px' }}>⏳</div>
                <p style={{ fontSize:'14px' }}>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign:'center',padding:'48px 0',color:'#aaa' }}>
                <div style={{ fontSize:'40px',marginBottom:'12px' }}>🔍</div>
                <p style={{ fontSize:'14px' }}>No products match your search.</p>
                {searchQuery && <button onClick={()=>setSearchQuery('')} style={{ marginTop:'8px',background:'none',border:'none',color:'#2563eb',fontSize:'13px',cursor:'pointer',fontFamily:'inherit',textDecoration:'underline' }}>Clear search</button>}
              </div>
            ) : (
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'18px' }}>
                {filteredProducts.map(item=>(
                  <div key={item.id} className="product-card" style={{ borderRadius:'18px',border:'2px solid #f0ebe3',background:'#fff',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.04)',cursor:'pointer' }}>
                    {/* Image */}
                    <div style={{ position:'relative',height:'160px',background:'#f0ebe3',overflow:'hidden' }} onClick={()=>setSelectedProduct(item)}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={{ width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform 0.3s' }}
                          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                          onError={e=>e.currentTarget.style.display='none'}
                        />
                      ) : (
                        <div style={{ height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'48px' }}>🌽</div>
                      )}
                      {/* Wishlist heart */}
                      <button className="heart-btn" onClick={e=>{e.stopPropagation();toggleWishlist(item.id);}} style={{ position:'absolute',top:'10px',right:'10px',background:'rgba(255,255,255,0.85)',borderRadius:'50%',width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.12)',border:'none',cursor:'pointer',fontSize:'16px' }}>
                        {wishlist.has(item.id) ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <div style={{ padding:'14px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px' }}>
                        <h3 style={{ fontFamily:'"Playfair Display",serif',fontWeight:700,fontSize:'16px',color:'#1a1a1a',margin:0,flex:1,paddingRight:'8px' }} onClick={()=>setSelectedProduct(item)}>{formatValue(item.name)}</h3>
                        <span style={{ fontSize:'16px',fontWeight:900,color:'#1e40af',fontFamily:'"Playfair Display",serif',whiteSpace:'nowrap' }}>K {formatValue(item.price)}</span>
                      </div>
                      {item.farmer_name && <p style={{ fontSize:'12px',color:'#888',marginBottom:'4px' }}>🌾 {item.farmer_name}{item.district?` · ${item.district}`:''}</p>}
                      <p style={{ fontSize:'12px',color:'#666',marginBottom:'12px' }}>Stock: <strong>{formatValue(item.quantity)}</strong></p>

                      {/* Quick order row */}
                      <div style={{ display:'flex',gap:'8px',alignItems:'center' }}>
                        <input
                          type="number" min="1" step="1" placeholder="Qty"
                          value={orderQtyByProduct[item.id]||''}
                          onChange={e=>setOrderQtyByProduct(p=>({...p,[item.id]:e.target.value}))}
                          onClick={e=>e.stopPropagation()}
                          style={{ width:'70px',padding:'9px 10px',borderRadius:'10px',border:'2px solid #bfdbfe',background:'#eff6ff',fontSize:'13px',fontFamily:'inherit',outline:'none',boxSizing:'border-box',textAlign:'center',transition:'border-color 0.2s' }}
                          onFocus={e=>e.target.style.borderColor='#2563eb'}
                          onBlur={e=>e.target.style.borderColor='#bfdbfe'}
                        />
                        <Btn variant="blue" onClick={e=>{e.stopPropagation();placeOrder(item);}} disabled={placingOrderProductId===item.id||!orderQtyByProduct[item.id]} style={{ flex:1,padding:'9px 12px',fontSize:'12px' }}>
                          {placingOrderProductId===item.id?'⏳...':'🛒 Order'}
                        </Btn>
                        <button onClick={e=>{e.stopPropagation();setSelectedProduct(item);}} style={{ padding:'9px 10px',borderRadius:'10px',border:'2px solid #e8e2d9',background:'#faf9f7',cursor:'pointer',fontSize:'13px',color:'#555',fontFamily:'inherit',transition:'border-color 0.2s' }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor='#2563eb'}
                          onMouseLeave={e=>e.currentTarget.style.borderColor='#e8e2d9'}
                          title="View details"
                        >👁️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* ═══════════════ ORDERS TAB ═══════════════ */}
        {activeTab==='orders' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            {/* Pending */}
            <Panel>
              <PanelTitle icon="⏳" badge={pendingOrders.length} badgeColor={{ bg:'#fef3c7',color:'#92400e',border:'#fcd34d' }}>Pending Orders</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'10px',maxHeight:'480px',overflowY:'auto' }}>
                {pendingOrders.map(order=>{
                  const sc = orderStatusStyle(order.status);
                  return (
                    <div key={order.id} className="order-row" style={{ border:`2px solid ${sc.border}`,borderRadius:'14px',padding:'14px',background:'#fff' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px' }}>
                        <p style={{ fontWeight:700,fontSize:'14px',color:'#1a1a1a',margin:0 }}>{formatValue(order?.product?.name||order.product_id)}</p>
                        <span style={{ fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,whiteSpace:'nowrap' }}>⏳ PENDING</span>
                      </div>
                      <div style={{ display:'flex',gap:'16px',flexWrap:'wrap',fontSize:'13px',color:'#666' }}>
                        {order.quantity   && <span>📦 {order.quantity}</span>}
                        {order.total_price && <span style={{ color:'#1e40af',fontWeight:700 }}>K {order.total_price}</span>}
                      </div>
                      <p style={{ fontSize:'11px',color:'#aaa',margin:'6px 0 0' }}>{formatValue(order.created_at)?.slice(0,10)}</p>
                    </div>
                  );
                })}
                {!pendingOrders.length && (
                  <div style={{ textAlign:'center',padding:'28px 0' }}>
                    <div style={{ fontSize:'36px',marginBottom:'8px' }}>✅</div>
                    <p style={{ fontSize:'13px',color:'#aaa' }}>No pending orders.</p>
                  </div>
                )}
              </div>
            </Panel>

            {/* All orders */}
            <Panel>
              <PanelTitle icon="📦" badge={orders.length} badgeColor={{ bg:'#dbeafe',color:'#1e40af',border:'#93c5fd' }}>All Orders</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'10px',maxHeight:'480px',overflowY:'auto' }}>
                {orders.map(order=>{
                  const sc = orderStatusStyle(order.status);
                  return (
                    <div key={order.id} className="order-row" style={{ border:`2px solid ${sc.border}`,borderRadius:'14px',padding:'14px',background:'#fff' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px' }}>
                        <p style={{ fontWeight:700,fontSize:'14px',color:'#1a1a1a',margin:0,flex:1,paddingRight:'8px' }}>{formatValue(order?.product?.name||order.product_id)}</p>
                        <span style={{ fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,whiteSpace:'nowrap' }}>{formatValue(order.status).toUpperCase()}</span>
                      </div>
                      <div style={{ display:'flex',gap:'16px',flexWrap:'wrap',fontSize:'12px',color:'#888' }}>
                        {order.quantity    && <span>📦 Qty: {order.quantity}</span>}
                        {order.total_price && <span style={{ color:'#1e40af',fontWeight:700,fontSize:'13px' }}>K {order.total_price}</span>}
                        <span style={{ marginLeft:'auto',color:'#bbb' }}>{formatValue(order.created_at)?.slice(0,10)}</span>
                      </div>
                    </div>
                  );
                })}
                {!orders.length && <p style={{ fontSize:'13px',color:'#aaa' }}>No orders yet.</p>}
              </div>
            </Panel>
          </div>
        )}

        {/* ═══════════════ WISHLIST TAB ═══════════════ */}
        {activeTab==='wishlist' && (
          <Panel>
            <PanelTitle icon="❤️" badge={wishlistProducts.length} badgeColor={{ bg:'#fce7f3',color:'#9d174d',border:'#f9a8d4' }}>
              My Wishlist
            </PanelTitle>
            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign:'center',padding:'56px 0' }}>
                <div style={{ fontSize:'56px',marginBottom:'16px' }}>🤍</div>
                <p style={{ fontFamily:'"Playfair Display",serif',fontWeight:700,fontSize:'18px',color:'#1a1a1a',marginBottom:'8px' }}>Your wishlist is empty</p>
                <p style={{ fontSize:'13px',color:'#aaa',marginBottom:'20px' }}>Tap the 🤍 on any product to save it here.</p>
                <Btn variant="blue" onClick={()=>setActiveTab('browse')}>Browse Products →</Btn>
              </div>
            ) : (
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'18px' }}>
                {wishlistProducts.map(item=>(
                  <div key={item.id} className="product-card" style={{ borderRadius:'18px',border:'2px solid #fce7f3',background:'#fff',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div style={{ position:'relative',height:'140px',background:'#f0ebe3',overflow:'hidden' }}>
                      {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>e.currentTarget.style.display='none'} />
                        : <div style={{ height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px' }}>🌽</div>}
                      <button className="heart-btn" onClick={()=>toggleWishlist(item.id)} style={{ position:'absolute',top:'8px',right:'8px',background:'rgba(255,255,255,0.85)',borderRadius:'50%',width:'30px',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',border:'none',cursor:'pointer',fontSize:'15px' }}>❤️</button>
                    </div>
                    <div style={{ padding:'14px' }}>
                      <p style={{ fontFamily:'"Playfair Display",serif',fontWeight:700,fontSize:'15px',color:'#1a1a1a',marginBottom:'4px' }}>{formatValue(item.name)}</p>
                      <p style={{ fontSize:'16px',fontWeight:900,color:'#1e40af',fontFamily:'"Playfair Display",serif',marginBottom:'10px' }}>K {formatValue(item.price)}</p>
                      <div style={{ display:'flex',gap:'8px' }}>
                        <input type="number" min="1" step="1" placeholder="Qty" value={orderQtyByProduct[item.id]||''}
                          onChange={e=>setOrderQtyByProduct(p=>({...p,[item.id]:e.target.value}))}
                          style={{ width:'64px',padding:'8px 10px',borderRadius:'10px',border:'2px solid #f9a8d4',background:'#fce7f3',fontSize:'13px',fontFamily:'inherit',outline:'none',textAlign:'center' }}
                        />
                        <Btn variant="blue" onClick={()=>placeOrder(item)} disabled={placingOrderProductId===item.id||!orderQtyByProduct[item.id]} style={{ flex:1,padding:'8px 12px',fontSize:'12px' }}>
                          {placingOrderProductId===item.id?'⏳...':'🛒 Order'}
                        </Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* ═══════════════ MARKET TAB ═══════════════ */}
        {activeTab==='market' && (
          <Panel>
            <PanelTitle icon="📊" badge={`${marketPrices.length} prices`} badgeColor={{ bg:'#fffbeb',color:'#b45309',border:'#fde68a' }}>Live Market Prices</PanelTitle>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse',minWidth:'400px' }}>
                <thead><tr style={{ background:'#fffbeb',borderBottom:'2px solid #fde68a' }}>
                  {['Product','Market / Location','Price (ZMW)'].map((h,i)=>(
                    <th key={h} style={{ padding:'12px 14px',textAlign:i===2?'right':'left',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#b45309' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {loading && <tr><td colSpan="3" style={{ padding:'32px',textAlign:'center',color:'#aaa' }}>Loading...</td></tr>}
                  {!loading&&!marketPrices.length && <tr><td colSpan="3" style={{ padding:'32px',textAlign:'center',color:'#aaa' }}>No market data available.</td></tr>}
                  {marketPrices.map((item,i)=>(
                    <tr key={item.id} className="market-row" style={{ borderBottom:'1px solid #f0ebe3',background:i%2===0?'#fff':'#fafaf7' }}>
                      <td style={{ padding:'12px 14px',fontSize:'14px',fontWeight:600,color:'#1a1a1a' }}>{formatValue(item.product||item.name)}</td>
                      <td style={{ padding:'12px 14px',fontSize:'13px',color:'#666' }}>{formatValue(item.market_name||item.location)}</td>
                      <td style={{ padding:'12px 14px',fontSize:'15px',fontWeight:800,color:'#b45309',textAlign:'right',fontFamily:'"Playfair Display",serif' }}>K {formatValue(item.price??item.price_per_unit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {/* ═══════════════ PROFILE TAB ═══════════════ */}
        {activeTab==='profile' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <Panel>
              <PanelTitle icon="👤">Account Info</PanelTitle>
              {[['Full Name',profileUser.name],['Phone',profileUser.phone],['Email',profileUser.email],['Role',profileUser.role],['Language',profileUser.language]].map(([k,v])=>(
                <div key={k} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f0ebe3',fontSize:'13px' }}>
                  <span style={{ color:'#888',fontWeight:600 }}>{k}</span>
                  <span style={{ color:'#1a1a1a',fontWeight:600 }}>{formatValue(v)}</span>
                </div>
              ))}
            </Panel>
            <Panel>
              <PanelTitle icon="🗺️">Location Details</PanelTitle>
              {[['District',profileDetails.district||profileUser.district],['Ward',profileDetails.ward],['Latitude',profileUser.lat],['Longitude',profileUser.lng]].map(([k,v])=>(
                <div key={k} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f0ebe3',fontSize:'13px' }}>
                  <span style={{ color:'#888',fontWeight:600 }}>{k}</span>
                  <span style={{ color:'#1a1a1a',fontWeight:600 }}>{formatValue(v)}</span>
                </div>
              ))}
              <div style={{ marginTop:'16px',background:'linear-gradient(135deg,#eff6ff,#dbeafe)',borderRadius:'14px',padding:'16px',border:'2px solid #bfdbfe' }}>
                <p style={{ fontSize:'12px',color:'#1e40af',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px' }}>📦 Order Summary</p>
                <div style={{ display:'flex',gap:'20px' }}>
                  {[['Total',orders.length],['Pending',pendingOrders.length],['Approved',approvedOrders.length]].map(([l,v])=>(
                    <div key={l}>
                      <p style={{ fontSize:'20px',fontWeight:900,color:'#1e40af',fontFamily:'"Playfair Display",serif',margin:0 }}>{v}</p>
                      <p style={{ fontSize:'11px',color:'#64748b',margin:0 }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        )}

      </div>
    </main>
  );
}