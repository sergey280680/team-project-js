import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '8857d429b3f4a90bd68818ba1dfea9bc';
// const API_KEY = '98b2d661a291459629d67fe532d04a86';

async function getMovies({ page = 1, query } = {}) {
  const genres = await getGenres();

  try {
    if (query) {
      const data = await axios(
        `${BASE_URL}search/movie?api_key=${API_KEY}&language=ru&page=${page}&query=${query}`,
      );
      const obj = {};
      obj.movies = addGenresAndPictures(data, genres);
      obj.total_results = data.data.total_results;
      return obj;
    }
    const data = await axios(
      `${BASE_URL}trending/movie/week?api_key=${API_KEY}&language=ru&page=${page}`,
    );
    const obj = {};
    obj.movies = addGenresAndPictures(data, genres);
    obj.total_results = data.data.total_results;
    return obj;
  } catch (error) {
    console.log(error);
  }
}

async function getMovieById(movieId) {
  try {
    const response = await axios(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ru`,
    );
    const data = response.data;
    const genres = data.genres.map(genre => genre.name);
    const poster = `https://image.tmdb.org/t/p/original${data.poster_path}`;
    return { ...data, genres, poster };
  } catch (error) {
    console.log(error);
  }
}

function addGenresAndPictures(data, genres) {
  const movies = data.data.results;
  const modifyGenresArray = modifyGenres(movies, genres);
  return modifyImage(modifyGenresArray);
}

async function getGenres() {
  try {
    const data = await axios(`${BASE_URL}genre/movie/list?api_key=${API_KEY}&language=ru`);
    return data.data.genres;
  } catch (error) {
    console.log(error);
  }
}

function modifyGenres(movies, genres) {
  return movies.map(item => {
    const genreIDs = item.genre_ids;
    const genreIDsNames = genres.filter(genre => {
      if (genreIDs.includes(genre.id)) {
        return genre.name;
      }
    });
    const genreNames = genreIDsNames.map(genre => genre.name);
    return { ...item, genreNames };
  });
}

function modifyImage(movies) {
  return movies.map(item => {
    const poster = `https://image.tmdb.org/t/p/original${item.poster_path}`;
    return { ...item, poster };
  });
}

export { getMovies, getMovieById };
