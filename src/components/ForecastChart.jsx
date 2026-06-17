// components/ForecastChart.jsx
import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#BA7517'];
const DASH_PATTERNS = [[], [6, 3], [2, 2], [8, 4], [4, 2]];

function toF(c) { return Math.round((c * 9) / 5 + 32); }

export default function ForecastChart({ cities, darkMode, unit = 'C' }) {
  if (!cities.length) return null;
  const s = getStyles(darkMode);

  const labels = cities[0]?.forecast?.map((d) => `${d.day} ${d.date}`) || [];

  const datasets = cities.map((city, i) => ({
    label: city.name,
    data: city.forecast?.map((d) => unit === 'F' ? toF(d.high) : Math.round(d.high)) || [],
    borderColor: COLORS[i % COLORS.length],
    backgroundColor: COLORS[i % COLORS.length] + '18',
    borderDash: DASH_PATTERNS[i % DASH_PATTERNS.length],
    fill: false,
    tension: 0.35,
    pointRadius: 5,
    pointHoverRadius: 7,
    borderWidth: 2.5,
  }));

  const gridColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const tickColor = darkMode ? '#666' : '#888';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#1a1a1a' : '#fff',
        titleColor: darkMode ? '#ccc' : '#333',
        bodyColor: darkMode ? '#aaa' : '#555',
        borderColor: darkMode ? '#2a2a2a' : '#e0e0e0',
        borderWidth: 1,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}°${unit}` },
      },
    },
    scales: {
      y: {
        ticks: { callback: (v) => v + `°${unit}`, font: { size: 12 }, color: tickColor },
        grid: { color: gridColor },
      },
      x: {
        ticks: { font: { size: 12 }, color: tickColor },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={s.wrapper}>
      <h3 style={s.heading}>High temperature trend (°{unit})</h3>
      <div style={s.legend}>
        {cities.map((c, i) => (
          <span key={i} style={s.legendItem}>
            <span style={{ ...s.legendDot, background: COLORS[i % COLORS.length] }} />
            {c.name}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', height: 260 }}>
        <Line data={{ labels, datasets }} options={options} />
      </div>
    </div>
  );
}

function getStyles(dark) {
  return {
    wrapper: {
      background: dark ? '#111111' : '#fff',
      border: dark ? '1px solid #2a2a2a' : '1px solid #e8eaf0',
      borderRadius: 16, padding: '1.25rem', marginTop: 24,
      transition: 'background 0.3s ease',
    },
    heading: { fontSize: 14, fontWeight: 600, color: dark ? '#888' : '#666', marginBottom: 12 },
    legend: { display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16 },
    legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: dark ? '#888' : '#555' },
    legendDot: { width: 12, height: 12, borderRadius: 3 },
  };
}
