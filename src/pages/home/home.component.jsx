// import React
import React from "react";

// import carbon components
import { Loading } from "carbon-components-react";

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
      genres: []
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
    this.setState(
      {
        movies: movieResponse.movies,
        genres: genreResponse.genres,
        loading: false
      },
      () => {
        console.log(this.state.movies);
        console.log(this.state.genres);
      }
    );
  };

  // override render to return html
  render() {
    let movies = this.state.movies;

    // TODO: Filter

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
