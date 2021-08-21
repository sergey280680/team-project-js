import Pagination from 'tui-pagination';
import { Loading } from 'notiflix';
import 'tui-pagination/dist/tui-pagination.min.css';
import { getMovies } from './fetch';
import templatingOneFilm from '../templates/templatingOneFilm.hbs';
import { refs } from './refs';
import { dataSet, genresSet } from './templatingSettings';
import { controlModal } from './modal';
import { addCoverDefault } from './addCoverDefault';

Loading.init({ svgColor: '#ff6b08' });

refs.searchForm.addEventListener('submit', onInputSearch);

let page = 1;
let searchQuery;

function onInputSearch(e) {
  e.preventDefault();

  sessionStorage.removeItem('mainPage');
  const form = e.currentTarget;
  searchQuery = form.elements.user_text.value;

  if (searchQuery.trim() === '') {
    form.reset();
    return;
  }

  clearInterface();

  async function makePagination({ page, query } = {}) {
    const total = await showMovies({ page, query: searchQuery });
    if (total === null) {
      return;
    }
    const paginationEl = document.querySelector('.js-pagination');
    const instance = new Pagination(paginationEl, {
      totalItems: total,
      itemsPerPage: 20,
      centerAlign: true,
      page,
    });
    instance.on('beforeMove', function (eventData) {
      refs.movies.innerHTML = '';
      return showMovies({ page: eventData.page, query: searchQuery });
    });
  }

  makePagination({ page, query: searchQuery });
}

async function showMovies({ page, query } = {}) {
  Loading.init({ svgColor: '#ff6b08' });
  Loading.dots('Загрузка...');
  const data = await getMovies({ page, query: searchQuery });
  const arrayOfMovies = data.movies.map(movie => {
    const filmGenres = genresSet(movie.genreNames);
    const filmDate = dataSet(movie.release_date);
    return { ...movie, filmGenres, filmDate };
  });
  if (arrayOfMovies.length === 0) {
    refs.headerFailureNotice.classList.remove('hidden');
    refs.searchForm.reset();
    Loading.remove(500);
    return null;
  }

  refs.headerFailureNotice.classList.add('hidden');
  cardRender(arrayOfMovies);
  addCoverDefault(refs.filmList);
  controlModal();
  refs.searchForm.reset();
  Loading.remove(500);
  return data.total_results;
}

function cardRender(movies) {
  refs.filmList.insertAdjacentHTML('beforeend', templatingOneFilm(movies));
}

function clearInterface() {
  refs.movies.innerHTML = '';
  refs.pagination.innerHTML = '';
}
