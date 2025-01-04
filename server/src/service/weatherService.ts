import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// Define the Coordinates interface for latitude and longitude
interface Coordinates {
  lat: number;
  lon: number;
}

// Define the Weather class
class Weather {
  city: string;
  date: Dayjs | string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: Dayjs | string,
    icon: string,
    iconDescription: string,
    tempF: number,
    humidity: number,
    windSpeed: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// Define the WeatherService class
class WeatherService {
  private baseUrl: string | undefined;
  private apiKey: string | undefined;
  private cityName = '';

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetch the location data based on city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const apiResponse: Coordinates = await fetch(query).then((response) =>
      response.json()
    );
    console.log('FETCH', apiResponse);
    return apiResponse;
  }

  // Destructure the location data to get coordinates
  private destructureLocationData(locationData: Coordinates): Coordinates {
    console.log('location', locationData);
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // Build the query for geolocation data
  private buildGeocodeQuery(): string {
    const currentQuery = `${this.baseUrl}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
    console.log(currentQuery);
    return currentQuery;
  }

  // Build the weather query using coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // Fetch and destructure the location data
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }

  // Fetch weather data for the given coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather[]> {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
      if (!response) {
        throw new Error('Weather data not found');
      }

      const currentWeather = this.parseCurrentWeather(response.list[0]);
      const forecast = this.buildForecastArray(currentWeather, response.list);
      return forecast;
    } catch (error: any) {
      console.error(error);
      throw new Error('Error fetching weather data');
    }
  }

  // Parse the current weather from the response
  private parseCurrentWeather(response: any): Weather {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');

    const currentWeather = new Weather(
      this.cityName,
      parsedDate,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main,
      response.main.temp,
      response.main.humidity,
      response.wind.speed
    );

    return currentWeather;
  }

  // Build the forecast array based on the data
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const weatherForecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((data: any) =>
      data.dt_txt.includes('12:00:00')
    );

    filteredWeatherData.forEach((day: any) => {
      weatherForecast.push(
        new Weather(
          this.cityName,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main,
          day.main.temp,
          day.main.humidity,
          day.wind.speed
        )
      );
    });

    return weatherForecast;
  }

  // Get the weather for a specific city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      if (coordinates) {
        const weather = await this.fetchWeatherData(coordinates);
        return weather;
      }
      throw new Error('Weather data not found');
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

export default new WeatherService();
