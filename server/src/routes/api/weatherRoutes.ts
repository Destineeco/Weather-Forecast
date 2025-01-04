import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async(req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const cityName = req.body.cityName;
  
    WeatherService.getWeatherForCity(cityName).then((data) => {
      // Constructing newCity object based on the cityName and data
      const newCity = {
        id: 'unique-id',  // You would replace this with a real ID, e.g., UUID
        name: cityName,
        weatherData: data,  // Assuming you want to store the weather data as well
      };
  
      // Now calling addCity with both cityName and the newCity object
      HistoryService.addCity(cityName, newCity).then(() => {
        // You can do something with the result here if needed
        res.json(data);
      }).catch(error => {
        res.status(500).json({ error: 'Failed to add city to history', details: error });
      });
    }).catch(error => {
      res.status(500).json({ error: 'Failed to get weather data', details: error });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
  
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  HistoryService.getCities()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  });

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {res.json('id history info')});

export default router;
