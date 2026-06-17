// App.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CityCard from './components/CityCard';
import ForecastChart from './components/ForecastChart';
import { fetchCityWeather } from './weatherApi';

const STORAGE_KEY = 'weather_app_cities_v1';

export default function App() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('weather_dark_mode') === 'true';
  });
  const [locating, setLocating] = useState(false);

  // --- Persist dark mode preference ---
  useEffect(() => {
    localStorage.setItem('weather_dark_mode', darkMode);
    const bg = darkMode ? '#000000' : '';
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
    document.body.style.margin = '0';
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [darkMode]);

  // --- Restore cities from localStorage on mount ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setCities(parsed);
      } catch (_) {}
    }
  }, []);

  // --- Save cities whenever they change ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }, [cities]);

  // --- Auto-detect location on first load (skip if saved cities exist) ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let hasSaved = false;
    try { hasSaved = JSON.parse(saved)?.length > 0; } catch (_) {}
    if (hasSaved || !navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          if (res.ok) {
            const data = await res.json();
            await handleAddCity(data.name);
          }
        } catch (_) {}
        finally { setLocating(false); }
      },
      () => setLocating(false)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddCity = async (name) => {
    if (cities.length >= 5) { setError('Maximum 5 cities allowed.'); return; }
    if (cities.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setError(`"${name}" is already added.`); return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchCityWeather(name);
      setCities((prev) => [...prev, data]);
    } catch (e) {
      setError(e.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (index) => setCities((prev) => prev.filter((_, i) => i !== index));
  const handleClearAll = () => { setCities([]); setError(''); };

  const s = getStyles(darkMode);

  return (
    <div style={s.page}>
      <div style={s.container}>
        <header style={s.header}>
          <div style={s.titleRow}>
            <div>
              <h1 style={s.title}>🌤 Weather Comparison</h1>
              <p style={s.subtitle}>Compare 5-day forecasts for up to 5 cities side by side</p>
            </div>
            <button style={s.themeToggle} onClick={() => setDarkMode((p) => !p)}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        <SearchBar onAdd={handleAddCity} disabled={loading || cities.length >= 5} cityCount={cities.length} darkMode={darkMode} />

        {cities.length > 0 && (
          <div style={s.pillsRow}>
            {cities.map((c, i) => (
              <span key={i} style={s.pill}>
                {c.current?.icon} {c.name}, {c.country}
                <button style={s.pillRemove} onClick={() => handleRemove(i)}>×</button>
              </span>
            ))}
            <button style={s.clearBtn} onClick={handleClearAll}>Clear all</button>
          </div>
        )}

        {locating && <div style={s.loadingBox}>📍 Detecting your location...</div>}
        {error && <div style={s.errorBox} role="alert">⚠️ {error}</div>}
        {loading && <div style={s.loadingBox}>⏳ Fetching forecast data...</div>}

        {!loading && !locating && cities.length === 0 && !error && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🌍</div>
            <p style={s.emptyText}>No cities added yet</p>
            <p style={s.emptyHint}>Try adding: London, Tokyo, New York, Mumbai, Sydney</p>
          </div>
        )}

        {cities.length > 0 && (
          <div style={s.grid}>
            {cities.map((city, i) => (
              <CityCard key={i} city={city} index={i} onRemove={() => handleRemove(i)} darkMode={darkMode} />
            ))}
          </div>
        )}

        {cities.length > 0 && <ForecastChart cities={cities} darkMode={darkMode} />}
      </div>
    </div>
  );
}

function getStyles(dark) {
  return {
    page: {
      minHeight: '100vh',
      background: dark ? '#000000' : 'linear-gradient(135deg, #f0f4ff 0%, #e8f4fd 100%)',
      padding: '2rem 1rem',
      transition: 'background 0.3s ease',
    },
    container: { maxWidth: 1100, margin: '0 auto' },
    header: { marginBottom: '2rem' },
    titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 },
    title: { fontSize: 28, fontWeight: 700, color: dark ? '#e8eaf6' : '#1a1a2e', marginBottom: 6 },
    subtitle: { fontSize: 15, color: dark ? '#9e9eb8' : '#666' },
    themeToggle: {
      background: dark ? '#1a1a1a' : '#fff',
      border: dark ? '1px solid #2a2a2a' : '1px solid #dde3ee',
      borderRadius: 20, padding: '6px 16px', fontSize: 13,
      color: dark ? '#c8caff' : '#555', cursor: 'pointer', fontWeight: 500,
    },
    pillsRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, alignItems: 'center' },
    pill: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: dark ? '#1a1a1a' : '#fff',
      border: dark ? '1px solid #2a2a2a' : '1px solid #dde3ee',
      borderRadius: 20, padding: '4px 12px', fontSize: 13, color: dark ? '#c8c8e8' : '#444',
    },
    pillRemove: { background: 'none', border: 'none', fontSize: 16, color: dark ? '#555' : '#aaa', cursor: 'pointer', padding: 0, lineHeight: 1 },
    clearBtn: {
      background: 'none', border: dark ? '1px solid #2a2a2a' : '1px solid #dde3ee',
      borderRadius: 20, padding: '4px 14px', fontSize: 13, color: dark ? '#666' : '#888', cursor: 'pointer',
    },
    errorBox: {
      background: dark ? '#1a0a0a' : '#fff2f2', border: dark ? '1px solid #3a1a1a' : '1px solid #ffcdd2',
      borderRadius: 10, padding: '10px 16px', fontSize: 14, color: dark ? '#ff8a80' : '#c0392b', marginBottom: 20,
    },
    loadingBox: { textAlign: 'center', padding: '1.5rem', color: dark ? '#666' : '#888', fontSize: 15 },
    emptyState: { textAlign: 'center', padding: '4rem 2rem' },
    emptyIcon: { fontSize: 52, marginBottom: 12 },
    emptyText: { fontSize: 16, fontWeight: 600, marginBottom: 6, color: dark ? '#666' : '#888' },
    emptyHint: { fontSize: 14, color: dark ? '#444' : '#aaa' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 8 },
  };
}
