import { getMovieById } from './fetch';
import movieTemplate from '../../src/templates/modal.hbs';
import { refs } from './refs';
import { markupQueue, markupWatched } from './watched';
import { addCoverDefault } from './addCoverDefault';

const modalContentEl = document.querySelector('#modal-content');

const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
const queueMovies = JSON.parse(localStorage.getItem('queueMovies')) || [];

export function controlModal() {
  const openModalBtnEl = document.querySelector('[data-modal-open]');
  const closeModalBtnEL = document.querySelector('[data-modal-close]');
  const modalEl = document.querySelector('[data-modal]');

  openModalBtnEl.addEventListener('click', onClickOpenModal);
  closeModalBtnEL.addEventListener('click', onClickCloseModal);
  modalEl.addEventListener('click', onClickBackdropModal);

  function onClickOpenModal(event) {
    event.preventDefault();

    if (event.target.nodeName === 'UL') {
      return;
    }

    const listItem = event.target.closest('LI');
    if (!listItem) {
      return;
    }

    const movieId = Number(listItem.dataset.id);
    if (!movieId) {
      return;
    }

    let currentMovie = {};

    getMovieById(movieId)
      .then(movie => {
        currentMovie = movie;
        modalContentEl.innerHTML = '';
        modalContentEl.innerHTML = movieTemplate(movie);
      })
      .then(() => {
        addCoverDefault(modalContentEl);
      })
      .then(() => {
        openModal(modalEl);
      })

      /* BUTTONS */
      .then(() => {
        const modalWatchedBtn = document.querySelector('#modal-watched-btn');
        const modalQueueBtn = document.querySelector('#modal-queue-btn');
        if (!modalWatchedBtn && !modalQueueBtn) {
          return;
        }

        controlBtnStyle({
          button: modalWatchedBtn,
          list: watchedMovies,
          movieId,
          listType: 'watched',
        });
        controlBtnStyle({ button: modalQueueBtn, list: queueMovies, movieId, listType: 'queue' });

        modalWatchedBtn.addEventListener('click', () => {
          let indexMovie = null;

          watchedMovies.forEach((item, idx) => {
            if (Number(item.id) === Number(movieId)) {
              indexMovie = idx;
            }
          });

          if (indexMovie !== null) {
            watchedMovies.splice(indexMovie, 1);
            localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
            if (sessionStorage.getItem('pageWatched') === 'watched') {
              markupWatched(Number(sessionStorage.getItem('watchedPage')));
            }
            controlBtnStyle({
              button: modalWatchedBtn,
              list: watchedMovies,
              movieId,
              listType: 'watched',
            });
            return;
          }
          watchedMovies.push(currentMovie);
          localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
          if (sessionStorage.getItem('pageWatched') === 'watched') {
            markupWatched(Number(sessionStorage.getItem('watchedPage')));
          }
          controlBtnStyle({
            button: modalWatchedBtn,
            list: watchedMovies,
            movieId,
            listType: 'watched',
          });
        });

        modalQueueBtn.addEventListener('click', () => {
          let indexMovie = null;

          queueMovies.forEach((item, idx) => {
            if (Number(item.id) === Number(movieId)) {
              indexMovie = idx;
            }
          });

          if (indexMovie !== null) {
            queueMovies.splice(indexMovie, 1);
            localStorage.setItem('queueMovies', JSON.stringify(queueMovies));
            if (sessionStorage.getItem('pageQueue') === 'queue') {
              markupQueue(Number(sessionStorage.getItem('queueMovies')));
            }
            controlBtnStyle({
              button: modalQueueBtn,
              list: queueMovies,
              movieId,
              listType: 'queue',
            });
            return;
          }

          queueMovies.push(currentMovie);
          localStorage.setItem('queueMovies', JSON.stringify(queueMovies));
          if (sessionStorage.getItem('pageQueue') === 'queue') {
            markupQueue(Number(sessionStorage.getItem('queueMovies')));
          }
          controlBtnStyle({ button: modalQueueBtn, list: queueMovies, movieId, listType: 'queue' });
        });
      });

    /* BUTTONS */
  }

  function openModal(modalEl) {
    modalEl.classList.remove('backdrop__hidden');
    document.body.classList.add('open');
    window.addEventListener('keydown', onKeydownEscape);
  }

  function onKeydownEscape(event) {
    if (event.code !== 'Escape') {
      return;
    }
    closeModal();
  }

  function onClickCloseModal() {
    closeModal();
  }

  function closeModal() {
    modalEl.classList.add('backdrop__hidden');
    document.body.classList.remove('open');
    window.removeEventListener('keydown', onKeydownEscape);
  }

  function onClickBackdropModal(event) {
    if (event.target !== modalEl) {
      return;
    }
    closeModal();
  }

  function controlBtnStyle({ button, list, movieId, listType }) {
    let indexMovie = null;

    list.forEach((item, idx) => {
      if (Number(item.id) === Number(movieId)) {
        indexMovie = idx;
      }
    });

    if (indexMovie !== null) {
      button.classList.add('in-list');
      button.textContent = listType === 'watched' ? 'REMOVE FROM WATCHED' : 'REMOVE FROM QUEUE';
      return;
    }

    button.classList.remove('in-list');
    button.textContent = listType === 'watched' ? 'ADD TO WATCHED' : 'ADD TO QUEUE';
  }
}
