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
