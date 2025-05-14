/**
 * Type definitions for assets/scripts/weather.js
 */

/**
 * Weather interface for retrieving weather information
 */
interface Weather {
  /**
   * Initialize the weather system
   * @param {WeatherOptions} [options] - Configuration options
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   */
  init(options?: WeatherOptions): Promise<void>;
  
  /**
   * Get current weather for a location
   * @param {string} location - The location to get weather for (city name, coordinates, etc.)
   * @returns {Promise<WeatherData>} A promise that resolves to the weather data
   */
  getCurrentWeather(location: string): Promise<WeatherData>;
  
  /**
   * Get weather forecast for a location
   * @param {string} location - The location to get forecast for
   * @param {number} [days=5] - Number of days to forecast
   * @returns {Promise<WeatherForecast>} A promise that resolves to the weather forecast
   */
  getForecast(location: string, days?: number): Promise<WeatherForecast>;
}

/**
 * Weather options interface
 */
interface WeatherOptions {
  /** API key for weather service */
  apiKey?: string;
  /** Units to use (metric, imperial) */
  units?: 'metric' | 'imperial';
  /** Default location */
  defaultLocation?: string;
}

/**
 * Weather data interface
 */
interface WeatherData {
  /** Location information */
  location: {
    /** City name */
    city: string;
    /** Country code */
    country: string;
    /** Latitude */
    lat: number;
    /** Longitude */
    lon: number;
  };
  /** Current weather conditions */
  current: {
    /** Temperature */
    temp: number;
    /** Feels like temperature */
    feelsLike: number;
    /** Humidity percentage */
    humidity: number;
    /** Wind speed */
    windSpeed: number;
    /** Wind direction in degrees */
    windDeg: number;
    /** Weather condition code */
    conditionCode: number;
    /** Weather condition description */
    description: string;
    /** Weather icon code */
    icon: string;
  };
  /** Timestamp of data retrieval */
  timestamp: number;
}

/**
 * Weather forecast interface
 */
interface WeatherForecast {
  /** Location information */
  location: {
    /** City name */
    city: string;
    /** Country code */
    country: string;
  };
  /** Daily forecast data */
  daily: Array<{
    /** Date of forecast */
    date: number;
    /** Temperature range */
    temp: {
      /** Minimum temperature */
      min: number;
      /** Maximum temperature */
      max: number;
    };
    /** Weather condition code */
    conditionCode: number;
    /** Weather condition description */
    description: string;
    /** Weather icon code */
    icon: string;
    /** Precipitation probability (0-1) */
    precipitation: number;
    /** Humidity percentage */
    humidity: number;
  }>;
}
