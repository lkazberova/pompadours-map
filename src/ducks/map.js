import { all } from "redux-saga/effects";
import { createAsyncAction } from "../helpers/redux";
import { put, takeEvery } from "redux-saga/effects";
import { createSelector } from "reselect";
import cities from "../mockups/cities";
import config from "../components/map/config";
/**
 * Constants
 * */
export const moduleName = "map";
const prefix = `${moduleName}`;

export const SET_CENTER = `${prefix}/SET_CENTER`;
export const SET_STYLE = `${prefix}/SET_STYLE`;
/**
 * Reducer
 * */
const initialState = {
  center: false,
  style: config.styles.street
};
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_STYLE:
      return { ...state, style: payload };
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
/**
 * Action Creators
 * */
export const setStyle = style => ({ type: SET_STYLE, payload: style });
/**
 * Sagas
 **/

export function* saga() {
  const result = yield all([]);
}
