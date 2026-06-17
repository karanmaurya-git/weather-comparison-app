
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
 
const getWeatherEmoji = (main) => {
  switch (main.toLowerCase()) {
    case 'clear':       return '☀️';
    case 'clouds':      return '☁️';
    case 'rain':        return '🌧️';
    case 'thunderstorm':return '⛈️';
    case 'snow':        return '❄️';
    case 'mist':
    case 'fog':
    case 'haze':        return '🌫️';
    default:            return '🌤️';
  }
};
 
export async function fetchCityWeather(cityName) {
  if (!API_KEY) {
    throw new Error('Missing API key. Add REACT_APP_OPENWEATHER_API_KEY to your .env file.');
  }
 
  // 1. Current weather
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
  );
  if (!currentRes.ok) throw new Error('City not found');
  const currentData = await currentRes.json();
 
  const { lat, lon } = currentData.coord;
 
  // 2. 5-day / 3-hour forecast (used for daily + hourly)
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
  );
  const forecastData = await forecastRes.json();
 
  // 3. One Call API — alerts + hourly (requires OWM 3.0 or free one-call-by-call)
  //    Gracefully falls back if unavailable
  let alerts = [];
  let hourly = [];
 
  try {
    const oneCallRes = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&appid=${API_KEY}&units=metric`
    );
    if (oneCallRes.ok) {
      const oneCallData = await oneCallRes.json();
 
      // Hourly — next 24 hours (8 × 3h slots)
      hourly = (oneCallData.hourly || []).slice(0, 24).map((h) => ({
        time: new Date(h.dt * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        temp: Math.round(h.temp),
        icon: getWeatherEmoji(h.weather[0].main),
        desc: h.weather[0].description,
        humidity: h.humidity,
        wind: Math.round(h.wind_speed * 3.6),
      }));
 
      // Alerts
      alerts = (oneCallData.alerts || []).map((a) => ({
        event: a.event,
        sender: a.sender_name,
        description: a.description,
        start: new Date(a.start * 1000).toLocaleString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }),
        end: new Date(a.end * 1000).toLocaleString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }),
      }));
    }
  } catch (_) {
    // One Call unavailable — hourly & alerts stay empty
  }
 
  // Fallback hourly from 3-hour forecast list (next 24h = 8 slots)
  if (hourly.length === 0) {
    hourly = forecastData.list.slice(0, 8).map((h) => ({
      time: new Date(h.dt_txt).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      }),
      temp: Math.round(h.main.temp),
      icon: getWeatherEmoji(h.weather[0].main),
      desc: h.weather[0].description,
      humidity: h.main.humidity,
      wind: Math.round(h.wind.speed * 3.6),
    }));
  }
 
  // Daily forecast (noon snapshots)
  const dailyForecast = forecastData.list
    .filter((item) => item.dt_txt.includes('12:00:00'))
    .slice(0, 5)
    .map((item) => ({
      day: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
      date: new Date(item.dt_txt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      high: Math.round(item.main.temp_max),
      low: Math.round(item.main.temp_min),
      icon: getWeatherEmoji(item.weather[0].main),
      desc: item.weather[0].description,
    }));
 
  return {
    name: currentData.name,
    country: currentData.sys.country,
    current: {
      temp: Math.round(currentData.main.temp),
      desc: currentData.weather[0].description,
      icon: getWeatherEmoji(currentData.weather[0].main),
      humidity: currentData.main.humidity,
      wind: Math.round(currentData.wind.speed * 3.6),
    },
    forecast: dailyForecast,
    hourly,
    alerts,
  };
}
 