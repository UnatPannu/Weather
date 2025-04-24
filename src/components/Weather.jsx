import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/weather.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [geoCity, setGeoCity] = useState('');
  console.log('City:', city, 'GeoCity:', geoCity);
  const fetchWeather = async (query) => {
    if (!query) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=b15be3905d374fe9a8f65211252304&q=${query}&days=7&aqi=no`
      );
      setCity(response.data.location.name);
      setGeoCity(response.data.location.name); // update geoCity in search too
      setWeather({
        ...response.data,
        hourly: response.data.forecast.forecastday[0].hour,
        daily: response.data.forecast.forecastday,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setErrorMsg("❌ Unable to fetch weather. Please check the city name or location permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
          fetchGeoCity(latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setErrorMsg("⚠️ Location permission denied. You can still search manually.");
        }
      );
    }
  }, []);

  const fetchGeoCity = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      const locationName = data.address.city || data.address.town || data.address.village || 'Unknown';
      setGeoCity(locationName);
    } catch (error) {
      console.error('Error fetching location name:', error);
      setGeoCity('Unknown');
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🌤️ Knimbus</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchWeather(city);
          }}
          className="search-input"
        />
        <button onClick={() => fetchWeather(city)} className="search-button">
          Search
        </button>
      </div>
      {loading && <p>Loading weather data...</p>}
      {errorMsg && <p className="error">{errorMsg}</p>}
      {weather && (
        <div className="weather-box-full">
          <div className="weather-header">
            <div className="left">
              <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
                className="weather-icon"
              />
              <div className='city-name'>{weather.location.name}</div>
              <div className="temp-main">{weather.current.temp_c}°C</div>
            </div>
            <div className="right">
              <div className="label">Precipitation: 0%</div>
              <div className="label">Humidity: {weather.current.humidity}%</div>
              <div className="label">Wind: {weather.current.wind_kph} km/h</div>
              <div className="label">{new Date(weather.location.localtime).toLocaleString()}</div>
              <div className="label">{weather.current.condition.text}</div>
            </div>
          </div>

          <div className="tabs-row">
            <span className="tab active">Temperature</span>
            <span className="tab">Precipitation</span>
            <span className="tab">Wind</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weather.hourly.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(t) => t.split(' ')[1]} />
              <YAxis unit="°C" />
              <Tooltip />
              <Line type="monotone" dataKey="temp_c" stroke="#ff9900" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="forecast-scroll">
            {weather.daily.map((day, i) => (
              <div className="forecast-day" key={i}>
                <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <img src={day.day.condition.icon} alt={day.day.condition.text} />
                <p>{day.day.maxtemp_c}° / {day.day.mintemp_c}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
