import { all } from "redux-saga/effects";
import { createAsyncAction } from "../helpers/redux";
import { put, takeEvery } from "redux-saga/effects";
import { createSelector } from "reselect";
import cities from "../mockups/cities";
/**
 * Constants
 * */
export const moduleName = "users";
const prefix = `${moduleName}`;

export const FETCH_ALL = createAsyncAction(`${prefix}/FETCH_ALL`);
/**
 * Reducer
 * */
const initialState = {
  loading: false,
  items: []
};
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL.REQUEST:
      return { ...state, loading: true };
    case FETCH_ALL.SUCCESS:
      return { ...state, loading: false, items: action.payload };

    default:
      return state;
  }
}
/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];
export const usersGeoJSONSelector = createSelector(
  stateSelector,
  state =>
    state.items.reduce(
      (result, value, key) => {
        const { city, user, lat, lng, nickname, avatar } = value;
        result.features[key] = {
          type: "Feature",
          properties: { city, user, nickname, avatar },
          geometry: {
            type: "Point",
            coordinates: [lng, lat]
          }
        };
        return result;
      },
      { type: "FeatureCollection", features: [] }
    )
);

/**
 * Action Creators
 * */
export const fetchAllUsers = () => ({
  type: FETCH_ALL.REQUEST
});
/**
 * Sagas
 **/

function* fetchRequestSaga() {
  const items = cities;
  yield put({ type: FETCH_ALL.SUCCESS, payload: items });
}

export function* saga() {
  const result = yield all([takeEvery(FETCH_ALL.REQUEST, fetchRequestSaga)]);
}
