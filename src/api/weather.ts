/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchWeatherApi } from "openmeteo";
import weatherCodesJson from "../assets/weatherCodes.json";

// Type definitions
export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  is_day: number;
  rain: number;
  weather_code: number;
  weather_description: string;
  weather_image: string;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyWeather {
  time: Date[];
  weather_code: number[];
  weather_description: string[];
  weather_image: string[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherData {
  city?: string;
  current: CurrentWeather;
  daily: DailyWeather;
}

// Helper to safely convert Float32Array | null → number[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getArray = (variable: any): number[] => {
  const arr = variable?.valuesArray();
  return arr ? Array.from(arr) : [];
};

// Get coordinates from city name
export async function getCoordinates(
  city: string
): Promise<{ lat: number; lon: number }> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch coordinates");

  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error("City not found");

  return { lat: data.results[0].latitude, lon: data.results[0].longitude };
}

// Get weather by city (current + 7-day forecast)
export async function getWeather(city: string): Promise<WeatherData> {
  const { lat, lon } = await getCoordinates(city);

  const params = {
    latitude: lat,
    longitude: lon,
    daily: [
      "weather_code",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_probability_max",
      "wind_speed_10m_max",
    ],
    current: [
      "temperature_2m",
      "is_day",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ],
    timezone: "auto",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  if (!response) throw new Error("No weather data returned by API");

  const utcOffsetSeconds = response.utcOffsetSeconds();

  // Current weather
  const current = response.current()!;
  const currentWeather: CurrentWeather = {
    time: new Date(
      (Number(current.time()) + utcOffsetSeconds) * 1000
    ).toISOString(),
    temperature_2m: current.variables(0)!.value(),
    is_day: current.variables(1)!.value(),
    rain: current.variables(2)!.value(),
    weather_code: current.variables(3)!.value(),
    weather_description:
      current.variables(3)!.value() !== null
        ? current.variables(1)!.value() === 1
          ? // @ts-expect-error - changes to string as needed
            weatherCodesJson[current.variables(3)!.value().toString()]?.day
              .description || "Unknown"
          : // @ts-expect-error - changes to string as needed
            weatherCodesJson[current.variables(3)!.value().toString()]?.night
              .description || "Unknown"
        : "Unknown",
    weather_image:
      current.variables(3)!.value() !== null
        ? current.variables(1)!.value() === 1
          ? // @ts-expect-error - changes to string as needed
            weatherCodesJson[current.variables(3)!.value().toString()]?.day
              .image || "Unknown"
          : // @ts-expect-error - changes to string as needed
            weatherCodesJson[current.variables(3)!.value().toString()]?.night
              .image || "Unknown"
        : "Unknown",
    wind_speed_10m: current.variables(4)!.value(),
    wind_direction_10m: current.variables(5)!.value(),
  };

  // Daily weather
  const daily = response.daily()!;
  const dailyStart = Number(daily.time());
  const dailyInterval = daily.interval();

  const weatherCodes = getArray(daily.variables(0));
  const apparentMax = getArray(daily.variables(1));
  const apparentMin = getArray(daily.variables(2));
  const precipMax = getArray(daily.variables(3));
  const windMax = getArray(daily.variables(4));

  const dailyWeather: DailyWeather = {
    time: [...Array(weatherCodes.length)].map(
      (_, i) =>
        new Date((dailyStart + i * dailyInterval + utcOffsetSeconds) * 1000)
    ),
    weather_code: weatherCodes,
    weather_description: weatherCodes.map(
      (code: number) =>
        // @ts-expect-error - changes to string as needed
        weatherCodesJson[code.toString()]?.day.description || "Unknown"
    ),
    weather_image: weatherCodes.map(
      (code: number) =>
        // @ts-expect-error - changes to string as needed
        weatherCodesJson[code.toString()]?.day.image || ""
    ),
    apparent_temperature_max: apparentMax,
    apparent_temperature_min: apparentMin,
    precipitation_probability_max: precipMax,
    wind_speed_10m_max: windMax,
  };

  return {
    city,
    current: currentWeather,
    daily: dailyWeather,
  };
}
