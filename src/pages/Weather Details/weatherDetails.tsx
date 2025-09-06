import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getWeather, type WeatherData } from "../../api/weather";
import "./WeatherDetails.css";

export default function WeatherDetails() {
  const { cityName } = useParams<{ cityName: string }>();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) return;
    const fetchWeather = async () => {
      try {
        const data = await getWeather(cityName);
        setWeather(data);
      } catch {
        setError("Unable to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [cityName]);

  return (
    <div className="weather-details-page" style={{
          backgroundImage: weather
            ? `url(${weather.current.weather_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
      <Navbar />
      <div className="weather-details-container">
        {loading && <p className="loading">Loading weather data...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && weather && (
          <>
            <h1>{weather.city || cityName}</h1>
            <div className="weather-info">
              <p>Temperature: {weather.current.temperature_2m.toFixed(2)}°C</p>
              <p>
                Wind Speed: {weather.current.wind_speed_10m.toFixed(2)} km/h
              </p>
              <p>
                Wind Direction: {weather.current.wind_direction_10m.toFixed(2)}°
              </p>
              <p>Weather: {weather.current.weather_description}</p>
              <p>Time: {new Date(weather.current.time).toLocaleString()}</p>
            </div>

            <h2>Week Forecast</h2>
            <div className="daily-forecast">
              {weather.daily.time.slice(1).map((day, idx) => (
                <div
                  key={idx}
                  className="daily-card"
                  style={{
                    backgroundImage: `url(${weather.daily.weather_image.slice(1)[idx]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <p>{day.toLocaleDateString()}</p>
                  <p>{weather.daily.weather_description.slice(1)[idx]}</p>
                  <p>
                    Max:{" "}
                    {weather.daily.apparent_temperature_max
                      .slice(1)[idx].toFixed(2)}
                    °C | Min:{" "}
                    {weather.daily.apparent_temperature_min
                      .slice(1)[idx].toFixed(2)}
                    °C
                  </p>
                  <p>
                    Wind:{" "}
                    {weather.daily.wind_speed_10m_max.slice(1)[idx].toFixed(2)}{" "}
                    km/h
                  </p>
                  <p>
                    Precipitation Probability:{" "}
                    {weather.daily.precipitation_probability_max.slice(1)[idx]}%
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
