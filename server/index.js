import express from 'express';
import axios from 'axios';
import env from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

env.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.post('/', async (req, res) => {
  const action = req.body.action;

  if (!action || action === undefined || action === null) {
    return res.status(400).json({
      message: 'missing action parameter',
    });
  }

  const API_ENDPOINT = {
    'now-playing': `${process.env.BASE_URL}movie/now_playing?api_key=${process.env.KEY}&language=${process.env.DEFAULT_LANGUAGE}&page=1`,
    search: query =>
      `${process.env.BASE_URL}search/movie?api_key=${process.env.KEY}&query=${query}`,
    upcoming: `${process.env.BASE_URL}movie/upcoming?api_key=${process.env.KEY}&language=${process.env.DEFAULT_LANGUAGE}&page=1`,
    detail: id =>
      `${process.env.BASE_URL}movie/${id}?api_key=${process.env.KEY}`,
  };

  const fetchMovies = async () => {
    try {
      const data = await axios.get(`${API_ENDPOINT[action]}`);
      return data.data;
    } catch (error) {
      return error;
    }
  };

  const movies = await fetchMovies();

  res.json({ ...movies });
});

app.post('/search', async (req, res) => {
  const query = req.body.query;

  if (!query || query === undefined || query === null) {
    return res.status(400).json({
      message: 'missing action parameter',
    });
  }

  const fetchMovies = async () => {
    try {
      const data = await axios.get(
        `${process.env.BASE_URL}search/movie?api_key=${process.env.KEY}&query=${query}`,
      );
      return data.data;
    } catch (error) {
      return error;
    }
  };

  const movies = await fetchMovies();

  res.json({ ...movies });
});

app.listen(3030, () =>
  console.log('Running Frontend Proxy Server on http://localhost:3030'),
);
