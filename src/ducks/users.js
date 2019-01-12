import { all } from "redux-saga/effects";

/**
 * Constants
 * */
export const moduleName = "users";
const prefix = `${moduleName}`;

/**
 * Reducer
 * */
const initialState = {};
export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}
/**
 * Selectors
 * */

/**
 * Action Creators
 * */

/**
 * Sagas
 **/

export function* saga() {
  const result = yield all([
    // takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
  ]);
}
