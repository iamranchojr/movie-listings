// import React
import React from "react";

// import carbon components
import {
  Loading,
  Checkbox,
  Select,
  SelectItem,
  Search,
  TextInput
} from "carbon-components-react";

// import components
import MovieCard from "../../components/movie-card/movie-card.component";

// import api service
import { fetchNowPlaying, fetchMovieGenres } from "../../api/movie.service";

// import styles
import "./home.styles.scss";

// Create Home React Component
class Home extends React.Component {
  // Constructor
  constructor(props) {
    // Always call the super constructor
    super(props);

    // set state
    this.state = {
      loading: true,
      errorMessage: null,
      movies: [],
      genres: [],
      genreFilter: [],
      rating: "",
      query: ""
    };
  }

  componentDidMount() {
    // fetch movies
    this.getMoviesNowPlaying();
  }

  getMoviesNowPlaying = async () => {
    // set loading to true and errorMessage to null
    this.setState({ loading: true, errorMessage: null });

    // fetch movie genres
    const genreResponse = await fetchMovieGenres();

    // if failed, hide loader and display error message
    if (!genreResponse.success) {
      this.setState({ loading: false, errorMessage: genreResponse.message });

      return;
    }

    // go ahead and fetch movies
    const movieResponse = await fetchNowPlaying();

    // if failed, hide loader and display error message
    if (!movieResponse.success) {
      this.setState({ loading: false, errorMessage: movieResponse.message });

      return;
    }

    // success, update state with movies
    this.setState({
      movies: movieResponse.movies,
      genres: genreResponse.genres,
      loading: false
    });
  };

  // override render to return html
  render() {
    let movies = this.state.movies;
    let movieGenreIds = [];

    // select genres that belongs to movies
    movies.forEach(movie => {
      movieGenreIds.push(...movie.genre_ids);
    });

    // make sure they are no duplicates in the ids
    movieGenreIds = [...new Set(movieGenreIds)];

    // now populate genres based on the distinct ids we have
    const genres = [];
    movieGenreIds.forEach(genreId =>
      genres.push(this.state.genres.find(genre => genre.id === genreId))
    );

    // Filter of genre if any selected

    if (this.state.genreFilter.length > 0) {
      const filteredMoviesByGenre = [];
      this.state.genreFilter.forEach(genreId => {
        const filterMovies = movies.filter(movie =>
          movie.genre_ids.includes(genreId)
        );
        console.log(filterMovies);

        filterMovies.forEach(movie => {
          // add only if it does not already exist
          if (!filteredMoviesByGenre.find(m => m.id === movie.id)) {
            filteredMoviesByGenre.push(movie);
          }
        });
      });

      movies = filteredMoviesByGenre;
    }

    // filter by rating if valid
    if (this.state.rating.length > 0 && this.state.rating <= 10) {
      movies = movies.filter(movie => movie.vote_average == this.state.rating);
    }

    // filter by query if not empty
    if (this.state.query.length > 0) {
      movies = movies.filter(movie =>
        movie.title.toLowerCase().includes(this.state.query.toLowerCase())
      );
    }

    // sort by popularity
    movies.sort((a, b) => b.popularity - a.popularity);

    return (
      <div className="movie-listings">
        <h1 className="heading">MOVIE LISTINGS v1</h1>
        <hr />

        <div className="loader-div" hidden={!this.state.loading}>
          <Loading className="loader" small={true} withOverlay={false} />
        </div>

        <div className="error" hidden={this.state.errorMessage == null}>
          <span className="mt-10 text-danger">{this.state.errorMessage}.</span>
          &nbsp;
          <span
            className="text-primary pointer font-bold"
            onClick={() => this.getMoviesNowPlaying()}
          >
            TRY AGAIN
          </span>
        </div>

        <div className="movie-list" hidden={this.state.loading}>
          <div className="genre-filter mb-10">
            <p className="mb-10 font-bold">Filter</p>
            <div className="bx--row">
              {genres.map(genre => (
                <div key={genre.id} className="bx--col-md-1">
                  <Checkbox
                    id={`${genre.id}`}
                    labelText={genre.name}
                    onChange={value => {
                      const genreFilter = [...this.state.genreFilter];
                      if (value) {
                        // add
                        genreFilter.push(genre.id);
                      } else {
                        // remove
                        const index = genreFilter.findIndex(
                          genreId => genreId === genre.id
                        );

                        genreFilter.splice(index, 1);
                      }

                      this.setState({
                        genreFilter: genreFilter
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rating-search-filter mb-20">
            <div className="bx--row">
              <div className="bx--col-lg-2">
                <TextInput
                  data-invalid={this.state.rating > 10}
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={this.state.rating}
                  placeholder="Rating"
                  onChange={e => {
                    this.setState({ rating: e.target.value });
                  }}
                />
              </div>
              <div className="bx--col-lg-10">
                <Search
                  value={this.state.query}
                  placeHolderText="Search by movie title"
                  onChange={e => {
                    this.setState({ query: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="bx--row">
            {movies.map(movie => (
              <div key={movie.id} className="bx--col-lg-3 mb-20 fade-in">
                <MovieCard movie={movie} genres={this.state.genres} />
              </div>
            ))}
          </div>
        </div>

        <div className="footer">
          <hr />
          <h5 className="heading">&copy; 2020 @iamranchojr</h5>
        </div>
      </div>
    );
  }
}

// export out Home as default so we can import
export default Home;
