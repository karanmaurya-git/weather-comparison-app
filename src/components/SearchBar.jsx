// components/SearchBar.jsx
import React, { useState } from 'react';

export default function SearchBar({ onAdd, disabled, cityCount, darkMode }) {
  const [value, setValue] = useState('');
  const s = getStyles(darkMode);

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  return (
    <div style={s.wrapper}>
      <input
        style={s.input}
        type="text"
        placeholder="Enter a city name (e.g. Tokyo, Mumbai, London)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && handleAdd()}
        disabled={disabled}
        aria-label="City name"
      />
      <button
        style={{
          ...s.btn,
          opacity: disabled || !value.trim() ? 0.5 : 1,
        }}
        onClick={handleAdd}
        disabled={disabled || !value.trim()}
      >
        {disabled ? 'Loading...' : 'Add city'}
      </button>
      <span style={s.counter}>{cityCount}/5</span>
    </div>
  );
}

function getStyles(dark) {
  return {
    wrapper: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      minWidth: 200,
      padding: '10px 14px',
      border: dark ? '1px solid #2a2a2a' : '1px solid #d0d5dd',
      borderRadius: 10,
      fontSize: 14,
      outline: 'none',
      background: dark ? '#111111' : '#fff',
      color: dark ? '#e0e0e0' : '#111',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    },
    btn: {
      padding: '10px 20px',
      background: '#378ADD',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    counter: {
      fontSize: 13,
      color: dark ? '#555' : '#aaa',
      whiteSpace: 'nowrap',
    },
  };
}
