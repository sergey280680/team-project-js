import { refs } from './refs';
import makePaginationFn from '../index';

refs.logo.addEventListener('click', onLogo);
refs.libraryLink.addEventListener('click', onLibraryClick);
refs.homeLink.addEventListener('click', onHomeClick);

// сохраняет класс LIBRARY при перезагрузке страници LIBRARY
(function () {
  if (sessionStorage.getItem('pageLibrary') === 'library') {
    sessionStorage.setItem('pageLibrary', 'library');
    refs.header.classList.add('library');
    keepLibraryBtnStyle();
    return;
  }
})();

function onLibraryClick() {
  keepLibraryBtnStyle();
  pageClassSetter();
}

function pageClassSetter() {
  sessionStorage.setItem('pageLibrary', 'library');
  sessionStorage.setItem('pageWatched', 'watched');
  refs.header.classList.add('library');
}

function onHomeClick(e) {
  e.preventDefault();
  resetToHomePageStyle();
  makePaginationFn(1);
}

function onLogo(e) {
  e.preventDefault();
  sessionStorage.clear();
  resetToHomePageStyle();
  makePaginationFn(1);
}

function keepLibraryBtnStyle() {
  refs.homeLink.classList.remove('header__link--current');
  refs.libraryLink.classList.add('header__link--current');
  refs.headerLibraryButtons.classList.remove('hidden');
  refs.headerSearchBlock.classList.add('hidden');
}

function resetToHomePageStyle() {
  sessionStorage.removeItem('pageLibrary');
  sessionStorage.removeItem('mainPage');
  sessionStorage.getItem('pageWatched')
    ? sessionStorage.removeItem('pageWatched')
    : sessionStorage.removeItem('pageQueue');
  refs.header.classList.remove('library');
  refs.homeLink.classList.add('header__link--current');
  refs.libraryLink.classList.remove('header__link--current');
  refs.headerLibraryButtons.classList.add('hidden');
  refs.headerSearchBlock.classList.remove('hidden');
  refs.headerFailureNotice.classList.add('hidden');
}
