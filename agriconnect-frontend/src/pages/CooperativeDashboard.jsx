import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CooperativeDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setDashboard(res?.data?.data || null)).catch(() => null);
  }, []);

  const farmerList = dashboard?.farmers || dashboard?.recentUsers || dashboard?.recentReports || [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-soil">Cooperative Dashboard</h1>

      <section className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
        <h2 className="font-semibold text-lg text-soil mb-3">Farmer Profiles</h2>
        <ul className="space-y-2">
          {farmerList.map((farmer, idx) => (
            <li key={farmer.id || idx} className="p-3 rounded-lg border border-stone-200">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(farmer, null, 2)}</pre>
            </li>
          ))}
          {!farmerList.length && <li className="text-stone-500">No farmer data available.</li>}
        </ul>
      </section>
    </main>
  );
}
