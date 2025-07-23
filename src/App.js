
import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    setTemperature(null);

    try {
      
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
      const geoRes = await axios.get(geoUrl);

      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name, country } = geoRes.data.results[0];

      // Step 2: Get weather data using coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherRes = await axios.get(weatherUrl);

      setTemperature({
        city: `${name}, ${country}`,
        value: weatherRes.data.current_weather.temperature,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') getWeather();
  };

  return (
    <div className="App">
      <h1>🌤️ Weather App </h1>
      <input
        type="text"
        placeholder="Enter city "
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={getWeather}>Get Temperature</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {temperature && (
        <h2>
          {temperature.city}: {temperature.value}°C
        </h2>
      )}
    </div>
  );
}

export default App;
