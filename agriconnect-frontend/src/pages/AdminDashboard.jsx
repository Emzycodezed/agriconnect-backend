import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [dashboardRes, profileRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/profile'),
      ]);
      setDashboard(dashboardRes?.data?.data || null);
      setProfile(profileRes?.data?.data || null);
    };

    fetchData().catch(() => null);
  }, []);

  const stats = dashboard?.stats || {};

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-soil">Admin Dashboard</h1>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
            <p className="text-sm text-stone-500">{key}</p>
            <p className="text-2xl font-bold text-soil">{String(value)}</p>
          </div>
        ))}
      </section>

      <section className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
        <h2 className="font-semibold text-lg text-soil mb-2">User Info</h2>
        <pre className="text-sm text-stone-700 whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>
      </section>
    </main>
  );
}
