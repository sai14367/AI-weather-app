import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);

  const API_KEY = "4227708c05dcb910661f68eb04c9b431"; // Replace this with your real key
  const fetchData = async () => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherRes.data);

      const { lat, lon } = weatherRes.data.coord;

      const aqiRes = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAqi(aqiRes.data.list[0]);
    } catch (err) {
      alert("❌ Error fetching data. Check city name or API key.");
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>🌦️ Weather + Air Quality App</h1>
      <input
        type="text"
        placeholder="Enter City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchData}>Get Info</button>

      {weather && (
        <div className="info-card">
          <h2>{weather.name}</h2>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>☁️ Weather: {weather.weather[0].description}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      {aqi && (
        <div className="info-card">
          <h3>Air Quality Index (AQI): {aqi.main.aqi}</h3>
          <p>PM2.5: {aqi.components.pm2_5} µg/m³</p>
          <p>PM10: {aqi.components.pm10} µg/m³</p>
          <Advice aqi={aqi.main.aqi} weather={weather} />
        </div>
      )}
    </div>
  );
};

const Advice = ({ aqi, weather }) => {
  let advice = "";
  if (aqi >= 4) advice += "😷 Wear a mask. ";
  if (weather?.weather[0].main === "Rain") advice += "☔ Carry an umbrella!";
  if (!advice) advice = "✅ You're good to go!";
  return <p><strong>Advice:</strong> {advice}</p>;
};

export default App;
