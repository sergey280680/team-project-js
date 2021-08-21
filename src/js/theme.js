import { refs } from './refs';

refs.iconDark.addEventListener('click', onThemeDark);
refs.iconLight.addEventListener('click', onThemeLight);

if (localStorage.getItem('themeDark') === 'dark') {
  themeDark();
}

function onThemeDark(e) {
  localStorage.setItem('themeDark', 'dark');
  themeDark();
}

function onThemeLight(e) {
  localStorage.removeItem('themeDark');
  themeLight();
}

function themeDark() {
  refs.body.classList.add('theme-dark');
  refs.iconDark.classList.add('hidden');
  refs.iconLight.classList.remove('hidden');
  refs.header.classList.add('theme-dark');
}

function themeLight() {
  refs.body.classList.remove('theme-dark');
  refs.iconDark.classList.remove('hidden');
  refs.iconLight.classList.add('hidden');
  refs.header.classList.remove('theme-dark');
}
