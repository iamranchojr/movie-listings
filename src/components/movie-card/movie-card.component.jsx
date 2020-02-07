// import React
import React from "react";

// import styles
import "./movie-card.styles.scss";

const MovieCard = ({ movie: { title, poster_path, genre_ids }, genres }) => {
  let movieGenres = "";
  // get movie genres from genre_ids
  genre_ids.forEach(id => {
    // find genre using id
    const genre = genres.find(item => item.id === id);

    // just to be on the safer side
    if (genre) {
      movieGenres += `${genre.name} | `;
    }
  });

  return (
    <div className="movie">
      <div
        style={{
          backgroundImage: `url(http://image.tmdb.org/t/p/w500${poster_path})`
        }}
        className="poster"
      ></div>
      <p className="title text-truncate">{title}</p>
      <p className="genre text-truncate">{movieGenres}</p>
    </div>
  );
};

export default MovieCard;
