import React, { useState } from 'react';
import axios from 'axios';
import './styles/weather.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Weather() {
  const [city, setCity]=useState('');
  const [weather, setWeather]=useState(null);

  const getWeather=async () => {
    if (!city) return;
    try {
      const response=await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=b15be3905d374fe9a8f65211252304&q=${city}&days=1&aqi=no`
      );

      setWeather({
        ...response.data,
        hourly: response.data.forecast.forecastday[0].hour,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
    }
  };

  const getFeelsLikeTip=(temp) => {
    if (temp<15) return "Wear something warm.";
    if (temp>=15&&temp<=25) return "Comfortable weather. Light jacket maybe?";
    if (temp>25&&temp<=35) return "Stay hydrated and wear breathable clothes.";
    return "It's hot! Avoid going out during peak hours.";
  };

  return (
    <div className="app-container">
      <h1 className="title">🌤️ Nimbus</h1>
      <br />
      <div className="weather-box">
        <div className="search-box">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="search-input"
          />
          <button onClick={getWeather} className="search-button">
            Search
          </button>
        </div>

        {weather&&(
          <div className="weather-info">
            <h2>{weather.location.name}, {weather.location.country}</h2>
            <p>{weather.location.localtime}</p>

            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className="weather-icon"
            />

            <p className="temp">{weather.current.temp_c}°C</p>
            <p className="description">{weather.current.condition.text}</p>

            <div className="details-grid">
              <div>
                <p className="label">Humidity</p>
                <p>{weather.current.humidity}%</p>
              </div>
              <div>
                <p className="label">Wind Speed</p>
                <p>{weather.current.wind_kph} kph</p>
              </div>
              <div>
                <p className="label">Feels Like</p>
                <p>{weather.current.feelslike_c}°C</p>
              </div>
              <div>
                <p className="label">Pressure</p>
                <p>{weather.current.pressure_mb} mb</p>
              </div>
            </div>

            <p className="feels-tip">💡 {getFeelsLikeTip(weather.current.feelslike_c)}</p>
            <br/>
            {weather.hourly&&(
              <>
                <div className="hourly-forecast">
                  <h3>Hourly Forecast</h3>
                  <div className="hour-scroll">
                    {weather.hourly.map((hourData, index) => (
                      <div key={index} className="hour-box">
                        <p>{hourData.time.split(' ')[1]}</p>
                        <img src={hourData.condition.icon} alt={hourData.condition.text} />
                        <p>{hourData.temp_c}°C</p>
                      </div>
                    ))}
                  </div>
                </div>
                <br/>
                <div className="temp-chart">
                  <h3>Temperature Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weather.hourly.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tickFormatter={(time) => time.split(" ")[1]} />
                      <YAxis unit="°C" />
                      <Tooltip />
                      <Line type="monotone" dataKey="temp_c" stroke="#ff7300" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
