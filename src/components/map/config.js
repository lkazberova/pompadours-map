export default {
  token: process.env.REACT_APP_MAPBOX_TOKEN,
  googlePlacesToken: process.env.REACT_APP_GOOGLE_PLACES_TOKEN,
  styles: {
    light: "mapbox://styles/mapbox/light-v9",
    dark: "mapbox://styles/mapbox/dark-v9",
    basic: "mapbox://styles/mapbox/basic-v9",
    outdoor: "mapbox://styles/mapbox/outdoors-v10",
    street: "mapbox://styles/mapbox/streets-v9",
    satellite: "mapbox://styles/mapbox/satellite-v9"
  }
};
