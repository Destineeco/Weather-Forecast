import fs from 'node:fs/promises';

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
  async addCity(city: string, newCity: City): Promise<City> {
    try {
      const cities = await this.getCities();

      // Check if the city already exists by its name
      const cityExists = cities.some((existingCity) => existingCity.name === city);
      
      if (cityExists) {
        return newCity; // If the city exists, just return the city without adding it
      }

      // If city doesn't exist, add the new city to the list
      const updatedCities = [...cities, newCity];
      await this.write(updatedCities); // Write the updated list to the file

      return newCity; // Return the newly added city
    } catch (error) {
      console.error('Error adding city:', error);
      throw new Error('Failed to add city');
    }
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
