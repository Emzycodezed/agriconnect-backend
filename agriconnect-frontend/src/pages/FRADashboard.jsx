import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

export default function FRADashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [dashboardRes, marketRes] = await Promise.all([
        api.get('/dashboard').catch(() => ({ data: { data: null } })),
        api.get('/dashboard/market-prices').catch(() => ({ data: { data: [] } })),
      ]);

      setDashboard(dashboardRes?.data?.data || null);
      setMarketPrices(marketRes?.data?.data || []);
    };

    fetchData().catch(() => null);
  }, []);

  const stats = dashboard?.stats || {};

  const productRows = useMemo(
    () => marketPrices.filter((item) => item.product || item.name),
    [marketPrices]
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-soil">FRA Dashboard</h1>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
            <p className="text-sm text-stone-500">{key}</p>
            <p className="text-2xl font-bold text-soil">{String(value)}</p>
          </div>
        ))}
        {!Object.keys(stats).length && (
          <div className="bg-white p-5 rounded-xl shadow-soft border border-stone-100 text-stone-500">
            No statistics available.
          </div>
        )}
      </section>

      <section className="bg-white p-5 rounded-xl shadow-soft border border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg text-soil">Product Market Board</h2>
          <span className="text-xs text-stone-500">Derived from market product entries</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b text-left text-stone-500">
                <th className="py-2 pr-3 font-semibold">Product</th>
                <th className="py-2 pr-3 font-semibold">Market</th>
                <th className="py-2 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {productRows.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">{item.product || item.name || '-'}</td>
                  <td className="py-2 pr-3">{item.market_name || item.location || '-'}</td>
                  <td className="py-2 font-semibold text-soil">{item.price ?? item.price_per_unit ?? '-'}</td>
                </tr>
              ))}
              {!productRows.length && (
                <tr>
                  <td colSpan="3" className="py-4 text-stone-500">No product market entries available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
