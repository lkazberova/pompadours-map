import { all, call, put, takeLatest } from "redux-saga/effects";
import { createAsyncAction } from "../helpers/redux";
import { createSelector } from "reselect";
import * as Api from "../api/google";
import { getBBox, getLatitude, getLongitude } from "../helpers/map";

/**
 * Constants
 * */
export const moduleName = "geocode";
const prefix = `${moduleName}`;

export const GET_GEO_SUGGESTIONS = createAsyncAction(
  `${moduleName}/GET_GEO_SUGGESTIONS`
);
export const GET_PLACE_DETAILS = createAsyncAction(
  `${moduleName}/GET_PLACE_DETAILS`
);
/**
 * Reducer
 * */
const initialState = {
  loading: false,
  suggestions: [],
  inputSuggest: null
};
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GEO_SUGGESTIONS.REQUEST:
      return {
        ...state,
        loading: true
      };
    case GET_GEO_SUGGESTIONS.SUCCESS:
      return {
        ...state,
        loading: false,
        suggestions: payload.addresses,
        inputSuggest: payload.address
      };

    default:
      return state;
  }
}
/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];
export const suggestionsSelector = createSelector(
  stateSelector,
  state => state.suggestions
);
export const inputSuggestSelector = createSelector(
  stateSelector,
  state => state.inputSuggest
);
/**
 * Action Creators
 * */
export const getGeoSuggestions = address => ({
  type: GET_GEO_SUGGESTIONS.REQUEST,
  payload: address
});
export const getPlaceDetails = place => ({
  type: GET_PLACE_DETAILS.REQUEST,
  payload: { place }
});
/**
 * Sagas
 **/
function* getGoogleMapSuggestions(action) {
  try {
    // console.log("saga");
    const predictions = yield call(Api.getGeoSuggestions, action.payload);
    const addresses = predictions.map(
      ({
        place_id,
        description,
        terms,
        structured_formatting: { main_text }
      }) => ({
        placeid: place_id,
        name: description,
        street: main_text
      })
    );
    // console.log(addresses);
    yield put({
      type: GET_GEO_SUGGESTIONS.SUCCESS,
      payload: { addresses, address: action.payload }
    });
  } catch (e) {
    yield put({ type: GET_GEO_SUGGESTIONS.FAILURE, message: e.message });
  }
}
export function* getGooglePlaceDetails(placeid, lang) {
  try {
    const result = yield call(Api.getPlaceDetails, placeid, lang);

    const lon = getLongitude(result);
    const lat = getLatitude(result);
    // console.log("bbox", result.geometry.viewport);
    const bbox = getBBox(result);
    yield put({
      type: GET_PLACE_DETAILS.SUCCESS,
      lon,
      lat,
      bbox
    });
    return { lon, lat, bbox };
  } catch (e) {
    yield put({ type: GET_PLACE_DETAILS.FAILURE, message: e.message });
  }
}

export function* saga() {
  const result = yield all([
    takeLatest(GET_GEO_SUGGESTIONS.REQUEST, getGoogleMapSuggestions),
    takeLatest(GET_PLACE_DETAILS.REQUEST, getGooglePlaceDetails)
  ]);
}
