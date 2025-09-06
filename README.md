# Weather Now 🌦️

## Project Overview
A simple, modern weather forecast web application built with **React + TypeScript**.  
Users can search for a city, view its current weather, and explore a 7-day forecast with dynamic weather backgrounds and details.

---

## ✨ Features

- **Landing Page**
  - Clean navbar
  - Search bar (single city input)
  - Slideshow-style carousel

- **Weather Forecast Page**
  - Current weather conditions
  - 7-day forecast (skipping today, showing next 6 days)
  - Dynamic weather backgrounds (using images mapped from weather codes)

- **API Integration**
  - [Open-Meteo](https://open-meteo.com/) for weather data
  - [Open-Meteo]Geocoding API for coordinates
  - Weather codes mapped to human-readable descriptions and images via local `weatherCodes.json` [Courtesy: openweather, Google Images]

- **Styling**
  - CSS-based styling (no Tailwind)
  - `normalize.css` included for cross-browser consistency
  - Responsive layout with flex and adaptive cards

---

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript, Vite)
- **Styling:** CSS Modules + normalize.css
- **State Management:** React hooks (`useState`, `useEffect`)
- **Routing:** React Router
- **Backend (API):** Open-Meteo + Geocoding API
- **Package Manager:** pnpm

---

## 🌍 Usage

- Open the homepage
- Enter a city name in the search bar
- Navigate to the Weather Details Page
- View:
  - Current temperature, wind, and conditions
  - A 6-day forecast with max/min temps, wind, and precipitation chances
  - Dynamic weather-themed backgrounds for both current and forecast cards

---

## 📂 Project Structure

- **`api/`** → Weather API functions  
- **`assets/`** → Static files (weatherCodes.json, Google Images)  
- **`components/`** → Reusable UI (Navbar)  
- **`pages/`** → Page-level components (Home, WeatherDetails)  
- **`App.tsx`** → Root app container  
- **`main.tsx`** → Entry point

---

## 📖 Notes

- The first forecast day is hidden by design (today’s data is shown in “current weather” instead).
- Weather code → description → image mapping is handled via weatherCodes.json in the assets folder.
- Decimal values are truncated to 2 decimal places for readability.
- The app layout has been tuned primarily for Chrome but will work across all major browsers (Edge, Firefox, Brave, Opera, Safari, etc.) with normalize.css.

---

## ⚙️ Installation & Setup (pnpm/npm)

1. **Fork and/or Clone the repository**
2. **Install Dependencies**
  - pnpm install
3. **Start Development Server**
  - pnpm run dev
4. **Build for Production**
  - pnpm build
