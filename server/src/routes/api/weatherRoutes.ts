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
      HistoryService.addCity(cityName);

      res.json(data);
    });
  } catch (error) {
    res.status(500).json(error);
  }
  
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const data = await HistoryService.getCities(); // Await the data directly
    if (data) {
      return res.json(data); // Return data if found
    }
    // If no data found, send a 404 error response
    return res.status(404).json({ message: 'No search history found' });
  } catch (err) {
    console.error('Error retrieving history:', err); // Log the error for debugging
    return res.status(500).json({ error: 'Failed to retrieve history' }); // Return error if something goes wrong
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {res.json('id history info')});

export default router;
