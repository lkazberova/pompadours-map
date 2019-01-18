import { all, call, put, takeLatest, select } from "redux-saga/effects";
import { createSelector } from "reselect";
import config from "../components/map/config";
import { getGooglePlaceDetails } from "./geocode";
import { getUserFeatureSelector } from "./users";

/**
 * Constants
 * */
export const moduleName = "map";
const prefix = `${moduleName}`;

export const SET_CENTER = `${prefix}/SET_CENTER`;
export const SET_BBOX = `${prefix}/SET_BBOX`;
export const SET_STYLE = `${prefix}/SET_STYLE`;
export const SET_POPUP = `${prefix}/SET_POPUP`;
export const MOVE_TO_PLACE_ID = `${prefix}/MOVE_TO_PLACE_ID`;
export const MOVE_TO_USER = `${prefix}/MOVE_TO_USER`;
/**
 * Reducer
 * */
const initialState = {
  center: [0, 0],
  zoom: [0],
  bbox: undefined,
  style: config.styles.street,
  popup: undefined
};
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_STYLE:
      return { ...state, style: payload };
    case SET_BBOX:
      return { ...state, bbox: payload };
    case SET_CENTER:
      if (payload.zoom)
        return { ...state, center: payload.center, zoom: payload.zoom };
      return { ...state, center: payload.center };
    case SET_POPUP:
      return { ...state, popup: payload };
    default:
      return state;
  }
}
/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];
export const styleSelector = createSelector(
  stateSelector,
  state => state.style
);
export const centerSelector = createSelector(
  stateSelector,
  state => state.center
);

export const zoomSelector = createSelector(
  stateSelector,
  state => state.zoom
);
export const bboxSelector = createSelector(
  stateSelector,
  state => state.bbox
);
export const popupSelector = createSelector(
  stateSelector,
  state => state.popup
);
/**
 * Action Creators
 * */
export const setStyle = style => ({ type: SET_STYLE, payload: style });
export const setPopup = popup => ({ type: SET_POPUP, payload: popup });
export const setBBox = bbox => ({ type: SET_BBOX, payload: bbox });
export const setCenter = (center, zoom) => ({
  type: SET_CENTER,
  payload: { center, zoom }
});
export const moveToPlaceId = placeId => ({
  type: MOVE_TO_PLACE_ID,
  payload: placeId
});

export const moveToUser = user => ({
  type: MOVE_TO_USER,
  payload: user
});

/**
 * Sagas
 **/
function* moveToPlaceIdSaga({ payload }) {
  try {
    const result = yield call(getGooglePlaceDetails, payload);
    if (result && result.bbox) {
      yield put(setBBox(result.bbox));
    }
  } catch (e) {
    console.log(e);
  }
}

function* moveToUserSaga({ payload }) {
  try {
    const feature = yield select(getUserFeatureSelector, payload.user);
    yield put(setPopup(feature));
    yield put(setCenter(feature.geometry.coordinates, [14]));
  } catch (e) {
    console.log(e);
  }
}
export function* saga() {
  const result = yield all([
    takeLatest(MOVE_TO_PLACE_ID, moveToPlaceIdSaga),
    takeLatest(MOVE_TO_USER, moveToUserSaga)
  ]);
}
