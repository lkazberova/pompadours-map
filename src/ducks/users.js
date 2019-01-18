import { all, put, takeEvery, select } from "redux-saga/effects";
import { createAsyncAction } from "../helpers/redux";
import { createSelector } from "reselect";
import cities from "../mockups/cities";
import sortBy from "lodash.sortby";
import { getPositionInCircle } from "../helpers/map";

/**
 * Constants
 * */
export const moduleName = "users";
const prefix = `${moduleName}`;

export const FETCH_ALL = createAsyncAction(`${prefix}/FETCH_ALL`);
export const GET_SUGGESTIONS = createAsyncAction(`${prefix}/GET_SUGGESTIONS`);
/**
 * Reducer
 * */
const initialState = {
  loading: false,
  items: [],
  suggestions: []
};
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL.REQUEST:
      return { ...state, loading: true };
    case FETCH_ALL.SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case GET_SUGGESTIONS.SUCCESS:
      return { ...state, suggestions: payload };
    default:
      return state;
  }
}
/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];
export const usersSelector = createSelector(
  stateSelector,
  state => state.items
);
export const usersSuggestionsSelector = createSelector(
  stateSelector,
  state => state.suggestions
);
export const usersGeoJSONSelector = createSelector(
  stateSelector,
  state =>
    sortBy(state.items, ["lat", "lng"]).reduce(
      (result, value, index, array) => {
        const { city, user, lat, lng, nickname, avatar } = value;

        /**
         * Place users with the same coordinates by the circle for pretty view
         */
        let randomPoint,
          circleIndex = 0;
        if (
          index > 0 &&
          array[index - 1].lat === lat &&
          array[index - 1].lng === lng
        ) {
          circleIndex = result.features[index - 1].properties.circleIndex + 1;
          randomPoint = getPositionInCircle([lng, lat], 1, circleIndex);
        }

        result.features[index] = {
          type: "Feature",
          properties: {
            city,
            user,
            nickname,
            avatar,
            ...value,
            circleIndex
          },
          geometry: {
            type: "Point",
            coordinates: randomPoint ? randomPoint : [lng, lat]
          }
        };
        return result;
      },
      { type: "FeatureCollection", features: [] }
    )
);
export const getUserFeatureSelector = createSelector(
  (state, id) => id,
  usersGeoJSONSelector,
  (id, users) =>
    users.features.filter(feature => feature.properties.user === id)[0]
);
/**
 * Action Creators
 * */
export const fetchAllUsers = () => ({
  type: FETCH_ALL.REQUEST
});
export const getUsersSuggestions = value => ({
  type: GET_SUGGESTIONS.REQUEST,
  payload: value
});
/**
 * Sagas
 **/

function* fetchRequestSaga() {
  const items = cities;
  yield put({ type: FETCH_ALL.SUCCESS, payload: items });
}
function* getUsersSuggestionsSaga({ payload }) {
  const items = yield select(usersSelector);

  const escapedValue = payload.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let result = [];
  if (escapedValue !== "") {
    const regex = new RegExp(escapedValue, "i");

    result = items.filter(
      item =>
        regex.test(item.nickname) ||
        regex.test(item.city) ||
        regex.test(item.country)
    );
  }
  yield put({ type: GET_SUGGESTIONS.SUCCESS, payload: result });
}

export function* saga() {
  const result = yield all([
    takeEvery(FETCH_ALL.REQUEST, fetchRequestSaga),
    takeEvery(GET_SUGGESTIONS.REQUEST, getUsersSuggestionsSaga)
  ]);
}
