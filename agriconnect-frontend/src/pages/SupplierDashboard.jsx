import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function SupplierDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/dashboard/profile').then((res) => setProfile(res?.data?.data || null)).catch(() => null);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-soil">Supplier Dashboard</h1>

      <section className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
        <h2 className="font-semibold text-lg text-soil mb-2">Profile</h2>
        <pre className="text-sm text-stone-700 whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>
      </section>

      <section className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
        <h2 className="font-semibold text-lg text-soil">Supply Listings</h2>
        <p className="text-stone-600 mt-2">Placeholder for supply inventory and listing management.</p>
      </section>
    </main>
  );
}
