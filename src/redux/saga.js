import { all } from "redux-saga/effects";
import { saga as usersSaga } from "../ducks/users";
import { saga as mapSaga } from "../ducks/map";

export default function*() {
  yield all([usersSaga(), mapSaga()]);
}
