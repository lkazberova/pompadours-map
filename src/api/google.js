let autocompleteService;
let placesService;

export const initAutocompleteService = () => {
  if (!autocompleteService) {
    autocompleteService = new window.google.maps.places.AutocompleteService();
    // console.log("initialize AutocompleteService");
  }
};

export const initPlacesService = () => {
  if (!placesService) {
    placesService = new window.google.maps.places.PlacesService(
      window.document.createElement("div")
    );
    // console.log("initialize PlacesService");
  }
};
export const getGeoSuggestions = (address, lang) => {
  if (!autocompleteService) initAutocompleteService();
  return new Promise(function(resolve, reject) {
    const options = {
      input: address,
      types: ["(regions)"]
      // componentRestrictions: { country: "usa" },
      // language: lang
    };
    autocompleteService.getPlacePredictions(options, function(
      predictions,
      status
    ) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK)
        reject(status);
      else resolve(predictions);
    });
  });
};

export const getPlaceDetails = (placeid, lang) => {
  if (!placesService) initPlacesService();
  return new Promise(function(resolve, reject) {
    const options = {
      placeId: placeid
    };
    placesService.getDetails(options, function(data, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK)
        reject(status);
      else resolve(data);
    });
  });
};
