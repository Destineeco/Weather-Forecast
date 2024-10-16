import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates{
  latitude: number
  longitude: number
  name: string
  country:string
  state: string
}
// TODO: Define a class for the Weather object
class Weather{
  cityName: string
  date: string
  icon: string
  description: string
  temp: number
  humidity: number
  windSpeed: number

  constructor(cityName: string, date: string, icon: string, description: string, temp: number, humidity: number, windSpeed: number ) {
    this.cityName = cityName
    this.date = date
    this.icon = icon
    this.description = description
    this.temp = temp
    this.humidity = humidity
    this.windSpeed = windSpeed
  }


}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseUrl?:string
  private apiKey?: string
  private cityName:''
  //baseUrl:string, apiKey:string, cityName:string
  constructor() {
    this.baseUrl =process.env.API_BASE_URL || ''
    this.apiKey = process.env.API_KEY || ''
    this.cityName =''
  }
  // TODO: Define the baseURL, API key, and city name properties

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query:string){
    const apiResponse: Coordinates= await fetch(query).then(response => response.json())
      console.log("FETCH", apiResponse)
    return apiResponse
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    console.log('location',locationData)
    const coordinates:Coordinates = {
      latitude, longitude, name, country, state
    } = locationData
    return coordinates;                                                                                                                                                                                                                                                                                                                                                                                                          
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    const currentQuery = `${this.baseUrl}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`
    console.log(currentQuery)
    return currentQuery;
  }//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    const fiveDayQuery= `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`
    console.log(fiveDayQuery)
    return fiveDayQuery;
  }
  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData() {
  // let locationData: coordinates=
    // this.buildGeocodeQuery()
    // .then((query: string) => {
    //  return 
      this.fetchLocationData(this.buildGeocodeQuery())
  .then((apiResult : any )=> {
      console.log(apiResult)
    return  this.destructureLocationData(apiResult)
    })
    //return locationData
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }

      
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
