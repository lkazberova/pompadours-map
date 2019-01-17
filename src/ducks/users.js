import { all, put, takeEvery } from "redux-saga/effects";
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
export const FILTER = createSelector(`${prefix}/FILTER`);
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
