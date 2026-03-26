import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest("GET", "/api/analytics/summary");
        const result = await res.json();

        if (!res.ok) {
          setError(result.message);
          return;
        }

        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="p-10 text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Loading analytics...</div>;
  }

  // ---------------- CHART DATA ----------------
  const pieData = [
    { name: "Expired", value: data.expired },
    { name: "Expiring Soon", value: data.expiringSoon },
    { name: "Safe", value: data.safe },
  ];

  const categoryData = Object.entries(data.categoryCounts || {}).map(
    ([key, value]) => ({
      category: key,
      count: value,
    })
  );

  const monthlyData = Object.entries(data.monthlyExpired || {}).map(
    ([month, value]) => ({
      month,
      count: value,
    })
  );

  // ---------------- AI INSIGHTS ----------------
  const insights: string[] = [];

  if (data.total > 0) {
    const expiredPercent = (data.expired / data.total) * 100;

    if (expiredPercent > 50) {
      insights.push(`⚠️ ${Math.round(expiredPercent)}% items expired. Reduce overbuying.`);
    }

    if (data.expiringSoon > 0) {
      insights.push(`⏳ ${data.expiringSoon} items expiring soon. Use them quickly.`);
    }

    if (data.totalWasteCost > 0) {
      insights.push(`💸 You lost ₹${data.totalWasteCost} due to expired items.`);
    }
  }

  const topCategory = Object.entries(data.categoryCounts || {}).sort(
    (a: any, b: any) => b[1] - a[1]
  )[0];

  if (topCategory) {
    insights.push(`📦 Most items belong to "${topCategory[0]}" category.`);
  }

  // ---------------- HEALTH SCORE ----------------
  const healthScore =
    data.total > 0
      ? Math.max(0, 100 - Math.round((data.expired / data.total) * 100))
      : 100;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 AI Analytics Dashboard</h1>

        <Link href="/dashboard">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
            ← Back
          </button>
        </Link>
      </div>

      {/* HEALTH SCORE */}
      <div className="bg-green-100 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">🏥 Inventory Health Score</h2>
        <p className="text-3xl font-bold">{healthScore}/100</p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Expired" value={data.expired} color="red" />
        <Card title="Expiring Soon" value={data.expiringSoon} color="yellow" />
        <Card title="Safe" value={data.safe} color="green" />
        <Card title="Total" value={data.total} color="blue" />
      </div>

      {/* WASTE */}
      <motion.div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">💸 Total Waste</h2>
        <p className="text-3xl font-bold text-red-600">
          ₹ {data.totalWasteCost?.toLocaleString()}
        </p>
      </motion.div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* PIE */}
        <ChartCard title="Inventory Health">
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              <Cell fill="#EF4444" />
              <Cell fill="#F59E0B" />
              <Cell fill="#10B981" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        {/* CATEGORY */}
        <ChartCard title="Category Distribution">
          <BarChart data={categoryData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </ChartCard>

        {/* MONTHLY */}
        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">📈 Expiry Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line dataKey="count" stroke="#EF4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">🧠 AI Insights</h2>

        {insights.length > 0 ? (
          insights.map((text, i) => (
            <p key={i} className="mb-2 text-gray-700">
              {text}
            </p>
          ))
        ) : (
          <p className="text-green-600">✅ Your inventory is well managed!</p>
        )}
      </div>
    </div>
  );
}

// ---------------- REUSABLE COMPONENTS ----------------

function Card({ title, value, color }: any) {
  const colors: any = {
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className={`p-5 rounded-xl shadow ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}