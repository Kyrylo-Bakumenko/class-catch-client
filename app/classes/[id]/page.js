"use client";

import { useState, useEffect, use } from "react";
import { Line } from "react-chartjs-2";
import { Filler } from 'chart.js'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#374151",
        font: {
          size: 14,
          weight: 500,
        },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#111827",
      bodyColor: "#374151",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        font: { size: 12 },
        padding: 8,
      },
      border: {
        color: "#e5e7eb",
      },
    },
    y: {
      grid: {
        color: "#f3f4f6",
        borderDash: [4],
      },
      ticks: {
        color: "#6b7280",
        font: { size: 12 },
        padding: 8,
        stepSize: 1,
      },
      border: {
        color: "transparent",
      },
      beginAtZero: false,
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hoverRadius: 6,
      backgroundColor: "#38a169",
      borderWidth: 2,
      borderColor: "#fff",
    },
  },
};

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);

export default function ClassDetailPage({ params }) {
  params = use(params); // unwraps params promise
  const classId = params.id;
  const [classInfo, setClassInfo] = useState(null);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // || "http://localhost:8000";

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [classRes, historyRes] = await Promise.all([
        fetch(`${BASE_URL}/api/classes/${classId}/`),
        fetch(`${BASE_URL}/api/classes/${classId}/enrollment_history/`),
      ]);

      if (!classRes.ok || !historyRes.ok) {
        throw new Error("Failed to fetch class details or history");
      }

      const classData = await classRes.json();
      const historyData = await historyRes.json();

      setClassInfo(classData);
      setEnrollmentHistory(historyData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId]);

  // then for the dataset
  const chartData = {
    labels: enrollmentHistory.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Enrollment Over Time",
        data: enrollmentHistory.map((entry) => entry.enrollment),
        borderColor: "#38a169",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(56, 161, 105, 0.15)");
          gradient.addColorStop(1, "rgba(56, 161, 105, 0)");
          return gradient;
        },
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#38a169",
      },
    ],
  };

  const handleRetry = () => {
    fetchData();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  // basic error handling
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={handleRetry}
          className="mt-2 bg-brandGreen text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!classInfo) return <p className="p-4">Class not found.</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-2xl font-bold">{classInfo.title}</h1>
      </div>
      <p className="text-gray-700 mt-2">
        {classInfo.class_code} {classInfo.course_number}
      </p>
      <p className="text-gray-700 mt-2">{classInfo.instructor}</p>
      <p className="text-gray-700 mt-2">
        Enrollment: {classInfo.enrollment}/{classInfo.limit}
      </p>

      {/* Enrollment History */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enrollment History
        </h3>
        <div className="h-72">
          <Line data={chartData} options={options} />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Historical enrollment data updated daily
        </p>
      </div>
    </div>
  );
}
