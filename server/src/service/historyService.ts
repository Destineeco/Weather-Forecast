import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// Define the HistoryService class
class HistoryService {
  // Method to read the data from the JSON file
  private async read() {
    try {
      const data = await fs.readFile('db/db.json', {
        flag: 'a+', // This flag ensures the file is created if it doesn't exist
        encoding: 'utf8',
      });
      return data;
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Could not read the data file');
    }
  }

  // Method to write data to the JSON file
  private async write(cities: City[]) {
    try {
      await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error('Could not write to the data file');
    }
  }

  // Method to get cities from the file
  async getCities(): Promise<City[]> {
    try {
      const citiesData = await this.read();
      let parsedCities: City[];
      try {
        parsedCities = [].concat(JSON.parse(citiesData));
      } catch (err) {
        parsedCities = [];
      }
      return parsedCities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  // Method to add a city to the search history
  async addCity(city: string, ): Promise<City> {

    const newCity: City = { name: city, id: uuidv4() };
    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  // Method to remove a city by its id from the search history
  async removeCity(id: string): Promise<void> {
    try {
      const cities = await this.getCities();

      // Filter out the city by id
      const filteredCities = cities.filter((city) => city.id !== id);

      // Write the filtered list of cities back to the file
      await this.write(filteredCities);
    } catch (error) {
      console.error('Error removing city:', error);
      throw new Error('Failed to remove city');
    }
  }
}

export default new HistoryService();
