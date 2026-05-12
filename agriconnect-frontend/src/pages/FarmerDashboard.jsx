import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const formatField = (value) => {
  if (value === null || value === undefined || value === '') return 'Not set';
  return String(value);
};

const initialProductForm   = { name: '', quantity: '', price: '', image_url: '' };
const initialComplaintForm = { message: '' };
const initialMessageForm   = { recipient_id: '', content: '' };
const initialPaymentForm   = { method: 'mobile_money', phone: '', amount: '', reference: '' };

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

function PanelTitle({ icon, children, badge }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
      {icon && <span style={{ fontSize:'20px' }}>{icon}</span>}
      <span style={{ fontFamily:'"Playfair Display",serif', fontWeight:700, fontSize:'17px', color:'#1a1a1a', flex:1 }}>{children}</span>
      {badge !== undefined && (
        <span style={{ background:'#d8f3dc', color:'#1b4332', borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:700, border:'1px solid #b7dfc7' }}>{badge}</span>
      )}
    </div>
  );
}

function FieldInput({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#888', marginBottom:'5px' }}>{label}</label>}
      <input {...props} style={{ width:'100%', padding:'11px 14px', borderRadius:'10px', border:'2px solid #e8e2d9', background:'#faf9f7', fontSize:'13px', fontFamily:'inherit', color:'#1a1a1a', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s', ...props.style }}
        onFocus={e => { e.target.style.borderColor='#2d6a4f'; e.target.style.boxShadow='0 0 0 3px rgba(45,106,79,0.1)'; }}
        onBlur={e  => { e.target.style.borderColor='#e8e2d9'; e.target.style.boxShadow='none'; }}
      />
    </div>
  );
}

function FieldTextarea({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#888', marginBottom:'5px' }}>{label}</label>}
      <textarea {...props} style={{ width:'100%', padding:'11px 14px', borderRadius:'10px', border:'2px solid #e8e2d9', background:'#faf9f7', fontSize:'13px', fontFamily:'inherit', color:'#1a1a1a', outline:'none', boxSizing:'border-box', resize:'vertical', transition:'border-color 0.2s, box-shadow 0.2s', ...props.style }}
        onFocus={e => { e.target.style.borderColor='#2d6a4f'; e.target.style.boxShadow='0 0 0 3px rgba(45,106,79,0.1)'; }}
        onBlur={e  => { e.target.style.borderColor='#e8e2d9'; e.target.style.boxShadow='none'; }}
      />
    </div>
  );
}

function Btn({ children, variant='green', disabled, style={}, ...props }) {
  const variants = {
    green:  { background:'linear-gradient(135deg,#2d6a4f,#52b788)', color:'#fff', boxShadow:'0 6px 20px rgba(45,106,79,0.3)' },
    amber:  { background:'linear-gradient(135deg,#92400e,#d97706)', color:'#fff', boxShadow:'0 6px 20px rgba(146,64,14,0.3)' },
    red:    { background:'linear-gradient(135deg,#991b1b,#dc2626)', color:'#fff', boxShadow:'0 6px 20px rgba(153,27,27,0.25)' },
    indigo: { background:'linear-gradient(135deg,#3730a3,#4f46e5)', color:'#fff', boxShadow:'0 6px 20px rgba(55,48,163,0.25)' },
    dark:   { background:'linear-gradient(135deg,#1a1a1a,#374151)', color:'#fff', boxShadow:'0 6px 20px rgba(0,0,0,0.2)' },
    ghost:  { background:'rgba(45,106,79,0.08)', color:'#2d6a4f', border:'2px solid #b7dfc7', boxShadow:'none' },
    teal:   { background:'linear-gradient(135deg,#0f766e,#14b8a6)', color:'#fff', boxShadow:'0 6px 20px rgba(15,118,110,0.3)' },
  };
  return (
    <button {...props} disabled={disabled} style={{ padding:'10px 20px', borderRadius:'50px', border:'none', fontSize:'13px', fontWeight:700, fontFamily:'inherit', cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.55:1, transition:'transform 0.15s, box-shadow 0.15s', ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.05)'; }}}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.filter=''; }}
    >{children}</button>
  );
}

/* ─────────────────────────────────────────────
   NEW: Payment Modal
───────────────────────────────────────────── */
function PaymentModal({ order, onClose, onSuccess }) {
  const [form, setForm]     = useState({ ...initialPaymentForm, amount: order?.total_price || order?.price || '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep]     = useState('form'); // 'form' | 'confirm' | 'done'
  const [err, setErr]       = useState('');

  const methods = [
    { id:'mobile_money', icon:'📱', label:'Mobile Money',      sub:'MTN / Airtel / Zamtel' },
    { id:'bank',         icon:'🏦', label:'Bank Transfer',     sub:'Direct bank payment'   },
    { id:'cash',         icon:'💵', label:'Cash on Delivery',  sub:'Pay at handover'       },
  ];

  const handlePay = async () => {
    setErr(''); setLoading(true);
    try {
      await api.post('/dashboard/payments', { order_id:order.id, method:form.method, phone:form.phone, amount:Number(form.amount), reference:form.reference });
      setStep('done');
      setTimeout(() => { onSuccess && onSuccess(order.id); onClose(); }, 2200);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:'#fff',borderRadius:'24px',width:'100%',maxWidth:'460px',boxShadow:'0 32px 80px rgba(0,0,0,0.25)',overflow:'hidden',animation:'fadeUp 0.3s ease' }}>
        {/* header */}
        <div style={{ background:'linear-gradient(135deg,#0d1f0f,#1b4332,#2d6a4f)',padding:'24px 28px',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:'-30px',right:'-30px',width:'120px',height:'120px',background:'radial-gradient(circle,rgba(134,239,172,0.15),transparent 70%)',borderRadius:'50%' }} />
          <div style={{ position:'relative' }}>
            <p style={{ fontSize:'11px',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#86efac',marginBottom:'6px' }}>💳 Secure Payment</p>
            <p style={{ fontFamily:'"Playfair Display",serif',fontWeight:900,fontSize:'20px',color:'#fff',marginBottom:'4px' }}>{order?.product?.name || order?.name || 'Order Payment'}</p>
            <p style={{ fontSize:'13px',color:'rgba(255,255,255,0.55)' }}>Order #{order?.id} · Buyer #{order?.buyer_id}</p>
          </div>
          <button onClick={onClose} style={{ position:'absolute',top:'16px',right:'16px',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
        </div>

        <div style={{ padding:'24px 28px' }}>
          {step === 'done' ? (
            <div style={{ textAlign:'center',padding:'20px 0' }}>
              <div style={{ fontSize:'56px',marginBottom:'16px' }}>✅</div>
              <p style={{ fontFamily:'"Playfair Display",serif',fontWeight:700,fontSize:'20px',color:'#1b4332',marginBottom:'8px' }}>Payment Submitted!</p>
              <p style={{ fontSize:'13px',color:'#888' }}>Your payment has been recorded. Closing shortly...</p>
            </div>
          ) : step === 'confirm' ? (
            <div>
              <p style={{ fontSize:'14px',color:'#555',marginBottom:'20px',lineHeight:1.6 }}>
                Confirm payment of <strong style={{ color:'#2d6a4f' }}>K {form.amount}</strong> via <strong>{methods.find(m=>m.id===form.method)?.label}</strong>{form.phone ? ` to ${form.phone}` : ''}.
              </p>
              {err && <div style={{ padding:'10px 14px',borderRadius:'10px',background:'#fff5f5',border:'2px solid #fca5a5',color:'#b91c1c',fontSize:'13px',marginBottom:'14px' }}>⚠️ {err}</div>}
              <div style={{ display:'flex',gap:'10px' }}>
                <Btn variant="ghost" onClick={()=>setStep('form')} style={{ flex:1 }}>← Back</Btn>
                <Btn variant="green" onClick={handlePay} disabled={loading} style={{ flex:2 }}>{loading?'⏳ Processing...':'✅ Confirm Payment'}</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
              <div>
                <label style={{ display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888',marginBottom:'8px' }}>Payment Method</label>
                <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
                  {methods.map(m=>(
                    <button key={m.id} type="button" onClick={()=>setForm(p=>({...p,method:m.id}))} style={{ display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderRadius:'12px',border:`2px solid ${form.method===m.id?'#2d6a4f':'#e8e2d9'}`,background:form.method===m.id?'#f0faf4':'#faf9f7',cursor:'pointer',fontFamily:'inherit',textAlign:'left',transition:'all 0.15s' }}>
                      <span style={{ fontSize:'22px' }}>{m.icon}</span>
                      <div>
                        <p style={{ fontSize:'13px',fontWeight:700,color:form.method===m.id?'#1b4332':'#1a1a1a',margin:0 }}>{m.label}</p>
                        <p style={{ fontSize:'11px',color:'#888',margin:0 }}>{m.sub}</p>
                      </div>
                      {form.method===m.id && <span style={{ marginLeft:'auto',color:'#2d6a4f',fontSize:'16px' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              <FieldInput label="Amount (ZMW) *" type="number" min="0" step="0.01" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} placeholder="e.g. 2450.00" required />
              {form.method === 'mobile_money' && (
                <FieldInput label="Mobile Number *" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+260 97X XXX XXX" />
              )}
              <FieldInput label="Reference / Note (optional)" value={form.reference} onChange={e=>setForm(p=>({...p,reference:e.target.value}))} placeholder="e.g. Maize payment Oct" />
              <Btn variant="teal" onClick={()=>setStep('confirm')} disabled={!form.amount} style={{ width:'100%',padding:'13px' }}>💳 Review Payment →</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW: Order Card (approve / reject / pay)
───────────────────────────────────────────── */
function OrderCard({ order, onApprove, onReject, approving, onPay }) {
  const sc = {
    pending:   { bg:'#fef3c7', color:'#92400e', border:'#fcd34d' },
    approved:  { bg:'#d8f3dc', color:'#1b4332', border:'#b7dfc7' },
    rejected:  { bg:'#fff5f5', color:'#b91c1c', border:'#fca5a5' },
    completed: { bg:'#dbeafe', color:'#1e40af', border:'#93c5fd' },
  }[order.status] || { bg:'#f3f4f6', color:'#374151', border:'#d1d5db' };

  return (
    <div style={{ border:`2px solid ${sc.border}`,borderRadius:'16px',overflow:'hidden',background:'#fff',transition:'box-shadow 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
    >
      <div style={{ padding:'12px 14px',borderBottom:`1px solid ${sc.border}`,background:`${sc.bg}66`,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <div>
          <p style={{ fontSize:'13px',fontWeight:700,color:'#1a1a1a',margin:0 }}>{formatField(order?.product?.name||order.product_id)}</p>
          <p style={{ fontSize:'11px',color:'#888',margin:'2px 0 0' }}>Order #{order.id} · Buyer #{order.buyer_id}</p>
        </div>
        <span style={{ fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'20px',background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,whiteSpace:'nowrap' }}>{formatField(order.status).toUpperCase()}</span>
      </div>
      <div style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex',gap:'16px',marginBottom:order.status==='pending'||order.status==='approved'?'12px':'0',flexWrap:'wrap',alignItems:'center' }}>
          {order.quantity   && <span style={{ fontSize:'12px',color:'#666' }}>📦 {order.quantity}</span>}
          {order.total_price && <span style={{ fontSize:'13px',fontWeight:700,color:'#2d6a4f' }}>K {order.total_price}</span>}
          <span style={{ fontSize:'11px',color:'#aaa',marginLeft:'auto' }}>{formatField(order.created_at)?.slice(0,10)}</span>
        </div>
        {order.status === 'pending' && (
          <div style={{ display:'flex',gap:'8px' }}>
            <Btn variant="green"  disabled={approving===order.id} onClick={()=>onApprove(order.id)} style={{ flex:1,padding:'9px 12px',fontSize:'12px' }}>{approving===order.id?'⏳...':'✅ Approve'}</Btn>
            <Btn variant="red"    disabled={approving===order.id} onClick={()=>onReject(order.id)}  style={{ flex:1,padding:'9px 12px',fontSize:'12px' }}>❌ Reject</Btn>
          </div>
        )}
        {order.status === 'approved' && onPay && (
          <Btn variant="teal" onClick={()=>onPay(order)} style={{ width:'100%',padding:'10px',fontSize:'13px' }}>💳 Make Payment</Btn>
        )}
        {order.status === 'completed' && <p style={{ fontSize:'12px',color:'#1e40af',fontWeight:600,margin:0 }}>🎉 Completed</p>}
        {order.status === 'rejected'  && <p style={{ fontSize:'12px',color:'#b91c1c',fontWeight:600,margin:0 }}>❌ Rejected</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function FarmerDashboard() {
  /* ── all original state ── */
  const [activeTab, setActiveTab]                     = useState('overview');
  const [dashboardSummary, setDashboardSummary]       = useState(null);
  const [profile, setProfile]                         = useState(null);
  const [marketPrices, setMarketPrices]               = useState([]);
  const [myProducts, setMyProducts]                   = useState([]);
  const [reports, setReports]                         = useState([]);
  const [selectedReport, setSelectedReport]           = useState(null);
  const [complaints, setComplaints]                   = useState([]);
  const [contacts, setContacts]                       = useState([]);
  const [inboxMessages, setInboxMessages]             = useState([]);
  const [sentMessages, setSentMessages]               = useState([]);
  const [selectedMessage, setSelectedMessage]         = useState(null);
  const [query, setQuery]                             = useState('');
  const [advice, setAdvice]                           = useState('');
  const [loadingAdvice, setLoadingAdvice]             = useState(false);
  const [loadingDashboard, setLoadingDashboard]       = useState(true);
  const [submittingProduct, setSubmittingProduct]     = useState(false);
  const [savingProfile, setSavingProfile]             = useState(false);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [sendingMessage, setSendingMessage]           = useState(false);
  const [profileSaved, setProfileSaved]               = useState('');
  const [notice, setNotice]                           = useState('');
  const [productForm, setProductForm]                 = useState(initialProductForm);
  const [complaintForm, setComplaintForm]             = useState(initialComplaintForm);
  const [messageForm, setMessageForm]                 = useState(initialMessageForm);
  const [profileForm, setProfileForm]                 = useState({ district:'', ward:'', farm_size_ha:'', crops:'' });
  const [error, setError]                             = useState('');

  /* ── NEW state ── */
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [approvingId, setApprovingId]   = useState(null);
  const [allOrders, setAllOrders]       = useState([]);
  const [imageTab, setImageTab]         = useState('url');

  /* ── original fetch (unchanged) ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingDashboard(true);
      try {
        const [dashboardRes,profileRes,marketRes,productsRes,reportsRes,complaintsRes,contactsRes,inboxRes,sentRes] =
          await Promise.all([
            api.get('/dashboard'), api.get('/dashboard/profile'), api.get('/dashboard/market-prices'),
            api.get('/dashboard/products'), api.get('/dashboard/reports'), api.get('/dashboard/complaints'),
            api.get('/dashboard/contacts'), api.get('/dashboard/messages?box=inbox'), api.get('/dashboard/messages?box=sent'),
          ]);
        setDashboardSummary(dashboardRes?.data?.data||null);
        setProfile(profileRes?.data?.data||null);
        setMarketPrices(marketRes?.data?.data||[]);
        setMyProducts(productsRes?.data?.data||[]);
        setReports(reportsRes?.data?.data||[]);
        setComplaints(complaintsRes?.data?.data||[]);
        setContacts(contactsRes?.data?.data||[]);
        setInboxMessages(inboxRes?.data?.data||[]);
        setSentMessages(sentRes?.data?.data||[]);
        const pd = profileRes?.data?.data?.profile||{};
        setProfileForm({ district:pd.district||'', ward:pd.ward||'', farm_size_ha:pd.farm_size_ha??'', crops:pd.crops||'' });
        /* NEW: try fetching full orders list */
        try { const or = await api.get('/dashboard/orders'); setAllOrders(or?.data?.data||[]); } catch {}
      } catch (err) {
        setError(err?.response?.data?.message||'Failed to load dashboard data.');
      } finally { setLoadingDashboard(false); }
    };
    fetchData();
  }, []);

  /* ── all original handlers (unchanged) ── */
  const askAdvice = async () => {
    if (!query.trim()) return;
    setLoadingAdvice(true); setError(''); setAdvice('');
    try { const res = await api.post('/gemini-advice/advice', { query }); setAdvice(res?.data?.advice||'No advice returned.'); }
    catch (err) { setError(err?.response?.data?.message||'AI request failed.'); }
    finally { setLoadingAdvice(false); }
  };

  const createProduct = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); setSubmittingProduct(true);
    try {
      const response = await api.post('/dashboard/products', { name:productForm.name, quantity:productForm.quantity, price:Number(productForm.price), image_url:productForm.image_url });
      const created = response?.data?.data;
      if (created) setMyProducts(prev=>[created,...prev]);
      setProductForm(initialProductForm);
      setNotice('Sale listing created successfully.');
    } catch (err) { setError(err?.response?.data?.message||'Failed to create product.'); }
    finally { setSubmittingProduct(false); }
  };

  const saveFarmerProfile = async (event) => {
    event.preventDefault(); setError(''); setProfileSaved(''); setSavingProfile(true);
    try {
      await api.put('/dashboard/profile', { name:profileUser.name, email:profileUser.email, language:profileUser.language, lat:profileUser.lat, lng:profileUser.lng,
        profileData:{ district:profileForm.district.trim(), ward:profileForm.ward.trim(), farm_size_ha:profileForm.farm_size_ha===''?null:Number(profileForm.farm_size_ha), crops:profileForm.crops.trim() } });
      setProfileSaved('Profile updated successfully.');
      setProfile(prev=>({...(prev||{}), profile:{...(prev?.profile||{}), ...profileForm}}));
    } catch (err) { setError(err?.response?.data?.message||'Failed to update profile.'); }
    finally { setSavingProfile(false); }
  };

  const handleImageFile = (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (reader.result) setProductForm(prev=>({...prev,image_url:reader.result})); };
    reader.readAsDataURL(file);
  };

  const submitComplaint = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); setSubmittingComplaint(true);
    try {
      const response = await api.post('/dashboard/complaints', { message:complaintForm.message });
      const created = response?.data?.data;
      if (created) setComplaints(prev=>[created,...prev]);
      setComplaintForm(initialComplaintForm); setNotice('Complaint submitted successfully.');
    } catch (err) { setError(err?.response?.data?.message||'Failed to submit complaint.'); }
    finally { setSubmittingComplaint(false); }
  };

  const sendMessage = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); setSendingMessage(true);
    try {
      const response = await api.post('/dashboard/messages', { recipient_id:Number(messageForm.recipient_id), content:messageForm.content, channel:'app' });
      const created = response?.data?.data;
      if (created) setSentMessages(prev=>[created,...prev]);
      setMessageForm(initialMessageForm); setNotice('Message sent successfully.');
    } catch (err) { setError(err?.response?.data?.message||'Failed to send message.'); }
    finally { setSendingMessage(false); }
  };

  const viewReportDetail = async (id) => {
    setError('');
    try { const res = await api.get(`/dashboard/reports/${id}`); setSelectedReport(res?.data?.data||null); setSelectedMessage(null); }
    catch (err) { setError(err?.response?.data?.message||'Failed to load report details.'); }
  };

  const viewMessageDetail = async (id) => {
    setError('');
    try { const res = await api.get(`/dashboard/messages/${id}`); setSelectedMessage(res?.data?.data||null); setSelectedReport(null); }
    catch (err) { setError(err?.response?.data?.message||'Failed to load message details.'); }
  };

  /* ── NEW handlers ── */
  const approveOrder = async (id) => {
    setApprovingId(id); setError('');
    try {
      await api.put(`/dashboard/orders/${id}/approve`, { status:'approved' });
      const patch = prev => prev.map(o=>o.id===id?{...o,status:'approved'}:o);
      setAllOrders(patch);
      setDashboardSummary(prev=>prev?{...prev,recentOrders:(prev.recentOrders||[]).map(o=>o.id===id?{...o,status:'approved'}:o)}:prev);
      setNotice('Order approved successfully.');
    } catch (err) { setError(err?.response?.data?.message||'Failed to approve order.'); }
    finally { setApprovingId(null); }
  };

  const rejectOrder = async (id) => {
    setApprovingId(id); setError('');
    try {
      await api.put(`/dashboard/orders/${id}/reject`, { status:'rejected' });
      const patch = prev => prev.map(o=>o.id===id?{...o,status:'rejected'}:o);
      setAllOrders(patch);
      setDashboardSummary(prev=>prev?{...prev,recentOrders:(prev.recentOrders||[]).map(o=>o.id===id?{...o,status:'rejected'}:o)}:prev);
      setNotice('Order rejected.');
    } catch (err) { setError(err?.response?.data?.message||'Failed to reject order.'); }
    finally { setApprovingId(null); }
  };

  const handlePaymentSuccess = (orderId) => {
    const patch = prev => prev.map(o=>o.id===orderId?{...o,status:'completed'}:o);
    setAllOrders(patch);
    setDashboardSummary(prev=>prev?{...prev,recentOrders:(prev.recentOrders||[]).map(o=>o.id===orderId?{...o,status:'completed'}:o)}:prev);
    setNotice('Payment submitted successfully!');
  };

  /* ── derived ── */
  const profileUser    = profile?.user    || {};
  const profileDetails = profile?.profile || {};
  const recentOrders   = dashboardSummary?.recentOrders || [];
  const displayOrders  = allOrders.length ? allOrders : recentOrders;
  const pendingCount   = displayOrders.filter(o=>o.status==='pending').length;

  const statCards = useMemo(() => [
    { label:'Market Listings', value:marketPrices.length,                                              icon:'📊', color:'#2d6a4f', bg:'#d8f3dc', border:'#b7dfc7' },
    { label:'My Sales',        value:myProducts.length,                                                icon:'🌽', color:'#92400e', bg:'#fef3c7', border:'#fcd34d' },
    { label:'Active Orders',   value:dashboardSummary?.stats?.activeOrders||0,                         icon:'📦', color:'#1e40af', bg:'#dbeafe', border:'#93c5fd' },
    { label:'Main Crops',      value:formatField(profileDetails.crops),                                icon:'🌾', color:'#065f46', bg:'#ecfdf5', border:'#6ee7b7' },
    { label:'Inbox',           value:inboxMessages.length,                                             icon:'✉️', color:'#6b21a8', bg:'#f3e8ff', border:'#c4b5fd' },
    { label:'Farm Size',       value:profileDetails.farm_size_ha?`${profileDetails.farm_size_ha} ha`:'Not set', icon:'🗺️', color:'#b45309', bg:'#fffbeb', border:'#fde68a' },
  ], [marketPrices.length, myProducts.length, dashboardSummary?.stats?.activeOrders, profileDetails.crops, profileDetails.farm_size_ha, inboxMessages.length]);

  const tabs = [
    { id:'overview',   icon:'🏠', label:'Overview'   },
    { id:'ai',         icon:'🤖', label:'AI Advisor'  },
    { id:'market',     icon:'📊', label:'Market'      },
    { id:'sales',      icon:'🌽', label:'My Sales'    },
    { id:'orders',     icon:'📦', label:'Orders',      alert:pendingCount||null },
    { id:'messages',   icon:'✉️', label:'Messages'    },
    { id:'complaints', icon:'🚨', label:'Complaints'  },
    { id:'reports',    icon:'📋', label:'Reports'     },
    { id:'profile',    icon:'👤', label:'Profile'     },
  ];

  return (
    <main style={{ minHeight:'calc(100vh - 64px)', background:'#f7f4ef', fontFamily:'"DM Sans",sans-serif' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse2  { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes badgePop{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        .tab-btn   { transition:all 0.2s; border:none; cursor:pointer; font-family:inherit; }
        .tab-btn:hover { transform:translateY(-1px); }
        .stat-card { transition:transform 0.2s,box-shadow 0.2s; }
        .stat-card:hover { transform:translateY(-4px) scale(1.02); box-shadow:0 12px 32px rgba(0,0,0,0.1) !important; }
        .msg-row   { transition:background 0.15s; }
        .msg-row:hover { background:#f0faf4 !important; }
        .market-row{ transition:background 0.15s; }
        .market-row:hover { background:#f7fdf9 !important; }
        .ai-thinking { animation:pulse2 1.5s ease-in-out infinite; }
        .alert-badge { animation:badgePop 2s ease-in-out infinite; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:4px; }
        select.field-sel { width:100%;padding:11px 14px;border-radius:10px;border:2px solid #e8e2d9;background:#faf9f7;font-size:13px;font-family:inherit;color:#1a1a1a;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center; }
        select.field-sel:focus { border-color:#2d6a4f; box-shadow:0 0 0 3px rgba(45,106,79,0.1); }
        .img-tab-btn { flex:1;padding:9px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;border-radius:8px;transition:all 0.15s; }
        .img-drop-zone { border:2px dashed #e8e2d9;border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#faf9f7; }
        .img-drop-zone:hover { border-color:#2d6a4f; background:#f0faf4; }
      `}</style>

      {/* Payment modal */}
      {paymentOrder && <PaymentModal order={paymentOrder} onClose={()=>setPaymentOrder(null)} onSuccess={handlePaymentSuccess} />}

      {/* ══ HERO ══ */}
      <div style={{ background:'linear-gradient(135deg,#0d1f0f 0%,#1b4332 45%,#2d6a4f 75%,#b5451b 100%)',padding:'36px 32px 28px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'-60px',right:'-60px',width:'280px',height:'280px',background:'radial-gradient(circle,rgba(134,239,172,0.13),transparent 70%)',borderRadius:'50%',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:'-40px',left:'-40px',width:'200px',height:'200px',background:'radial-gradient(circle,rgba(230,100,30,0.13),transparent 70%)',borderRadius:'50%',pointerEvents:'none' }} />
        <div style={{ position:'relative',maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px' }}>
          <div>
            <span style={{ display:'inline-flex',alignItems:'center',gap:'8px',fontSize:'11px',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'#86efac',background:'rgba(134,239,172,0.1)',border:'1px solid rgba(134,239,172,0.25)',padding:'4px 14px',borderRadius:'20px',marginBottom:'12px' }}>
              <span style={{ width:'7px',height:'7px',borderRadius:'50%',background:'#86efac',display:'inline-block' }} /> Farmer Workspace
            </span>
            <h1 style={{ fontFamily:'"Playfair Display",serif',fontWeight:900,fontSize:'clamp(1.6rem,3vw,2.4rem)',color:'#fff',lineHeight:1.1,marginBottom:'8px' }}>
              Welcome back, <span style={{ color:'#86efac' }}>{formatField(profileUser.name||'Farmer')}</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.6)',fontSize:'14px',lineHeight:1.6 }}>Manage sales, market prices, AI advice, messages, and more — all in one place.</p>
          </div>
          <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
            {[['District',formatField(profileDetails.district),false],['Farm Size',profileDetails.farm_size_ha?`${profileDetails.farm_size_ha} ha`:'Not set',false],['Crops',formatField(profileDetails.crops),true]].map(([l,v,hi])=>(
              <div key={l} style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',padding:'10px 16px',backdropFilter:'blur(8px)' }}>
                <p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'2px',textTransform:'uppercase',letterSpacing:'0.1em' }}>{l}</p>
                <p style={{ fontSize:'14px',fontWeight:700,color:hi?'#86efac':'#fff' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TAB NAV ══ */}
      <div style={{ background:'#fff',borderBottom:'2px solid #f0ebe3',position:'sticky',top:0,zIndex:40 }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'0 24px',display:'flex',gap:'4px',overflowX:'auto' }}>
          {tabs.map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setActiveTab(t.id)} style={{ padding:'14px 16px',display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:600,whiteSpace:'nowrap',position:'relative',background:'transparent',color:activeTab===t.id?'#2d6a4f':'#888',borderBottom:activeTab===t.id?'3px solid #2d6a4f':'3px solid transparent' }}>
              <span>{t.icon}</span> {t.label}
              {t.alert && <span className="alert-badge" style={{ position:'absolute',top:'8px',right:'4px',background:'#dc2626',color:'#fff',borderRadius:'50%',width:'18px',height:'18px',fontSize:'10px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center' }}>{t.alert}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth:'1200px',margin:'0 auto',padding:'28px 24px',display:'flex',flexDirection:'column',gap:'24px' }}>

        {error        && <div style={{ padding:'14px 18px',borderRadius:'12px',background:'#fff5f5',border:'2px solid #fca5a5',color:'#b91c1c',fontSize:'14px',display:'flex',gap:'10px',alignItems:'center' }}>⚠️ {error}</div>}
        {notice       && <div style={{ padding:'14px 18px',borderRadius:'12px',background:'#f0faf4',border:'2px solid #86efac',color:'#1b4332',fontSize:'14px',display:'flex',gap:'10px',alignItems:'center' }}>✅ {notice}</div>}
        {profileSaved && <div style={{ padding:'14px 18px',borderRadius:'12px',background:'#f0faf4',border:'2px solid #86efac',color:'#1b4332',fontSize:'14px' }}>✅ {profileSaved}</div>}

        {/* ── OVERVIEW ── */}
        {activeTab==='overview' && <>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'16px' }}>
            {statCards.map(c=>(
              <div key={c.label} className="stat-card" style={{ background:`linear-gradient(135deg,${c.bg},#fff)`,border:`2px solid ${c.border}`,borderRadius:'18px',padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:'24px',marginBottom:'8px' }}>{c.icon}</div>
                <div style={{ fontSize:'22px',fontWeight:900,color:c.color,fontFamily:'"Playfair Display",serif',marginBottom:'4px',wordBreak:'break-word' }}>{loadingDashboard?'—':c.value}</div>
                <div style={{ fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#888' }}>{c.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px' }}>
            <Panel>
              <PanelTitle icon="👤">Profile Overview</PanelTitle>
              {loadingDashboard?<p style={{ color:'#aaa',fontSize:'14px' }}>Loading...</p>:(
                <div>{[['Name',profileUser.name],['Phone',profileUser.phone],['Email',profileUser.email],['District',profileDetails.district],['Ward',profileDetails.ward],['Farm Size',profileDetails.farm_size_ha?`${profileDetails.farm_size_ha} ha`:null],['Crops',profileDetails.crops]].map(([k,v])=>(
                  <div key={k} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f0ebe3',fontSize:'13px' }}>
                    <span style={{ color:'#888',fontWeight:600 }}>{k}</span>
                    <span style={{ color:'#1a1a1a',fontWeight:600,textAlign:'right',maxWidth:'180px',wordBreak:'break-word' }}>{formatField(v)}</span>
                  </div>
                ))}</div>
              )}
            </Panel>
            <Panel>
              <PanelTitle icon="📦" badge={recentOrders.length}>Recent Orders</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'10px',maxHeight:'360px',overflowY:'auto' }}>
                {recentOrders.map(order=><OrderCard key={order.id} order={order} onApprove={approveOrder} onReject={rejectOrder} approving={approvingId} onPay={setPaymentOrder} />)}
                {!recentOrders.length && <p style={{ color:'#aaa',fontSize:'13px' }}>No recent orders.</p>}
              </div>
            </Panel>
          </div>
        </>}

        {/* ── AI ── */}
        {activeTab==='ai' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <div style={{ background:'linear-gradient(135deg,#0d1f0f,#1b4332,#2d6a4f)',borderRadius:'24px',padding:'32px',position:'relative',overflow:'hidden' }}>
              <div style={{ position:'absolute',top:'-40px',right:'-40px',width:'180px',height:'180px',background:'radial-gradient(circle,rgba(134,239,172,0.12),transparent 70%)',borderRadius:'50%' }} />
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px' }}>
                  <div style={{ width:'48px',height:'48px',borderRadius:'50%',background:'rgba(134,239,172,0.15)',border:'2px solid rgba(134,239,172,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px' }}>🤖</div>
                  <div>
                    <p style={{ fontFamily:'"Playfair Display",serif',fontWeight:900,fontSize:'20px',color:'#fff',marginBottom:'2px' }}>AI Farm Advisor</p>
                    <p style={{ fontSize:'12px',color:'rgba(255,255,255,0.5)' }}>Powered by Gemini · Always available</p>
                  </div>
                </div>
                <p style={{ fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.4)',marginBottom:'10px' }}>Quick prompts</p>
                <div style={{ display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'20px' }}>
                  {['My maize leaves are yellowing','Best time to plant groundnuts','How to store soya beans','Signs of fall armyworm','Improve soil fertility cheaply'].map(s=>(
                    <button key={s} onClick={()=>setQuery(s)} style={{ padding:'6px 12px',borderRadius:'20px',border:'1px solid rgba(134,239,172,0.3)',background:'rgba(134,239,172,0.08)',color:'#86efac',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',transition:'background 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(134,239,172,0.18)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(134,239,172,0.08)'}
                    >{s}</button>
                  ))}
                </div>
                <FieldTextarea label="Describe your farm challenge" value={query} onChange={e=>setQuery(e.target.value)} rows={5} placeholder="e.g. My maize is 4 weeks old and the leaves are turning pale yellow after heavy rains..." style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',marginBottom:'14px' }} />
                <button onClick={askAdvice} disabled={loadingAdvice||!query.trim()} style={{ width:'100%',padding:'13px',borderRadius:'50px',border:'none',background:loadingAdvice?'rgba(134,239,172,0.2)':'linear-gradient(135deg,#52b788,#86efac)',color:loadingAdvice?'rgba(255,255,255,0.6)':'#0d1f0f',fontSize:'14px',fontWeight:700,fontFamily:'inherit',cursor:loadingAdvice||!query.trim()?'not-allowed':'pointer',opacity:!query.trim()?0.5:1,transition:'all 0.2s' }}>
                  {loadingAdvice?<span className="ai-thinking">⏳ Analysing your crop challenge...</span>:'🌱 Get AI Advice'}
                </button>
              </div>
            </div>
            <Panel style={{ minHeight:'300px' }}>
              <PanelTitle icon="💡">AI Response</PanelTitle>
              {advice?(
                <div style={{ background:'#f7fdf9',border:'2px solid #b7dfc7',borderRadius:'14px',padding:'18px',fontSize:'14px',color:'#1a1a1a',lineHeight:1.75,whiteSpace:'pre-wrap' }}>{advice}</div>
              ):(
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'240px',gap:'14px' }}>
                  <span style={{ fontSize:'48px' }}>🤖</span>
                  <p style={{ fontSize:'14px',color:'#aaa',textAlign:'center' }}>Your AI advice will appear here.<br/>Ask about crops, pests, soil, weather, or storage.</p>
                </div>
              )}
            </Panel>
          </div>
        )}

        {/* ── MARKET ── */}
        {activeTab==='market' && (
          <Panel>
            <PanelTitle icon="📊" badge={`${marketPrices.length} listings`}>Live Market Prices</PanelTitle>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse',minWidth:'480px' }}>
                <thead><tr style={{ background:'#f7fdf9',borderBottom:'2px solid #d8f3dc' }}>
                  {['Product','Market','Price (ZMW)'].map((h,i)=><th key={h} style={{ padding:'12px 14px',textAlign:i===2?'right':'left',fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#2d6a4f' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {loadingDashboard && <tr><td colSpan="3" style={{ padding:'32px',textAlign:'center',color:'#aaa' }}>Loading...</td></tr>}
                  {!loadingDashboard&&!marketPrices.length && <tr><td colSpan="3" style={{ padding:'32px',textAlign:'center',color:'#aaa' }}>No market data.</td></tr>}
                  {marketPrices.map((item,i)=>(
                    <tr key={item.id} className="market-row" style={{ borderBottom:'1px solid #f0ebe3',background:i%2===0?'#fff':'#fafafa' }}>
                      <td style={{ padding:'12px 14px',fontSize:'14px',fontWeight:600,color:'#1a1a1a' }}>{item.product||item.name||'—'}</td>
                      <td style={{ padding:'12px 14px',fontSize:'13px',color:'#666' }}>{item.market_name||item.location||'—'}</td>
                      <td style={{ padding:'12px 14px',fontSize:'15px',fontWeight:800,color:'#2d6a4f',textAlign:'right',fontFamily:'"Playfair Display",serif' }}>K {item.price??item.price_per_unit??'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {/* ── SALES (enhanced image upload) ── */}
        {activeTab==='sales' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <Panel>
              <PanelTitle icon="➕">Create Sale Listing</PanelTitle>
              <form onSubmit={createProduct} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
                <FieldInput label="Product Name *" value={productForm.name} onChange={e=>setProductForm(p=>({...p,name:e.target.value}))} placeholder="e.g. White Maize" required />
                <FieldInput label="Quantity *" value={productForm.quantity} onChange={e=>setProductForm(p=>({...p,quantity:e.target.value}))} placeholder="e.g. 50 x 50kg bags" required />
                <FieldInput label="Price (ZMW) *" type="number" step="0.01" min="0" value={productForm.price} onChange={e=>setProductForm(p=>({...p,price:e.target.value}))} placeholder="e.g. 2450" required />

                {/* ── NEW: tabbed image input ── */}
                <div>
                  <label style={{ display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888',marginBottom:'8px' }}>Product Image</label>
                  <div style={{ display:'flex',gap:'4px',background:'#f0ebe3',borderRadius:'10px',padding:'4px',marginBottom:'10px' }}>
                    {[['url','🔗 Paste URL'],['upload','📷 Upload Photo']].map(([id,lb])=>(
                      <button key={id} type="button" className="img-tab-btn" onClick={()=>setImageTab(id)} style={{ background:imageTab===id?'#fff':'transparent',color:imageTab===id?'#2d6a4f':'#888',boxShadow:imageTab===id?'0 1px 6px rgba(0,0,0,0.08)':'none' }}>{lb}</button>
                    ))}
                  </div>

                  {imageTab==='url' ? (
                    <>
                      <FieldInput value={productForm.image_url} onChange={e=>setProductForm(p=>({...p,image_url:e.target.value.trim()}))} placeholder="https://example.com/maize.jpg" type="url" />
                      {productForm.image_url && (
                        <div style={{ borderRadius:'10px',overflow:'hidden',marginTop:'8px',border:'2px solid #e8e2d9' }}>
                          <img src={productForm.image_url} alt="Preview" style={{ width:'100%',height:'140px',objectFit:'cover',display:'block' }} onError={e=>e.currentTarget.style.display='none'} />
                        </div>
                      )}
                    </>
                  ) : (
                    <label className="img-drop-zone" style={{ display:'block' }}>
                      <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageFile} />
                      {productForm.image_url && productForm.image_url.startsWith('data:') ? (
                        <div style={{ position:'relative' }}>
                          <img src={productForm.image_url} alt="Preview" style={{ width:'100%',height:'160px',objectFit:'cover',borderRadius:'8px',display:'block' }} />
                          <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.38)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.2s' }}
                            onMouseEnter={e=>e.currentTarget.style.opacity=1}
                            onMouseLeave={e=>e.currentTarget.style.opacity=0}
                          ><span style={{ color:'#fff',fontWeight:700,fontSize:'13px' }}>Click to change</span></div>
                        </div>
                      ) : (
                        <div style={{ padding:'20px 0' }}>
                          <div style={{ fontSize:'36px',marginBottom:'8px' }}>📷</div>
                          <p style={{ fontSize:'13px',fontWeight:600,color:'#555',marginBottom:'4px' }}>Click to upload or drag & drop</p>
                          <p style={{ fontSize:'11px',color:'#aaa' }}>JPG, PNG, WebP · Max 5MB</p>
                        </div>
                      )}
                    </label>
                  )}
                </div>

                {productForm.image_url && <button type="button" onClick={()=>setProductForm(p=>({...p,image_url:''}))} style={{ alignSelf:'flex-start',background:'none',border:'none',color:'#dc2626',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',padding:0 }}>✕ Remove image</button>}

                <Btn type="submit" variant="amber" disabled={submittingProduct} style={{ alignSelf:'flex-start' }}>
                  {submittingProduct?'⏳ Saving...':'🌽 Create Sale'}
                </Btn>
              </form>
            </Panel>

            <Panel>
              <PanelTitle icon="📦" badge={myProducts.length}>My Listings</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'12px',maxHeight:'560px',overflowY:'auto' }}>
                {loadingDashboard && <p style={{ color:'#aaa',fontSize:'14px' }}>Loading...</p>}
                {!loadingDashboard&&!myProducts.length && <p style={{ color:'#aaa',fontSize:'14px' }}>No listings yet. Create your first sale.</p>}
                {myProducts.map(item=>(
                  <div key={item.id} style={{ border:'2px solid #f0ebe3',borderRadius:'14px',overflow:'hidden',transition:'border-color 0.2s,box-shadow 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#b7dfc7';e.currentTarget.style.boxShadow='0 4px 16px rgba(45,106,79,0.1)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#f0ebe3';e.currentTarget.style.boxShadow='none';}}
                  >
                    {item.image_url && <img src={item.image_url} alt={item.name} style={{ width:'100%',height:'120px',objectFit:'cover',display:'block' }} onError={e=>e.currentTarget.style.display='none'} />}
                    <div style={{ padding:'14px' }}>
                      <p style={{ fontWeight:700,fontSize:'15px',color:'#1a1a1a',marginBottom:'4px' }}>{item.name}</p>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                        <span style={{ fontSize:'13px',color:'#666' }}>{item.quantity}</span>
                        <span style={{ fontSize:'16px',fontWeight:900,color:'#2d6a4f',fontFamily:'"Playfair Display",serif' }}>K {item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {/* ── ORDERS (new tab) ── */}
        {activeTab==='orders' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <Panel>
              <PanelTitle icon="⏳" badge={pendingCount}>Pending Approval</PanelTitle>
              {loadingDashboard && <p style={{ color:'#aaa',fontSize:'13px' }}>Loading orders...</p>}
              <div style={{ display:'flex',flexDirection:'column',gap:'12px',maxHeight:'520px',overflowY:'auto' }}>
                {displayOrders.filter(o=>o.status==='pending').map(order=>(
                  <OrderCard key={order.id} order={order} onApprove={approveOrder} onReject={rejectOrder} approving={approvingId} onPay={setPaymentOrder} />
                ))}
                {!loadingDashboard&&!displayOrders.filter(o=>o.status==='pending').length && (
                  <div style={{ textAlign:'center',padding:'32px 0' }}>
                    <div style={{ fontSize:'40px',marginBottom:'10px' }}>✅</div>
                    <p style={{ fontSize:'14px',color:'#aaa' }}>No pending orders. All caught up!</p>
                  </div>
                )}
              </div>
            </Panel>

            <Panel>
              <PanelTitle icon="📦" badge={displayOrders.length}>All Orders</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'12px',maxHeight:'520px',overflowY:'auto' }}>
                {displayOrders.map(order=>(
                  <OrderCard key={order.id} order={order} onApprove={approveOrder} onReject={rejectOrder} approving={approvingId} onPay={setPaymentOrder} />
                ))}
                {!loadingDashboard&&!displayOrders.length && <p style={{ color:'#aaa',fontSize:'13px' }}>No orders found.</p>}
              </div>
            </Panel>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {activeTab==='messages' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
              <Panel>
                <PanelTitle icon="📤">Send Message</PanelTitle>
                <form onSubmit={sendMessage} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
                  <div>
                    <label style={{ display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888',marginBottom:'5px' }}>Recipient *</label>
                    <select className="field-sel" value={messageForm.recipient_id} onChange={e=>setMessageForm(p=>({...p,recipient_id:e.target.value}))} required>
                      <option value="">Select recipient</option>
                      {contacts.map(c=><option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
                    </select>
                  </div>
                  <FieldTextarea label="Message *" rows={4} value={messageForm.content} onChange={e=>setMessageForm(p=>({...p,content:e.target.value}))} placeholder="Type your message..." required />
                  <Btn type="submit" variant="indigo" disabled={sendingMessage||!messageForm.recipient_id||!messageForm.content.trim()} style={{ alignSelf:'flex-start' }}>{sendingMessage?'⏳ Sending...':'✉️ Send Message'}</Btn>
                </form>
              </Panel>
              <Panel>
                <PanelTitle icon="📥" badge={inboxMessages.length}>Inbox</PanelTitle>
                <div style={{ display:'flex',flexDirection:'column',gap:'8px',maxHeight:'240px',overflowY:'auto' }}>
                  {inboxMessages.map(item=>(
                    <button key={item.id} onClick={()=>viewMessageDetail(item.id)} className="msg-row" style={{ width:'100%',textAlign:'left',padding:'12px 14px',borderRadius:'12px',border:'2px solid #f0ebe3',background:'#fff',cursor:'pointer',fontFamily:'inherit' }}>
                      <p style={{ fontSize:'13px',fontWeight:700,color:'#1a1a1a',marginBottom:'2px' }}>From: {formatField(item?.sender?.name)}</p>
                      <p style={{ fontSize:'12px',color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{formatField(item.content)}</p>
                    </button>
                  ))}
                  {!inboxMessages.length && <p style={{ fontSize:'13px',color:'#aaa' }}>No received messages.</p>}
                </div>
              </Panel>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
              <Panel>
                <PanelTitle icon="📨" badge={sentMessages.length}>Sent</PanelTitle>
                <div style={{ display:'flex',flexDirection:'column',gap:'8px',maxHeight:'200px',overflowY:'auto' }}>
                  {sentMessages.map(item=>(
                    <button key={item.id} onClick={()=>viewMessageDetail(item.id)} className="msg-row" style={{ width:'100%',textAlign:'left',padding:'12px 14px',borderRadius:'12px',border:'2px solid #f0ebe3',background:'#fff',cursor:'pointer',fontFamily:'inherit' }}>
                      <p style={{ fontSize:'13px',fontWeight:700,color:'#1a1a1a',marginBottom:'2px' }}>To: {formatField(item?.recipient?.name)}</p>
                      <p style={{ fontSize:'12px',color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{formatField(item.content)}</p>
                    </button>
                  ))}
                  {!sentMessages.length && <p style={{ fontSize:'13px',color:'#aaa' }}>No sent messages.</p>}
                </div>
              </Panel>
              {(selectedMessage||selectedReport) && (
                <Panel style={{ border:'2px solid #b7dfc7' }}>
                  <PanelTitle icon="🔍">Details</PanelTitle>
                  {selectedMessage && (
                    <div style={{ fontSize:'13px',display:'flex',flexDirection:'column',gap:'8px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{ color:'#888' }}>From</span><span style={{ fontWeight:600 }}>{formatField(selectedMessage?.sender?.name)}</span></div>
                      <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{ color:'#888' }}>To</span><span style={{ fontWeight:600 }}>{formatField(selectedMessage?.recipient?.name)}</span></div>
                      <div style={{ background:'#f7fdf9',border:'1px solid #d8f3dc',borderRadius:'10px',padding:'12px',lineHeight:1.6,whiteSpace:'pre-wrap' }}>{formatField(selectedMessage.content)}</div>
                      <p style={{ fontSize:'11px',color:'#aaa' }}>{formatField(selectedMessage.created_at)}</p>
                    </div>
                  )}
                </Panel>
              )}
            </div>
          </div>
        )}

        {/* ── COMPLAINTS ── */}
        {activeTab==='complaints' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <Panel>
              <PanelTitle icon="🚨">Submit Complaint</PanelTitle>
              <form onSubmit={submitComplaint} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
                <FieldTextarea label="Describe your complaint *" rows={5} value={complaintForm.message} onChange={e=>setComplaintForm({message:e.target.value})} placeholder="Describe the issue in detail..." required />
                <Btn type="submit" variant="red" disabled={submittingComplaint||!complaintForm.message.trim()} style={{ alignSelf:'flex-start' }}>{submittingComplaint?'⏳ Submitting...':'🚨 Submit Complaint'}</Btn>
              </form>
            </Panel>
            <Panel>
              <PanelTitle icon="📋" badge={complaints.length}>My Complaints</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'10px',maxHeight:'400px',overflowY:'auto' }}>
                {complaints.map(item=>(
                  <div key={item.id} style={{ background:'#fff5f5',border:'2px solid #fca5a5',borderRadius:'12px',padding:'14px' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'6px' }}>
                      <span style={{ fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#888' }}>Complaint</span>
                      <span style={{ fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:item.status==='resolved'?'#d8f3dc':'#fef3c7',color:item.status==='resolved'?'#1b4332':'#92400e' }}>{item.status==='resolved'?'✅ Resolved':'⏳ Pending'}</span>
                    </div>
                    <p style={{ fontSize:'13px',color:'#555',lineHeight:1.6,whiteSpace:'pre-wrap' }}>{item.message}</p>
                  </div>
                ))}
                {!complaints.length && <p style={{ fontSize:'13px',color:'#aaa' }}>No complaints submitted yet.</p>}
              </div>
            </Panel>
          </div>
        )}

        {/* ── REPORTS ── */}
        {activeTab==='reports' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <Panel>
              <PanelTitle icon="📋" badge={reports.length}>My Reports</PanelTitle>
              <div style={{ display:'flex',flexDirection:'column',gap:'8px',maxHeight:'480px',overflowY:'auto' }}>
                {reports.map(item=>(
                  <button key={item.id} onClick={()=>viewReportDetail(item.id)} className="msg-row" style={{ width:'100%',textAlign:'left',padding:'14px',borderRadius:'12px',border:'2px solid #f0ebe3',background:'#fff',cursor:'pointer',fontFamily:'inherit' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'4px' }}>
                      <span style={{ fontSize:'12px',fontWeight:700,color:'#888' }}>#{item.id}</span>
                      <span style={{ fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'20px',background:'#f0faf4',color:'#2d6a4f',border:'1px solid #b7dfc7' }}>{formatField(item.status)}</span>
                    </div>
                    <p style={{ fontSize:'13px',color:'#1a1a1a',lineHeight:1.5 }}>{formatField(item.report_text)}</p>
                  </button>
                ))}
                {!reports.length && <p style={{ fontSize:'13px',color:'#aaa' }}>No reports found.</p>}
              </div>
            </Panel>
            <Panel>
              <PanelTitle icon="🔍">Report Details</PanelTitle>
              {selectedReport?(
                <div style={{ display:'flex',flexDirection:'column',gap:'10px',fontSize:'13px' }}>
                  <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{ color:'#888' }}>Report ID</span><span style={{ fontWeight:700 }}>#{selectedReport.id}</span></div>
                  <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{ color:'#888' }}>Status</span><span style={{ fontWeight:700,color:'#2d6a4f' }}>{formatField(selectedReport.status)}</span></div>
                  <div style={{ background:'#f7fdf9',border:'1px solid #d8f3dc',borderRadius:'10px',padding:'14px',lineHeight:1.7,whiteSpace:'pre-wrap',marginTop:'4px' }}>{formatField(selectedReport.report_text)}</div>
                  <p style={{ fontSize:'11px',color:'#aaa' }}>{formatField(selectedReport.created_at)}</p>
                </div>
              ):(
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'200px',gap:'12px' }}>
                  <span style={{ fontSize:'40px' }}>📋</span>
                  <p style={{ fontSize:'13px',color:'#aaa',textAlign:'center' }}>Select a report to see its details.</p>
                </div>
              )}
            </Panel>
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab==='profile' && (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start' }}>
            <Panel>
              <PanelTitle icon="✏️">Update Farmer Profile</PanelTitle>
              <form onSubmit={saveFarmerProfile} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
                  <FieldInput label="District" value={profileForm.district} onChange={e=>setProfileForm(p=>({...p,district:e.target.value}))} placeholder="e.g. Lusaka" />
                  <FieldInput label="Ward" value={profileForm.ward} onChange={e=>setProfileForm(p=>({...p,ward:e.target.value}))} placeholder="e.g. Chelstone" />
                  <FieldInput label="Farm Size (ha)" type="number" min="0" step="0.01" value={profileForm.farm_size_ha} onChange={e=>setProfileForm(p=>({...p,farm_size_ha:e.target.value}))} placeholder="e.g. 5.0" />
                  <FieldInput label="Crops Grown" value={profileForm.crops} onChange={e=>setProfileForm(p=>({...p,crops:e.target.value}))} placeholder="e.g. Maize, Soybeans" />
                </div>
                <Btn type="submit" variant="green" disabled={savingProfile} style={{ alignSelf:'flex-start' }}>{savingProfile?'⏳ Saving...':'💾 Save Profile'}</Btn>
              </form>
            </Panel>
            <Panel>
              <PanelTitle icon="👤">Account Info</PanelTitle>
              {[['Full Name',profileUser.name],['Phone',profileUser.phone],['Email',profileUser.email],['Language',profileUser.language],['Role',profileUser.role],['Latitude',profileUser.lat],['Longitude',profileUser.lng]].map(([k,v])=>(
                <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0ebe3',fontSize:'13px' }}>
                  <span style={{ color:'#888',fontWeight:600 }}>{k}</span>
                  <span style={{ color:'#1a1a1a',fontWeight:600 }}>{formatField(v)}</span>
                </div>
              ))}
            </Panel>
          </div>
        )}

      </div>
    </main>
  );
}