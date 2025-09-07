/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch suggestions from Open-Meteo Geocoding API
  const fetchSuggestions = async (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=25`
      );
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error("Error fetching city suggestions", err);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSelectCity = (city: any) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/weather/${city.name}`);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Weather Now
      </Link>

      <div className="navbar-search">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Select City"
        />

        {query.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            &times;
          </button>
        )}

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((city, index) => (
              <li key={index} onClick={() => handleSelectCity(city)}>
                {[city.name, city.admin1, city.country]
                  .filter(Boolean)
                  .join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
