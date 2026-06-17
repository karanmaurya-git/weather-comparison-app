# Multi-City Weather Comparison

A React app that compares 5-day weather forecasts for up to 5 cities simultaneously.

## Features
- Add up to 5 cities and compare side by side
- Current weather: temperature, humidity, wind speed
- 5-day forecast with daily high/low temperatures
- Interactive line chart for temperature trend comparison
- Powered by Claude AI (Anthropic API)

## Project Structure
```
src/
  App.jsx                  # Main app component
  index.js                 # Entry point
  index.css                # Global styles
  weatherApi.js            # Anthropic API integration
  components/
    CityCard.jsx           # Individual city weather card
    ForecastChart.jsx      # Chart.js line chart component
    SearchBar.jsx          # City search input
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.example .env
```
Edit `.env` and replace `your_api_key_here` with your actual key from https://console.anthropic.com

### 3. Start the app
```bash
npm start
```
Open http://localhost:3000

## Using a Real Weather API (Optional)
To use live weather data instead of AI-generated data, replace the `fetchCityWeather` function in `weatherApi.js` with a call to [OpenWeatherMap](https://openweathermap.org/api) or similar. Get a free API key at openweathermap.org.

## Tech Stack
- React 18
- Chart.js + react-chartjs-2
- Anthropic Claude API (claude-sonnet-4-20250514)

# 🌤 Weather Comparison App

A React-based weather application that allows users to compare real-time weather and 5-day forecasts for multiple cities side by side.

---

## 🚀 Features

- 🌍 Search and add multiple cities
- 📊 Compare weather data side by side
- 🌡️ Current temperature, humidity, wind speed, and conditions
- 📅 5-day weather forecast for each city
- 📈 Forecast comparison chart (high temp, low temp, humidity, wind)
- 🌙 Dark / Light mode support (persists on refresh)
- °C / °F unit toggle
- 📍 Auto-detects user location on first load
- 💾 Saves cities using localStorage
- ⚡ Loading state while fetching data
- ❌ Error handling for invalid cities or API issues

---

## 🛠️ Tech Stack

- React (Vite / Create React App)
- Chart.js
- OpenWeatherMap API
- JavaScript (ES6+)
- CSS

---

## 📁 Project Structure

weather-app/
├── public/
├── src/
│   ├── components/
│   │   ├── CityCard.jsx
│   │   ├── ForecastChart.jsx
│   │   └── SearchBar.jsx
│   ├── App.jsx
│   ├── index.js
│   ├── index.css
│   └── weatherApi.js
├── .env
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1. Install dependencies
npm install

---

### 2. Add API key
Create a `.env` file in the root:

REACT_APP_OPENWEATHER_API_KEY=your_api_key_here

Get API key from:
https://openweathermap.org/api

---

### 3. Run the project
npm start

Open:
http://localhost:3000

---

## 🌐 API Endpoints Used

- Current Weather: /data/2.5/weather  
- 5-Day Forecast: /data/2.5/forecast  

---

## 📊 Features Overview

- Compare weather between multiple cities  
- View detailed weather stats  
- Analyze trends using charts  
- Switch themes and temperature units  
- Auto-save selected cities  

---

## 👨‍💻 Author

Karan Maurya
