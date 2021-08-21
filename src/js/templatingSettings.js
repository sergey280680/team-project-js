function genresSet(arreyGenreNames) {
  if (arreyGenreNames.length <= 3) {
    return arreyGenreNames.join(', ');
  } else {
    const newarrey = arreyGenreNames.slice(0, 2);
    return newarrey.join(', ') + ' и другие';
  }
}

function dataSet(release_date) {
  if (release_date) {
    return new Date(release_date).getFullYear();
  } else {
    return '';
  }
}

// проверка на целое число в рейтинге
function voteAverageNew(vote_average) {
  const x = Number.isInteger(vote_average);
  if (!x) {
    return vote_average;
  }
  return `${vote_average}.0`;
}

export { genresSet, dataSet, voteAverageNew };
