# Weather Integration

This document provides an overview of the weather integration system used in the CCPorted platform.

## Overview

The CCPorted platform includes a weather integration system that allows users to view current weather information and forecasts. This feature enhances the user experience by providing contextual information that may be relevant to their gaming sessions.

## Components

The weather integration system consists of:

1. **assets/scripts/weather.js**: Core weather functionality
2. **weather/**: Directory containing weather-related files

## Features

The weather integration system provides the following features:

- **Current Weather**: Display of current weather conditions
- **Weather Forecast**: Multi-day weather forecasts
- **Location Detection**: Automatic detection of user location
- **Manual Location**: Manual entry of location
- **Unit Conversion**: Support for metric and imperial units
- **Weather Icons**: Visual representation of weather conditions

## Architecture

The weather integration system follows a client-server architecture:

1. **Client-side**: JavaScript code for UI and weather data display
2. **Third-party API**: Integration with external weather data providers
3. **Caching**: Local caching of weather data to reduce API calls

## Usage

To use the weather system in a page:

1. Initialize the weather system with configuration options
2. Get current weather for a location
3. Display weather information

Example:
```javascript
// Initialize weather system
const weather = new Weather({
  units: 'metric',
  defaultLocation: 'New York'
});

// Get current weather
weather.getCurrentWeather('London')
  .then(weatherData => {
    // Display weather in UI
    console.log(`Current temperature in ${weatherData.location.city}: ${weatherData.current.temp}°C`);
    console.log(`Conditions: ${weatherData.current.description}`);
    console.log(`Humidity: ${weatherData.current.humidity}%`);
  })
  .catch(error => console.error('Failed to get weather:', error));

// Get forecast
weather.getForecast('London', 5)
  .then(forecast => {
    // Display forecast in UI
    console.log(`5-day forecast for ${forecast.location.city}:`);
    forecast.daily.forEach(day => {
      const date = new Date(day.date).toLocaleDateString();
      console.log(`${date}: ${day.temp.min}°C - ${day.temp.max}°C, ${day.description}`);
    });
  })
  .catch(error => console.error('Failed to get forecast:', error));
```

## Weather Data Format

Weather data has the following format:

```typescript
interface WeatherData {
  location: {
    city: string;       // City name
    country: string;    // Country code
    lat: number;        // Latitude
    lon: number;        // Longitude
  };
  current: {
    temp: number;       // Temperature
    feelsLike: number;  // Feels like temperature
    humidity: number;   // Humidity percentage
    windSpeed: number;  // Wind speed
    windDeg: number;    // Wind direction in degrees
    conditionCode: number; // Weather condition code
    description: string; // Weather condition description
    icon: string;       // Weather icon code
  };
  timestamp: number;    // Timestamp of data retrieval
}
```

## Configuration Options

The weather system can be configured with the following options:

```typescript
interface WeatherOptions {
  apiKey?: string;      // API key for weather service
  units?: 'metric' | 'imperial'; // Units to use
  defaultLocation?: string; // Default location
}
```

## Integration with Other Components

The weather integration system is relatively standalone but can integrate with:

- **User Profiles**: To store user location preferences
- **Theme System**: To adapt weather display to current theme

## Type Definitions

Type definitions for the weather system can be found in:

- `static/types/weather.d.ts`

This provides detailed type information for the weather APIs.
