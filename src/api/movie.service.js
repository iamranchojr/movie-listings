// import axios to make api request
const axios = require("axios").default;

// set API BASE URL
const BASE_URL = "https://api.themoviedb.org/3/";

// set API KEY
const API_KEY = "69b136ee84967f4ce93620a77698262a";

// set error messages
const ERROR_MESSAGES = {
  UNKNOWN_SERVER_ERROR:
    "An unknown server error occurred. This may be temporary, kindly try again in a short while, if the problem still persist, please contact support",
  UNKNOWN_ERROR:
    "An unknown error occurred, please check your network connectivity"
};

// get movie genres
export const fetchMovieGenres = async () => {
  // build url
  const url = `${BASE_URL}genre/movie/list?api_key=${API_KEY}`;

  // we wrap this in a try catch block because
  // axios throws an exception when request fails
  try {
    // initiate request
    let response = await axios.get(url);

    // return success: true and genres off response
    return { success: true, genres: response.data.genres };
  } catch (error) {
    // call our handleError function to handle the error
    return handleError(error);
  }
};

// get now playing
export const fetchNowPlaying = async () => {
  // build url
  const url = `${BASE_URL}movie/now_playing?api_key=${API_KEY}`;

  // we wrap this in a try catch block because
  // axios throws an exception when request fails
  try {
    // initiate request
    let response = await axios.get(url);

    // return success: true and movies off response
    return { success: true, movies: response.data.results };
  } catch (error) {
    // call our handleError function to handle the error
    return handleError(error);
  }
};

export const handleError = error => {
  if (error.response) {
    // authentication error
    if (error.response.status === 401) {
      return {
        success: false,
        message: error.response.data.status_message
      };
    }

    // unknown server error
    return { success: false, message: ERROR_MESSAGES.UNKNOWN_SERVER_ERROR };
  }

  // could not contact server or could not receive a response
  return { success: false, message: ERROR_MESSAGES.UNKNOWN_ERROR };
};
