import cover from '../images/default_cover.jpg';

export function addCoverDefault(path) {
  const images = path.querySelectorAll('img');
  for (const image of images) {
    if (image.dataset.src.slice(-4) === 'null') {
      image.dataset.src = cover;
    }
  }
}
