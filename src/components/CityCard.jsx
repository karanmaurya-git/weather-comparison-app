// components/CityCard.jsx
import React, { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#BA7517'];

export default function CityCard({ city, index, onRemove, darkMode }) {
  const [showHourly, setShowHourly] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const color = COLORS[index % COLORS.length];
  const s = getStyles(darkMode);

  const hasAlerts = city.alerts?.length > 0;
  const hasHourly = city.hourly?.length > 0;

  const hourlyChartData = {
    labels: (city.hourly || []).map((h) => h.time),
    datasets: [{
      data: (city.hourly || []).map((h) => h.temp),
      borderColor: color,
      backgroundColor: color + '22',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
    }],
  };

  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: darkMode ? '#1a1a1a' : '#fff',
      titleColor: darkMode ? '#ccc' : '#333',
      bodyColor: darkMode ? '#aaa' : '#555',
      borderColor: darkMode ? '#2a2a2a' : '#e0e0e0',
      borderWidth: 1,
      callbacks: { label: (ctx) => ` ${ctx.parsed.y}°C` },
    }},
    scales: {
      y: {
        ticks: { callback: (v) => v + '°', font: { size: 10 }, color: darkMode ? '#555' : '#999' },
        grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      },
      x: {
        ticks: { font: { size: 9 }, color: darkMode ? '#555' : '#999', maxRotation: 45 },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.cardHeader}>
        <div>
          <div style={{ ...s.cityName, color }}>{city.name}</div>
          <div style={s.countryLabel}>{city.country}</div>
        </div>
        <div style={s.headerRight}>
          <span style={s.weatherIcon}>{city.current?.icon}</span>
          <button onClick={onRemove} style={s.removeBtn} aria-label={`Remove ${city.name}`}>×</button>
        </div>
      </div>

      {/* Weather alert banner */}
      {hasAlerts && (
        <div style={s.alertBanner} onClick={() => setShowAlerts((p) => !p)}>
          <span>⚠️ {city.alerts.length} weather alert{city.alerts.length > 1 ? 's' : ''}</span>
          <span style={s.alertToggle}>{showAlerts ? '▲' : '▼'}</span>
        </div>
      )}

      {/* Alert details */}
      {hasAlerts && showAlerts && (
        <div style={s.alertDetails}>
          {city.alerts.map((a, i) => (
            <div key={i} style={s.alertItem}>
              <div style={s.alertEvent}>{a.event}</div>
              <div style={s.alertMeta}>{a.start} → {a.end}</div>
              {a.sender && <div style={s.alertSender}>📡 {a.sender}</div>}
              <div style={s.alertDesc}>{a.description?.slice(0, 160)}{a.description?.length > 160 ? '…' : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Current temp */}
      <div style={s.currentTemp}>{Math.round(city.current?.temp ?? 0)}°C</div>
      <div style={s.currentDesc}>{city.current?.desc}</div>

      {/* Stats row */}
      <div style={s.statsRow}>
        <span style={s.stat}>💧 {city.current?.humidity ?? '--'}%</span>
        <span style={s.stat}>💨 {city.current?.wind ?? '--'} km/h</span>
      </div>

      <hr style={s.divider} />

      {/* 5-day forecast */}
      <div style={s.forecastList}>
        {(city.forecast || []).map((d, i) => (
          <div key={i} style={s.forecastRow}>
            <span style={s.forecastDay}>{d.day}</span>
            <span style={s.forecastDate}>{d.date}</span>
            <span style={s.forecastIcon}>{d.icon}</span>
            <div style={s.forecastTemps}>
              <span style={s.tempHigh}>{Math.round(d.high)}°</span>
              <span style={s.tempLow}>{Math.round(d.low)}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly toggle */}
      {hasHourly && (
        <>
          <hr style={s.divider} />
          <button style={{ ...s.hourlyToggle, color }} onClick={() => setShowHourly((p) => !p)}>
            {showHourly ? '▲ Hide hourly' : '▼ 24h forecast'}
          </button>
          {showHourly && (
            <div style={s.hourlyChart}>
              <div style={{ height: 120 }}>
                <Line data={hourlyChartData} options={hourlyChartOptions} />
              </div>
              <div style={s.hourlyStats}>
                {(city.hourly || []).slice(0, 4).map((h, i) => (
                  <div key={i} style={s.hourlySlot}>
                    <div style={s.hourlyTime}>{h.time}</div>
                    <div style={s.hourlyIcon}>{h.icon}</div>
                    <div style={s.hourlyTemp}>{h.temp}°</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function getStyles(dark) {
  return {
    card: {
      background: dark ? '#111111' : '#fff',
      border: dark ? '1px solid #2a2a2a' : '1px solid #e8eaf0',
      borderRadius: 16,
      padding: '1.25rem',
      transition: 'background 0.3s ease',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    cityName: { fontSize: 16, fontWeight: 600 },
    countryLabel: { fontSize: 12, color: dark ? '#555' : '#888', marginTop: 2 },
    headerRight: { display: 'flex', alignItems: 'center', gap: 8 },
    weatherIcon: { fontSize: 28 },
    removeBtn: {
      background: 'none', border: dark ? '1px solid #333' : '1px solid #e0e0e0',
      borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 16, color: dark ? '#555' : '#aaa',
      lineHeight: 1, padding: 0, cursor: 'pointer',
    },
    alertBanner: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: dark ? '#2a1500' : '#fff8e1',
      border: dark ? '1px solid #4a2800' : '1px solid #ffe082',
      borderRadius: 8, padding: '6px 10px', fontSize: 12,
      color: dark ? '#ffb74d' : '#e65100', marginBottom: 10, cursor: 'pointer',
    },
    alertToggle: { fontSize: 10, opacity: 0.7 },
    alertDetails: {
      background: dark ? '#1a0e00' : '#fffde7',
      border: dark ? '1px solid #3a2200' : '1px solid #ffe082',
      borderRadius: 8, padding: '8px 10px', marginBottom: 10,
      display: 'flex', flexDirection: 'column', gap: 8,
    },
    alertItem: {},
    alertEvent: { fontSize: 12, fontWeight: 700, color: dark ? '#ffb74d' : '#e65100', marginBottom: 2 },
    alertMeta: { fontSize: 10, color: dark ? '#666' : '#888', marginBottom: 2 },
    alertSender: { fontSize: 10, color: dark ? '#555' : '#aaa', marginBottom: 2 },
    alertDesc: { fontSize: 11, color: dark ? '#888' : '#666', lineHeight: 1.5 },
    currentTemp: { fontSize: 32, fontWeight: 700, lineHeight: 1, color: dark ? '#f0f0f0' : '#111' },
    currentDesc: { fontSize: 13, color: dark ? '#888' : '#666', marginTop: 4, textTransform: 'capitalize' },
    statsRow: { display: 'flex', gap: 12, marginTop: 8 },
    stat: { fontSize: 12, color: dark ? '#666' : '#888' },
    divider: { border: 'none', borderTop: dark ? '1px solid #222' : '1px solid #f0f0f0', margin: '12px 0' },
    forecastList: { display: 'flex', flexDirection: 'column', gap: 7 },
    forecastRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
    forecastDay: { fontWeight: 600, minWidth: 30, color: dark ? '#ccc' : '#444' },
    forecastDate: { color: dark ? '#555' : '#aaa', fontSize: 11, flex: 1 },
    forecastIcon: { fontSize: 15 },
    forecastTemps: { display: 'flex', gap: 6 },
    tempHigh: { fontWeight: 600, color: dark ? '#e0e0e0' : '#333' },
    tempLow: { color: dark ? '#555' : '#aaa' },
    hourlyToggle: {
      background: 'none', border: 'none', fontSize: 12,
      fontWeight: 600, cursor: 'pointer', padding: '4px 0', width: '100%', textAlign: 'left',
    },
    hourlyChart: { marginTop: 10 },
    hourlyStats: { display: 'flex', gap: 6, marginTop: 10, justifyContent: 'space-between' },
    hourlySlot: { textAlign: 'center', flex: 1 },
    hourlyTime: { fontSize: 9, color: dark ? '#555' : '#aaa', marginBottom: 2 },
    hourlyIcon: { fontSize: 14 },
    hourlyTemp: { fontSize: 11, fontWeight: 600, color: dark ? '#ccc' : '#444', marginTop: 2 },
  };
}
