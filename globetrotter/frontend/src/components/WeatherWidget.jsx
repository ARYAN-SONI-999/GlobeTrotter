import React, { useState, useEffect } from 'react';

const DESTINATION_COORDS = {
  matheran: [18.9865, 73.2657],
  lonavala: [18.7546, 73.4064],
  mahabaleshwar: [17.9307, 73.6477],
  mumbai: [19.0760, 72.8777],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  jodhpur: [26.2389, 73.0243],
  jaisalmer: [26.9157, 70.9083],
  manali: [32.2432, 77.1892],
  shimla: [31.1048, 77.1734],
  dharamshala: [32.2190, 76.3234],
  rishikesh: [30.0869, 78.2676],
  goa: [15.2993, 74.1240],
  kerala: [9.9312, 76.2673],
  coorg: [12.4244, 75.7382],
  hampi: [15.3350, 76.4600],
  ooty: [11.4102, 76.6950],
  varanasi: [25.3176, 82.9739],
  agra: [27.1767, 78.0081],
  ladakh: [34.1526, 77.5771],
  darjeeling: [27.0410, 88.2663],
  default: [20.5937, 78.9629]
};

function getWeatherEmoji(code) {
  if (code === 0) return '☀️ Clear Sky';
  if (code >= 1 && code <= 3) return '🌤️ Partly Cloudy';
  if (code >= 45 && code <= 48) return '🌫️ Foggy';
  if (code >= 51 && code <= 67) return '🌧️ Light Rain/Drizzle';
  if (code >= 71 && code <= 77) return '❄️ Snowfall';
  if (code >= 80 && code <= 82) return '🌦️ Rain Showers';
  if (code >= 95) return '⛈️ Thunderstorm';
  return '☀️ Pleasant';
}

function getAdvisory(temp, rainProb, uvIndex) {
  if (temp > 36) return { badge: '🔴 Extreme Heat Alert', text: 'Stay hydrated, wear light cottons, and carry sunscreen/hats.', bg: '#fef2f2', color: '#dc2626' };
  if (temp < 6) return { badge: '🔵 Freezing Conditions', text: 'Pack heavy thermals, gloves, and snow boots.', bg: '#eff6ff', color: '#2563eb' };
  if (rainProb > 60) return { badge: '🟡 Monsoon / Rain Warning', text: 'Keep umbrellas/waterproof jackets ready.', bg: '#fefce8', color: '#ca8a04' };
  if (uvIndex > 8) return { badge: '🟠 High UV Index', text: 'Use SPF 50+ sunscreen and UV-protection sunglasses.', bg: '#fff7ed', color: '#ea580c' };
  return { badge: '🟢 Ideal Travel Weather', text: 'Perfect conditions for outdoor sightseeing and walks!', bg: '#f0fdf4', color: '#16a34a' };
}

export default function WeatherWidget({ destinationName = 'Destination', destinationKey = '', onWeatherLoaded }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(false);
      const cacheKey = `weather_cache_${(destinationKey || destinationName || '').toLowerCase()}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            setWeather(data);
            setLoading(false);
            if (typeof onWeatherLoaded === 'function' && data?.current) {
              onWeatherLoaded({
                temp: Math.round(data.current.temperature_2m),
                condition: getWeatherEmoji(data.current.weather_code)
              });
            }
            return;
          }
        } catch (e) {}
      }

      try {
        const key = (destinationKey || destinationName || '').toLowerCase().replace(/[\s-]+/g, '');
        let coords = DESTINATION_COORDS[key];

        // If coords not in presets, dynamically query live geocoding API
        if (!coords && destinationName && destinationName !== 'Destination') {
          try {
            const geoRes = await fetch(`/api/external/geocode?q=${encodeURIComponent(destinationName)}`);
            const geoData = await geoRes.json();
            if (Array.isArray(geoData) && geoData.length > 0 && geoData[0].lat && geoData[0].lng) {
              coords = [geoData[0].lat, geoData[0].lng];
            }
          } catch (gErr) {
            console.warn('Dynamic geocoding fallback error:', gErr);
          }
        }

        if (!coords) coords = DESTINATION_COORDS['default'];

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto';
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,precipitation_probability,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,sunrise,sunset&timezone=${encodeURIComponent(timezone)}&forecast_days=7`
          ),
          fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords[0]}&longitude=${coords[1]}&current=european_aqi,pm2_5,pm10&timezone=${encodeURIComponent(timezone)}`
          ).catch(() => null)
        ]);

        const data = await weatherRes.json();
        if (aqiRes && aqiRes.ok) {
          const aqiData = await aqiRes.json();
          if (aqiData && aqiData.current) {
            data.aqi = aqiData.current;
          }
        }

        setWeather(data);
        if (typeof onWeatherLoaded === 'function' && data?.current) {
          onWeatherLoaded({
            temp: Math.round(data.current.temperature_2m),
            condition: getWeatherEmoji(data.current.weather_code)
          });
        }
        sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [destinationName, destinationKey]);

  if (loading) {
    return (
      <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '14px', color: '#64748b' }}>🌤️ Loading live climate radar for {destinationName}...</div>
      </div>
    );
  }

  if (error || !weather || !weather.current) {
    return (
      <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 600, color: '#0f172a' }}>🌤️ Live Weather Radar</div>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Weather service temporarily unavailable. Average travel temp: ~24°C.</p>
      </div>
    );
  }

  const curr = weather.current;
  const daily = weather.daily;
  const hourly = weather.hourly;
  const advisory = getAdvisory(curr.temperature_2m, daily?.precipitation_probability_max?.[0] || 0, curr.uv_index || 4);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  const sunriseStr = formatTime(daily?.sunrise?.[0]);
  const sunsetStr = formatTime(daily?.sunset?.[0]);

  let bestTimeBadge = '☀️ Morning hours recommended';
  if (hourly && hourly.time && daily && daily.time) {
    const todayStr = daily.time[0];
    let bestWindow = null;
    let minRain = Infinity;
    
    const todayIndices = [];
    hourly.time.forEach((t, i) => {
      if (t.startsWith(todayStr)) {
        const hour = parseInt(t.substring(11, 13), 10);
        if (hour >= 6 && hour <= 20) {
          todayIndices.push(i);
        }
      }
    });

    for (let i = 0; i <= todayIndices.length - 3; i++) {
      const idx1 = todayIndices[i];
      const idx2 = todayIndices[i+1];
      const idx3 = todayIndices[i+2];

      const avgRain = (hourly.precipitation_probability[idx1] + hourly.precipitation_probability[idx2] + hourly.precipitation_probability[idx3]) / 3;
      const temps = [hourly.temperature_2m[idx1], hourly.temperature_2m[idx2], hourly.temperature_2m[idx3]];
      const minT = Math.min(...temps);
      const maxT = Math.max(...temps);

      if (minT >= 18 && maxT <= 32) {
        if (avgRain < minRain) {
          minRain = avgRain;
          const startHour = parseInt(hourly.time[idx1].substring(11, 13), 10);
          const endHour = parseInt(hourly.time[idx3].substring(11, 13), 10) + 1;
          
          const formatHour = (h) => {
             const ampm = h >= 12 ? 'PM' : 'AM';
             const hr = h % 12 || 12;
             return `${hr} ${ampm}`;
          };
          bestWindow = `🌅 Best time today: ${formatHour(startHour)} – ${formatHour(endHour)}`;
        }
      }
    }
    if (bestWindow) bestTimeBadge = bestWindow;
  }

  const renderHourlySparkline = () => {
    if (!hourly || !hourly.time || !daily || !daily.time) return null;
    const todayStr = daily.time[0];
    const todayHourlyIndices = [];
    hourly.time.forEach((t, i) => {
      if (t.startsWith(todayStr)) {
        const hour = parseInt(t.substring(11, 13), 10);
        if (hour >= 6 && hour <= 22) {
          todayHourlyIndices.push(i);
        }
      }
    });

    if (todayHourlyIndices.length === 0) return null;

    const temps = todayHourlyIndices.map(i => hourly.temperature_2m[i]);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1;

    return (
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>⏱️ Today's Hourly Forecast</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', alignItems: 'flex-end', height: '80px' }}>
          {todayHourlyIndices.map(i => {
            const temp = hourly.temperature_2m[i];
            const rainProb = hourly.precipitation_probability[i];
            const hour = parseInt(hourly.time[i].substring(11, 13), 10);
            
            const isLabelHour = [6, 9, 12, 15, 18, 21].includes(hour);
            let label = '';
            if (isLabelHour) {
               label = hour === 12 ? '12PM' : (hour < 12 ? `${hour}AM` : `${hour % 12}PM`);
            }
            
            const heightPercent = ((temp - minTemp) / range) * 100;
            const barHeight = Math.max(20, (heightPercent * 0.5)); 

            const hue = Math.max(30, 210 - ((temp - 15) * 9)); 
            const barColor = `hsl(${hue}, 80%, 55%)`;

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', minWidth: '24px' }}>
                {rainProb > 30 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginBottom: '4px' }} title={`Rain: ${rainProb}%`}></div>}
                <div style={{ width: '16px', height: `${barHeight}px`, background: barColor, borderRadius: '4px' }} title={`${temp}°C`}></div>
                <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px', height: '12px' }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getPackingSuggestions = (temp, rainProb, uvIndex) => {
    let suggestions = [];
    if (temp > 32) suggestions.push('🧴 Sunscreen SPF 50+', '🧢 Hat/Cap', '💧 Extra Water Bottle', '👕 Light Cotton Clothes');
    if (temp < 12) suggestions.push('🧥 Heavy Jacket', '🧤 Gloves', '🧣 Woolen Muffler', '👢 Warm Boots');
    if (rainProb > 50) suggestions.push('☂️ Umbrella', '🧥 Waterproof Jacket', '👟 Waterproof Shoes');
    if (uvIndex > 6) suggestions.push('🕶️ UV-Protection Sunglasses', '🧴 SPF 30+ Sunscreen');
    suggestions.push('📱 Offline Maps Downloaded', '🆔 ID & Emergency Contacts');
    return [...new Set(suggestions)];
  };

  const packingChips = getPackingSuggestions(curr.temperature_2m, daily?.precipitation_probability_max?.[0] || 0, curr.uv_index || 4);

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ☀️ Live Weather &amp; Climate Radar — {destinationName}
          </h3>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Real-time satellite feed via Open-Meteo</span>
        </div>
        <span style={{ background: advisory.bg, color: advisory.color, fontWeight: 700, fontSize: '12px', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${advisory.color}44` }}>
          {advisory.badge}
        </span>
      </div>

      {/* Current Conditions Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '14px' }}>
        <div style={{ textCenter: 'left' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Current Temp</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{Math.round(curr.temperature_2m)}°C</div>
          <div style={{ fontSize: '11px', color: '#475569' }}>Feels like {Math.round(curr.apparent_temperature)}°C</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Condition</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{getWeatherEmoji(curr.weather_code)}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Humidity</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>💧 {curr.relative_humidity_2m}%</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Wind &amp; UV</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '4px' }}>💨 {curr.wind_speed_10m} km/h</div>
          <div style={{ fontSize: '12px', color: '#ea580c', fontWeight: 600 }}>☀️ UV {curr.uv_index ?? 'Moderate'}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Sunrise</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '4px' }}>🌅 {sunriseStr}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Sunset</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '4px' }}>🌇 {sunsetStr}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Air Quality</div>
          <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px', color: (weather.aqi?.european_aqi || 25) <= 30 ? '#16a34a' : ((weather.aqi?.european_aqi || 25) <= 60 ? '#d97706' : '#dc2626') }}>
            🍃 AQI {weather.aqi?.european_aqi ? Math.round(weather.aqi.european_aqi) : '28'}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>
            {(weather.aqi?.european_aqi || 25) <= 30 ? 'Clean & Fresh' : ((weather.aqi?.european_aqi || 25) <= 60 ? 'Moderate' : 'Sensitive Take Care')}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {daily && daily.time && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>📅 7-Day Temperature Forecast</div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {daily.time.slice(0, 7).map((dStr, idx) => {
              const dayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div key={dStr} style={{ flex: '1 1 70px', minWidth: '65px', background: idx === 0 ? '#eff6ff' : '#fafafa', border: idx === 0 ? '1px solid #93c5fd' : '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: idx === 0 ? '#1d4ed8' : '#64748b' }}>{idx === 0 ? 'Today' : dayName}</div>
                  <div style={{ fontSize: '14px', margin: '3px 0' }}>{getWeatherEmoji(daily.weather_code[idx]).split(' ')[0]}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{Math.round(daily.temperature_2m_max[idx])}°</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{Math.round(daily.temperature_2m_min[idx])}°</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Hourly Forecast */}
      {renderHourlySparkline()}

      {/* Advisory note */}
      <div style={{ background: advisory.bg, border: `1px solid ${advisory.color}33`, borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: advisory.color, fontWeight: 600 }}>
        💡 <strong>Travel Advisory:</strong> {advisory.text}
      </div>

      {/* Best Time to Go Badge */}
      <div style={{ marginTop: '8px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', fontWeight: 600 }}>
        {bestTimeBadge}
      </div>

      {/* Smart Packing Suggestions */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>🎒 Smart Packing Suggestions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {packingChips.map((chip, idx) => (
            <span key={idx} style={{ background: '#f1f5f9', color: '#334155', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
